FROM python:3.11-slim

WORKDIR /app

# Copy requirements from backend folder
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY backend/ ./backend/
COPY data/ ./data/
COPY ml/ ./ml/

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=${PORT:-8000}
ENV CSV_FILE_PATH=/app/data/sales_data.csv
ENV MODEL_FILE_PATH=/app/ml/model.pkl

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE ${PORT}

# Run the application - langsung dari WORKDIR yang sudah benar
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}