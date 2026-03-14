FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh project
COPY backend/ ./backend/
COPY data/ ./data/
COPY ml/ ./ml/

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=${PORT:-8000}

# Pastikan uvicorn bind ke 0.0.0.0 dan PORT yang benar
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT