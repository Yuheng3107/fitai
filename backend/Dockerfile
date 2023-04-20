FROM python:3.10-slim

COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]