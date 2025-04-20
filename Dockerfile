FROM python:3.12-alpine AS builder

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app

RUN apk add --no-cache gcc musl-dev libffi-dev openssl-dev python3-dev

RUN python -m venv $VIRTUAL_ENV && pip install --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-alpine

ENV PATH="/opt/venv/bin:$PATH"
WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY . .

RUN adduser -D appuser
USER appuser

EXPOSE 5000

CMD ["python", "app.py"]
