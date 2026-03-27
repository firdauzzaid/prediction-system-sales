FROM python:3.11-slim

WORKDIR /app

# Copy requirements dari folder backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh isi folder backend ke /app/backend
COPY backend/ ./backend/

# Copy data dan ml dari parent directory
COPY ../data ./data
COPY ../ml ./ml

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=${PORT:-8000}
ENV CSV_FILE_PATH=/app/data/sales_data.csv
ENV MODEL_FILE_PATH=/app/ml/model.pkl

# Debug: Lihat struktur
RUN echo "=== Directory Structure ===" && \
    ls -la /app/ && \
    echo "=== Backend Directory ===" && \
    ls -la /app/backend/ && \
    echo "=== App Directory ===" && \
    ls -la /app/backend/app/ && \
    echo "=== Data Directory ===" && \
    ls -la /app/data/ && \
    echo "=== ML Directory ===" && \
    ls -la /app/ml/

# Set working directory ke backend
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "run.py"]