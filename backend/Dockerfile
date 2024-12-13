FROM python:3.12-alpine

WORKDIR /app

RUN apk update && apk add --no-cache postgresql-dev gcc musl-dev

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "127.0.0.1:8000"]
