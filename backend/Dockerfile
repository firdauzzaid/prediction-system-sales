FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy data dan ml dari root (penting!)
COPY data/ ./data/
COPY ml/ ./ml/

# Set environment variables dengan absolute path yang benar
ENV PYTHONPATH=/app
ENV PORT=${PORT:-8000}
ENV CSV_FILE_PATH=/app/data/sales_data.csv
ENV MODEL_FILE_PATH=/app/ml/model.pkl

# Set working directory
WORKDIR /app/backend

EXPOSE 8000

CMD ["python", "run.py"]