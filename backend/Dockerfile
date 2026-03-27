FROM python:3.11-slim

WORKDIR /app

# Copy requirements (dari folder saat ini yaitu backend)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh folder backend ke /app/backend
COPY . ./backend/

# Copy data dan ml dari parent directory
COPY ../data/ ./data/
COPY ../ml/ ./ml/

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=${PORT:-8000}
ENV CSV_FILE_PATH=/app/data/sales_data.csv
ENV MODEL_FILE_PATH=/app/ml/model.pkl

# Set working directory ke backend
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "run.py"]