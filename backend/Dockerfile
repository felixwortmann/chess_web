FROM python:latest
RUN pip install gunicorn
WORKDIR /app/backend
RUN git clone https://github.com/felixwortmann/chess
WORKDIR /app/backend/chess
RUN pip install -r requirements.txt
COPY run_server.py /app/backend/chess
CMD gunicorn --bind 0.0.0.0:5000 run_server:app