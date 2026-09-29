require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const amqp = require('amqplib');
const { Pool } = require('pg');
const { GoogleGenAI } = require('@google/genai');
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = 3000;
app.get("/images/:key", async (req, res) => {
  try {
    const command = new GetObjectCommand({
      Bucket: "dress-images",
      Key: req.params.key,
    });

    const response = await s3Client.send(command);

    if (response.ContentType) {
      res.setHeader("Content-Type", response.ContentType);
    }

    response.Body.pipe(res);

  } catch (error) {
    console.error("Image fetch error:", error);
    res.status(500).send("Could not load image");
  }
});
app.get('/protected-test', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully.',
    user: req.user
  });
});

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

// Configure connection to local Postgres
const pool = new Pool({
  host: process.env.PG_HOST,
  port: 5432,
  database: 'postgres',
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl:false ,
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
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS color_rgb JSONB,
  ADD COLUMN IF NOT EXISTS attributes JSONB,
  ADD COLUMN IF NOT EXISTS user_id INTEGER,
  ADD COLUMN IF NOT EXISTS top_attribute_candidates JSONB;
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS wardrobe_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    category TEXT,
    color TEXT,
    pattern TEXT,
    material TEXT,
    attributes JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS outfits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150),
    prompt TEXT,
    wardrobe_match_score NUMERIC,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS outfit_items (
    id SERIAL PRIMARY KEY,
    outfit_id INTEGER NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    wardrobe_item_id INTEGER NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    item_role VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS post_likes (
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    is_group BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
  );
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

  console.log('Database tables ready.');
}
setupDatabase().catch(err => console.error('Database setup failed:', err));

// ===============================
// SIGNUP
// ===============================
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Check that all required fields were provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required.'
      });
    }

    // Check whether this email is already registered
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    // Never store the plain password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, profile_image_url, created_at
      `,
      [name, normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'Account created successfully.',
      user
    });

  } catch (error) {
    console.error('Signup failed:', error);

    res.status(500).json({
      message: 'Could not create account.'
    });
  }
});

// ===============================
// LOGIN
// ===============================

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    // Find the user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const user = result.rows[0];

    // Compare entered password with stored hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    // Create login token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // Send safe user information + token
    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image_url: user.profile_image_url
      }
    });

  } catch (error) {
    console.error('Login failed:', error);

    res.status(500).json({
      message: 'Could not log in.'
    });
  }
});

// ===============================
// GET USER'S WARDROBE
// ===============================

// =========================================================
// GET WARDROBE + SEARCH / FILTER
// =========================================================

app.get('/wardrobe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      category,
      color,
      pattern,
      material,
      search
    } = req.query;

    let query = `
      SELECT *
      FROM wardrobe_items
      WHERE user_id = $1
    `;

    const values = [userId];
    let paramIndex = 2;

    // Category filter
    if (category) {
      query += `
        AND LOWER(category) = LOWER($${paramIndex})
      `;
      values.push(category);
      paramIndex++;
    }

    // Colour filter
    if (color) {
      query += `
        AND LOWER(color) = LOWER($${paramIndex})
      `;
      values.push(color);
      paramIndex++;
    }

    // Pattern filter
    if (pattern) {
      query += `
        AND LOWER(pattern) = LOWER($${paramIndex})
      `;
      values.push(pattern);
      paramIndex++;
    }

    // Material filter
    if (material) {
      query += `
        AND LOWER(material) = LOWER($${paramIndex})
      `;
      values.push(material);
      paramIndex++;
    }

    // General search
    if (search) {
      query += `
        AND (
          category ILIKE $${paramIndex}
          OR color ILIKE $${paramIndex}
          OR pattern ILIKE $${paramIndex}
          OR material ILIKE $${paramIndex}
          OR attributes::text ILIKE $${paramIndex}
        )
      `;

      values.push(`%${search}%`);
      paramIndex++;
    }

    query += `
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, values);

    res.json({
      count: result.rows.length,
      items: result.rows
    });

  } catch (error) {
    console.error('Wardrobe search error:', error);

    res.status(500).json({
      message: 'Could not load wardrobe.'
    });
  }
});

// ===============================
// ADD WARDROBE ITEM
// ===============================

app.post('/wardrobe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      image_url,
      category,
      color,
      pattern,
      material,
      attributes
    } = req.body;

    if (!image_url) {
      return res.status(400).json({
        message: 'Image URL is required.'
      });
    }

    const result = await pool.query(
      `
      INSERT INTO wardrobe_items
        (user_id, image_url, category, color, pattern, material, attributes)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        userId,
        image_url,
        category || null,
        color || null,
        pattern || null,
        material || null,
        attributes || null
      ]
    );

    res.status(201).json({
      message: 'Wardrobe item added successfully.',
      item: result.rows[0]
    });

  } catch (error) {
    console.error('Failed to add wardrobe item:', error);

    res.status(500).json({
      message: 'Could not add wardrobe item.'
    });
  }
});

// ===============================
// UPDATE WARDROBE ITEM
// ===============================

app.put('/wardrobe/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = req.params.id;

    const {
      category,
      color,
      pattern,
      material,
      attributes
    } = req.body;

    const result = await pool.query(
      `
      UPDATE wardrobe_items
      SET
        category = COALESCE($1, category),
        color = COALESCE($2, color),
        pattern = COALESCE($3, pattern),
        material = COALESCE($4, material),
        attributes = COALESCE($5, attributes)
      WHERE id = $6
        AND user_id = $7
      RETURNING *
      `,
      [
        category,
        color,
        pattern,
        material,
        attributes,
        itemId,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Wardrobe item not found.'
      });
    }

    res.json({
      message: 'Wardrobe item updated successfully.',
      item: result.rows[0]
    });

  } catch (error) {
    console.error('Failed to update wardrobe item:', error);

    res.status(500).json({
      message: 'Could not update wardrobe item.'
    });
  }
});

// ===============================
// DELETE WARDROBE ITEM
// ===============================

app.delete('/wardrobe/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM wardrobe_items
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Wardrobe item not found.'
      });
    }

    res.json({
      message: 'Wardrobe item deleted successfully.'
    });

  } catch (error) {
    console.error('Failed to delete wardrobe item:', error);

    res.status(500).json({
      message: 'Could not delete wardrobe item.'
    });
  }
});

// =========================================================
// DRIPCHECK STYLE AI - GEMINI OUTFIT RECOMMENDATION
// =========================================================

app.post('/style/recommend', authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: 'Please enter what kind of outfit you want.'
      });
    }

    // 1. Get the logged-in user's REAL wardrobe
    const wardrobeResult = await client.query(
      `
        SELECT
          id,
          image_url,
          category,
          color,
          pattern,
          material,
          attributes
        FROM wardrobe_items
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId]
    );

    const wardrobe = wardrobeResult.rows;

    if (wardrobe.length === 0) {
      return res.status(400).json({
        message: 'Your wardrobe is empty. Add some clothes first.'
      });
    }

    // Give Gemini only the useful wardrobe information.
    const wardrobeForAI = wardrobe.map(item => ({
      id: item.id,
      category: item.category,
      color: item.color,
      pattern: item.pattern,
      material: item.material,
      attributes: item.attributes
    }));

    const stylistPrompt = `
You are DripCheck AI, a personal fashion stylist.

The user asked:
"${prompt}"

Below is the user's ACTUAL wardrobe:

${JSON.stringify(wardrobeForAI, null, 2)}

Create the best possible outfit for the user's request.

IMPORTANT RULES:

1. selected_item_ids may ONLY contain IDs that exist in the wardrobe above.
2. Never invent an owned clothing item.
3. Consider occasion, style, colour harmony, clothing compatibility,
   weather implications mentioned by the user, and outfit completeness.
4. Prefer using clothes the user already owns.
5. wardrobe_match_score must be an integer from 0 to 100.
6. A high score means the owned wardrobe creates a strong,
   complete outfit for the request.
7. If an important piece is missing, put it in missing_items and
   reduce the wardrobe match score.
8. Missing items are recommendations only. Do NOT pretend the user owns them.
9. Give a concise, useful explanation for why the outfit works.
10. selected_item_ids must contain integer database IDs only.
`;

    // 2. Ask Gemini to reason over the wardrobe
    const response = await gemini.models.generateContent({
      model: 'gemini-3.8-flash',

      contents: stylistPrompt,

      config: {
        responseMimeType: 'application/json',

        responseSchema: {
          type: 'object',

          properties: {
            outfit_name: {
              type: 'string'
            },

            occasion: {
              type: 'string'
            },

            wardrobe_match_score: {
              type: 'integer',
              minimum: 0,
              maximum: 100
            },

            explanation: {
              type: 'string'
            },

            selected_item_ids: {
              type: 'array',
              items: {
                type: 'integer'
              }
            },

            missing_items: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },

          required: [
            'outfit_name',
            'occasion',
            'wardrobe_match_score',
            'explanation',
            'selected_item_ids',
            'missing_items'
          ]
        }
      }
    });

    const recommendation = JSON.parse(response.text);

    // 3. SECURITY / DATA VALIDATION
    // Never blindly trust IDs returned by an LLM.
    const ownedIds = new Set(
      wardrobe.map(item => Number(item.id))
    );

    const selectedIds = [
      ...new Set(
        recommendation.selected_item_ids
          .map(Number)
          .filter(id => ownedIds.has(id))
      )
    ];

    if (selectedIds.length === 0) {
      return res.status(422).json({
        message: 'AI could not build an outfit from your current wardrobe.',
        recommendation
      });
    }

    const score = Math.max(
      0,
      Math.min(
        100,
        Number(recommendation.wardrobe_match_score) || 0
      )
    );

    // 4. Start DB transaction
    await client.query('BEGIN');

    // Save generated outfit
    const outfitResult = await client.query(
      `
        INSERT INTO outfits
          (
            user_id,
            name,
            prompt,
            wardrobe_match_score,
            explanation
          )

        VALUES ($1, $2, $3, $4, $5)

        RETURNING *
      `,
      [
        userId,
        recommendation.outfit_name,
        prompt.trim(),
        score,
        recommendation.explanation
      ]
    );

    const outfit = outfitResult.rows[0];

    // 5. Save the wardrobe items belonging to the outfit
    for (const wardrobeItemId of selectedIds) {
      await client.query(
        `
          INSERT INTO outfit_items
            (
              outfit_id,
              wardrobe_item_id,
              item_role
            )

          VALUES ($1, $2, $3)
        `,
        [
          outfit.id,
          wardrobeItemId,
          'selected'
        ]
      );
    }

    await client.query('COMMIT');

    // 6. Return full clothing information to frontend
    const selectedItems = wardrobe.filter(item =>
      selectedIds.includes(Number(item.id))
    );

    res.status(201).json({
      message: 'DripCheck AI outfit generated successfully.',

      outfit: {
        id: outfit.id,
        name: recommendation.outfit_name,
        occasion: recommendation.occasion,
        prompt: prompt.trim(),

        wardrobe_match_score: score,

        explanation: recommendation.explanation,

        selected_items: selectedItems,

        missing_items: recommendation.missing_items
      }
    });

  } catch (error) {

    try {
      await client.query('ROLLBACK');
    } catch (_) {}

    console.error('Style AI error:', error);

    res.status(500).json({
      message: 'DripCheck AI could not generate an outfit.',
      error: error.message
    });

  } finally {
    client.release();
  }
});

// =========================================================
// DRIPCHECK COMMUNITY BACKEND
// Posts + Feed + Likes + Comments
// =========================================================


// ---------------------------------------------------------
// 1. CREATE A COMMUNITY POST
// ---------------------------------------------------------
app.post('/posts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { caption, image_url } = req.body;

    if (!caption?.trim() && !image_url?.trim()) {
      return res.status(400).json({
        message: 'A post must contain a caption or an image.'
      });
    }

    const result = await pool.query(
      `
        INSERT INTO posts
          (user_id, caption, image_url)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [
        userId,
        caption?.trim() || null,
        image_url?.trim() || null
      ]
    );

    res.status(201).json({
      message: 'Post created successfully.',
      post: result.rows[0]
    });

  } catch (error) {
    console.error('Create post error:', error);

    res.status(500).json({
      message: 'Could not create post.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 2. GET COMMUNITY FEED
// ---------------------------------------------------------
app.get('/posts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          p.id,
          p.user_id,
          u.name,
          u.email,
          u.profile_image_url,
          p.caption,
          p.image_url,
          p.created_at,

          COUNT(DISTINCT pl.user_id)::int AS like_count,
          COUNT(DISTINCT c.id)::int AS comment_count,

          EXISTS (
            SELECT 1
            FROM post_likes my_like
            WHERE my_like.post_id = p.id
              AND my_like.user_id = $1
          ) AS liked_by_me

        FROM posts p

        JOIN users u
          ON u.id = p.user_id

        LEFT JOIN post_likes pl
          ON pl.post_id = p.id

        LEFT JOIN comments c
          ON c.post_id = p.id

        GROUP BY
          p.id,
          p.user_id,
          u.name,
          u.email,
          u.profile_image_url,
          p.caption,
          p.image_url,
          p.created_at

        ORDER BY p.created_at DESC
      `,
      [userId]
    );

    res.json({
      count: result.rows.length,
      posts: result.rows
    });

  } catch (error) {
    console.error('Get feed error:', error);

    res.status(500).json({
      message: 'Could not load community feed.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 3. DELETE OWN POST
// ---------------------------------------------------------
app.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;

    const result = await pool.query(
      `
        DELETE FROM posts
        WHERE id = $1
          AND user_id = $2
        RETURNING *
      `,
      [postId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Post not found or you do not own this post.'
      });
    }

    res.json({
      message: 'Post deleted successfully.'
    });

  } catch (error) {
    console.error('Delete post error:', error);

    res.status(500).json({
      message: 'Could not delete post.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 4. LIKE / UNLIKE A POST
// ---------------------------------------------------------
app.post('/posts/:id/like', authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const postId = req.params.id;

    const postCheck = await client.query(
      `SELECT id FROM posts WHERE id = $1`,
      [postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Post not found.'
      });
    }

    const existingLike = await client.query(
      `
        SELECT 1
        FROM post_likes
        WHERE post_id = $1
          AND user_id = $2
      `,
      [postId, userId]
    );

    if (existingLike.rows.length > 0) {
      await client.query(
        `
          DELETE FROM post_likes
          WHERE post_id = $1
            AND user_id = $2
        `,
        [postId, userId]
      );

      return res.json({
        message: 'Post unliked.',
        liked: false
      });
    }

    await client.query(
      `
        INSERT INTO post_likes
          (post_id, user_id)
        VALUES ($1, $2)
      `,
      [postId, userId]
    );

    res.json({
      message: 'Post liked.',
      liked: true
    });

  } catch (error) {
    console.error('Like post error:', error);

    res.status(500).json({
      message: 'Could not update like.',
      error: error.message
    });

  } finally {
    client.release();
  }
});


// ---------------------------------------------------------
// 5. ADD COMMENT
// ---------------------------------------------------------
app.post('/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: 'Comment cannot be empty.'
      });
    }

    const postCheck = await pool.query(
      `SELECT id FROM posts WHERE id = $1`,
      [postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Post not found.'
      });
    }

    const result = await pool.query(
      `
        INSERT INTO comments
          (post_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [
        postId,
        userId,
        content.trim()
      ]
    );

    res.status(201).json({
      message: 'Comment added successfully.',
      comment: result.rows[0]
    });

  } catch (error) {
    console.error('Add comment error:', error);

    res.status(500).json({
      message: 'Could not add comment.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 6. GET COMMENTS FOR A POST
// ---------------------------------------------------------
app.get('/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await pool.query(
      `
        SELECT
          c.id,
          c.content,
          c.created_at,
          c.user_id,
          u.name,
          u.profile_image_url
        FROM comments c

        JOIN users u
          ON u.id = c.user_id

        WHERE c.post_id = $1

        ORDER BY c.created_at ASC
      `,
      [postId]
    );

    res.json({
      count: result.rows.length,
      comments: result.rows
    });

  } catch (error) {
    console.error('Get comments error:', error);

    res.status(500).json({
      message: 'Could not load comments.',
      error: error.message
    });
  }
});

// =========================================================
// DRIPCHECK MESSAGING BACKEND
// Conversations + Members + Messages
// =========================================================


// ---------------------------------------------------------
// 1. CREATE A CONVERSATION
// ---------------------------------------------------------
app.post('/conversations', authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { member_ids } = req.body;

    if (!Array.isArray(member_ids) || member_ids.length === 0) {
      return res.status(400).json({
        message: 'Please provide at least one user to start a conversation.'
      });
    }

    const allMemberIds = [
      ...new Set([
        Number(userId),
        ...member_ids.map(Number)
      ])
    ];

    const validUsers = await client.query(
      `
        SELECT id
        FROM users
        WHERE id = ANY($1::int[])
      `,
      [allMemberIds]
    );

    if (validUsers.rows.length !== allMemberIds.length) {
      return res.status(400).json({
        message: 'One or more users do not exist.'
      });
    }

    await client.query('BEGIN');

    const conversationResult = await client.query(
      `
        INSERT INTO conversations DEFAULT VALUES
        RETURNING *
      `
    );

    const conversation = conversationResult.rows[0];

    for (const memberId of allMemberIds) {
      await client.query(
        `
          INSERT INTO conversation_members
            (conversation_id, user_id)
          VALUES ($1, $2)
        `,
        [conversation.id, memberId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Conversation created successfully.',
      conversation,
      member_ids: allMemberIds
    });

  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (_) {}

    console.error('Create conversation error:', error);

    res.status(500).json({
      message: 'Could not create conversation.',
      error: error.message
    });

  } finally {
    client.release();
  }
});


// ---------------------------------------------------------
// 2. GET MY CONVERSATIONS
// ---------------------------------------------------------
app.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          c.id,
          c.created_at,

          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', u.id,
                'name', u.name,
                'email', u.email,
                'profile_image_url', u.profile_image_url
              )
            ) FILTER (WHERE u.id IS NOT NULL),
            '[]'
          ) AS members,

          (
            SELECT m.content
            FROM messages m
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
          ) AS last_message,

          (
            SELECT m.created_at
            FROM messages m
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
          ) AS last_message_at

        FROM conversations c

        JOIN conversation_members mine
          ON mine.conversation_id = c.id
         AND mine.user_id = $1

        JOIN conversation_members cm
          ON cm.conversation_id = c.id

        JOIN users u
          ON u.id = cm.user_id

        GROUP BY c.id, c.created_at

        ORDER BY
          last_message_at DESC NULLS LAST,
          c.created_at DESC
      `,
      [userId]
    );

    res.json({
      count: result.rows.length,
      conversations: result.rows
    });

  } catch (error) {
    console.error('Get conversations error:', error);

    res.status(500).json({
      message: 'Could not load conversations.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 3. GET MESSAGES IN A CONVERSATION
// ---------------------------------------------------------
app.get(
  '/conversations/:id/messages',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const conversationId = req.params.id;

      const membership = await pool.query(
        `
          SELECT 1
          FROM conversation_members
          WHERE conversation_id = $1
            AND user_id = $2
        `,
        [conversationId, userId]
      );

      if (membership.rows.length === 0) {
        return res.status(403).json({
          message: 'You are not a member of this conversation.'
        });
      }

      const result = await pool.query(
        `
          SELECT
            m.id,
            m.conversation_id,
            m.sender_id,
            m.content,
            m.created_at,
            u.name AS sender_name,
            u.profile_image_url AS sender_profile_image_url

          FROM messages m

          JOIN users u
            ON u.id = m.sender_id

          WHERE m.conversation_id = $1

          ORDER BY m.created_at ASC
        `,
        [conversationId]
      );

      res.json({
        count: result.rows.length,
        messages: result.rows
      });

    } catch (error) {
      console.error('Get messages error:', error);

      res.status(500).json({
        message: 'Could not load messages.',
        error: error.message
      });
    }
  }
);


// ---------------------------------------------------------
// 4. SEND MESSAGE
// ---------------------------------------------------------
app.post(
  '/conversations/:id/messages',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const conversationId = req.params.id;
      const { content } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({
          message: 'Message cannot be empty.'
        });
      }

      const membership = await pool.query(
        `
          SELECT 1
          FROM conversation_members
          WHERE conversation_id = $1
            AND user_id = $2
        `,
        [conversationId, userId]
      );

      if (membership.rows.length === 0) {
        return res.status(403).json({
          message: 'You are not a member of this conversation.'
        });
      }

      const result = await pool.query(
        `
          INSERT INTO messages
            (conversation_id, sender_id, content)
          VALUES ($1, $2, $3)
          RETURNING *
        `,
        [
          conversationId,
          userId,
          content.trim()
        ]
      );

      const savedMessage = result.rows[0];

io.to(`conversation_${conversationId}`).emit(
  'new_message',
  savedMessage
);

      res.status(201).json({
        message: 'Message sent successfully.',
        chat_message: savedMessage
      });

    } catch (error) {
      console.error('Send message error:', error);

      res.status(500).json({
        message: 'Could not send message.',
        error: error.message
      });
    }
  }
);


// ---------------------------------------------------------
// 5. DELETE MY OWN MESSAGE
// ---------------------------------------------------------
app.delete('/messages/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;

    const result = await pool.query(
      `
        DELETE FROM messages
        WHERE id = $1
          AND sender_id = $2
        RETURNING id
      `,
      [messageId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Message not found or you cannot delete it.'
      });
    }

    res.json({
      message: 'Message deleted successfully.'
    });

  } catch (error) {
    console.error('Delete message error:', error);

    res.status(500).json({
      message: 'Could not delete message.',
      error: error.message
    });
  }
});

// =========================================================
// DRIPCHECK REAL-TIME CHAT - SOCKET.IO
// =========================================================

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // User enters a conversation room
  socket.on('join_conversation', (conversationId) => {
    const room = `conversation_${conversationId}`;

    socket.join(room);

    console.log(
      `Socket ${socket.id} joined ${room}`
    );
  });

  // User leaves a conversation room
  socket.on('leave_conversation', (conversationId) => {
    const room = `conversation_${conversationId}`;

    socket.leave(room);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// =========================================================
// DRIPCHECK PROFILE BACKEND
// View Profile + Edit Profile + User Stats
// =========================================================


// ---------------------------------------------------------
// 1. GET MY PROFILE
// ---------------------------------------------------------
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          u.id,
          u.name,
          u.email,
          u.profile_image_url,
          u.created_at,

          (
            SELECT COUNT(*)::int
            FROM wardrobe_items w
            WHERE w.user_id = u.id
          ) AS wardrobe_count,

          (
            SELECT COUNT(*)::int
            FROM posts p
            WHERE p.user_id = u.id
          ) AS post_count,

          (
            SELECT COUNT(*)::int
            FROM outfits o
            WHERE o.user_id = u.id
          ) AS outfit_count

        FROM users u
        WHERE u.id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    res.json({
      profile: result.rows[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      message: 'Could not load profile.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 2. EDIT MY PROFILE
// ---------------------------------------------------------
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, profile_image_url } = req.body;

    if (
      name !== undefined &&
      !String(name).trim()
    ) {
      return res.status(400).json({
        message: 'Name cannot be empty.'
      });
    }

    const result = await pool.query(
      `
        UPDATE users

        SET
          name = COALESCE($1, name),
          profile_image_url = COALESCE($2, profile_image_url)

        WHERE id = $3

        RETURNING
          id,
          name,
          email,
          profile_image_url,
          created_at
      `,
      [
        name !== undefined
          ? String(name).trim()
          : null,

        profile_image_url !== undefined
          ? profile_image_url
          : null,

        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    res.json({
      message: 'Profile updated successfully.',
      profile: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);

    res.status(500).json({
      message: 'Could not update profile.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 3. GET MY POSTS
// ---------------------------------------------------------
app.get('/profile/posts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          p.id,
          p.caption,
          p.image_url,
          p.created_at,

          COUNT(DISTINCT pl.user_id)::int
            AS like_count,

          COUNT(DISTINCT c.id)::int
            AS comment_count

        FROM posts p

        LEFT JOIN post_likes pl
          ON pl.post_id = p.id

        LEFT JOIN comments c
          ON c.post_id = p.id

        WHERE p.user_id = $1

        GROUP BY
          p.id,
          p.caption,
          p.image_url,
          p.created_at

        ORDER BY p.created_at DESC
      `,
      [userId]
    );

    res.json({
      count: result.rows.length,
      posts: result.rows
    });

  } catch (error) {
    console.error('Get profile posts error:', error);

    res.status(500).json({
      message: 'Could not load profile posts.',
      error: error.message
    });
  }
});


// ---------------------------------------------------------
// 4. GET MY GENERATED OUTFITS
// ---------------------------------------------------------
app.get('/profile/outfits', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          o.id,
          o.name,
          o.prompt,
          o.wardrobe_match_score,
          o.explanation,
          o.created_at,

          COALESCE(
            json_agg(
              jsonb_build_object(
                'id', w.id,
                'image_url', w.image_url,
                'category', w.category,
                'color', w.color,
                'pattern', w.pattern,
                'material', w.material,
                'attributes', w.attributes
              )
            ) FILTER (WHERE w.id IS NOT NULL),
            '[]'
          ) AS items

        FROM outfits o

        LEFT JOIN outfit_items oi
          ON oi.outfit_id = o.id

        LEFT JOIN wardrobe_items w
          ON w.id = oi.wardrobe_item_id

        WHERE o.user_id = $1

        GROUP BY
          o.id,
          o.name,
          o.prompt,
          o.wardrobe_match_score,
          o.explanation,
          o.created_at

        ORDER BY o.created_at DESC
      `,
      [userId]
    );

    res.json({
      count: result.rows.length,
      outfits: result.rows
    });

  } catch (error) {
    console.error('Get profile outfits error:', error);

    res.status(500).json({
      message: 'Could not load generated outfits.',
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('Dress Classifier API is running.');
});

app.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
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

    const userId = req.user.userId;

await pool.query(
  `
  INSERT INTO classification_results
    (job_id, image_url, status, user_id)
  VALUES
    ($1, $2, 'pending', $3)
  `,
  [jobId, uploadResult.Location, userId]
);

    const job = {
      job_id: jobId,
      user_id: userId,
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

server.listen(PORT, () => {
  console.log(`Dress Classifier API listening at http://localhost:${PORT}`);
  console.log(`Socket.IO real-time chat ready`);
});