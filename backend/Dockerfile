FROM python:3.11-slim

WORKDIR /app

# Copy requirements dan install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh project (karena backend perlu akses ke data/ dan ml/)
COPY backend/ ./backend/
COPY data/ ./data/
COPY ml/ ./ml/

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Expose port
EXPOSE 8000

# Jalankan aplikasi
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT