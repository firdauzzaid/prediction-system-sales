FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY data/ ./data/
COPY ml/ ./ml/

ENV PYTHONPATH=/app
ENV PORT=${PORT:-8000}
ENV CSV_FILE_PATH=/app/data/sales_data.csv
ENV MODEL_FILE_PATH=/app/ml/model.pkl

# Set working directory ke backend dimana run.py berada
WORKDIR /backend

# Expose port
EXPOSE 8000

CMD ["python", "run.py"]