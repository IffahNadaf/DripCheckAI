require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const amqp = require('amqplib');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Configure connection to Supabase Postgres
const pool = new Pool({
  host: process.env.PG_HOST,
  port: 5432,
  database: 'postgres',
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

// --- RabbitMQ setup ---
const QUEUE_NAME = 'image_jobs';
let rabbitChannel = null;

async function setupRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  rabbitChannel = channel;
  console.log('RabbitMQ connected and queue asserted:', QUEUE_NAME);

  connection.on('close', () => {
    console.error('RabbitMQ connection closed. Retrying in 5s...');
    rabbitChannel = null;
    setTimeout(setupRabbitMQ, 5000);
  });
  connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err.message);
  });
}
setupRabbitMQ().catch(err => console.error('RabbitMQ setup failed:', err));

// Create the results table if it doesn't already exist
async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS classification_results (
      job_id UUID PRIMARY KEY,
      image_url TEXT,
      status TEXT DEFAULT 'pending',
      formal_pct NUMERIC,
      ethnic_pct NUMERIC,
      casual_pct NUMERIC,
      college_pct NUMERIC,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
  ALTER TABLE classification_results
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS category_id INTEGER,
  ADD COLUMN IF NOT EXISTS category_confidence NUMERIC,
  ADD COLUMN IF NOT EXISTS attributes JSONB,
  ADD COLUMN IF NOT EXISTS top_attribute_candidates JSONB;
`);

  console.log('Database table ready.');
}
setupDatabase().catch(err => console.error('Database setup failed:', err));

app.get('/', (req, res) => {
  res.send('Dress Classifier API is running.');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!rabbitChannel) {
      return res.status(503).send('Queue not ready, try again shortly.');
    }

    const fileStream = fs.createReadStream(req.file.path);

    const uploadResult = await new Upload({
      client: s3Client,
      params: {
        Bucket: 'dress-images',
        Key: req.file.filename,
        Body: fileStream,
      },
    }).done();

    console.log('Uploaded to MinIO:', uploadResult.Location);
    fs.unlinkSync(req.file.path);

    const jobId = crypto.randomUUID();

    await pool.query(
      `INSERT INTO classification_results (job_id, image_url, status) VALUES ($1, $2, 'pending')`,
      [jobId, uploadResult.Location]
    );

    const job = {
      job_id: jobId,
      image_url: uploadResult.Location,
      image_key: req.file.filename,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    rabbitChannel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
      persistent: true,
    });
    console.log('Published job to RabbitMQ:', job);

    res.json({ message: 'Image uploaded and queued for processing.', job_id: jobId });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).send('Upload failed.');
  }
});

app.get('/result/:job_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM classification_results WHERE job_id = $1`,
      [req.params.job_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch result failed:', err);
    res.status(500).send('Failed to fetch result.');
  }
});

app.listen(PORT, () => {
  console.log(`Dress Classifier API listening at http://localhost:${PORT}`);
});