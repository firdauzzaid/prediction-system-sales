FROM python:3.11-slim

# Set WORKDIR langsung ke backend
WORKDIR /app/backend

# Copy requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh project (path relatif ke WORKDIR)
COPY backend/ ./
COPY ../data/ /app/data/
COPY ../ml/ /app/ml/

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=${PORT:-8000}

# Jalankan langsung (tanpa cd)
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT