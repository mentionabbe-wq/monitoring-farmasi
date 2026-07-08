# Opsional: build image sendiri (alternatif dari docker-compose.yml yang
# langsung memakai image node:20-alpine + bind mount).
FROM node:20-alpine
WORKDIR /app
COPY server.js index.html ./
COPY form ./form
ENV PORT=8080 DATA_DIR=/data
EXPOSE 8080
VOLUME /data
CMD ["node", "server.js"]
