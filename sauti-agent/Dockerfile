# Cloud Run deployment for Sauti ADK Agent
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

ENV GOOGLE_CLOUD_PROJECT_ID=njiapanda-safe-space
ENV GOOGLE_CLOUD_LOCATION=us-central1

EXPOSE 8080

CMD ["python", "main.py"]
