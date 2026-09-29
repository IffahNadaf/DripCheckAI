# DripCheck AI Integration

This repository contains the backend and AI worker integration for DripCheck.

## AI Models

The trained AI models are already included:

- `models/clothing_category_improved.keras`
- `models/clothing_attributes.keras`

**No model retraining is required.**

## System Flow

```text
Image Upload
     ↓
Node.js Backend
     ↓
MinIO
     ↓
RabbitMQ Queue
     ↓
Python AI Worker
     ↓
Category + Attribute Models
     ↓
PostgreSQL / Supabase
     ↓
GET /result/:job_id
```

## Setup Instructions

### 1. Clone the repository

```powershell
git clone https://github.com/IffahNadaf/DripCheckAI.git
cd DripCheckAI
```

### 2. Create the environment file

Create a `.env` file using `.env.example` and enter the actual credentials:

```env
MINIO_ENDPOINT=http://127.0.0.1:9000
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key

PG_HOST=your_supabase_host
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password

RABBITMQ_URL=amqp://localhost:5672
```

### 3. Install Node dependencies

```powershell
npm install
```

### 4. Create and activate Python environment

```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

### 5. Install AI dependencies

```powershell
pip install -r ai_worker/requirements.txt
```

### 6. Start the backend

In Terminal 1:

```powershell
node index.js
```

### 7. Start the AI worker

In Terminal 2:

```powershell
.\.venv\Scripts\activate
python ai_worker/worker.py
```

The worker will load both trained models and wait for jobs from the RabbitMQ `image_jobs` queue.

## Testing

Upload a clothing image through:

```text
POST http://localhost:3000/upload
```

Use `form-data` with the field name:

```text
image
```

The backend returns a `job_id`.

Then check the prediction using:

```text
GET http://localhost:3000/result/<job_id>
```

The completed result will contain the predicted clothing category, category confidence, attributes, and attribute confidence scores.

## Important

The `.keras` files are already trained models. The integration machine only needs to load them for inference. **Training does not need to be performed again.**