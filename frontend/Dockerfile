FROM node:latest
COPY . .
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build
CMD npm run start