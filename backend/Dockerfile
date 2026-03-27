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

# Verifikasi versi library setelah install
RUN echo "=== Installed Library Versions ===" && \
    python -c "import numpy; print(f'numpy: {numpy.__version__}')" && \
    python -c "import sklearn; print(f'scikit-learn: {sklearn.__version__}')" && \
    python -c "import joblib; print(f'joblib: {joblib.__version__}')"

# Debug: Verify structure
RUN echo "=== Directory Structure Verification ===" && \
    echo "Root directory contents:" && \
    ls -la /app/ && \
    echo "\nBackend directory:" && \
    ls -la /app/backend/ && \
    echo "\nData directory:" && \
    ls -la /app/data/ && \
    echo "\nML directory:" && \
    ls -la /app/ml/ && \
    echo "\n=== File Verification ===" && \
    if [ -f /app/data/sales_data.csv ]; then echo "✓ Data file exists at /app/data/sales_data.csv"; else echo "✗ Data file missing"; fi && \
    if [ -f /app/ml/model.pkl ]; then echo "✓ Model file exists at /app/ml/model.pkl"; else echo "✗ Model file missing"; fi

# Set working directory
WORKDIR /app/backend

EXPOSE 8000

CMD ["python", "run.py"]