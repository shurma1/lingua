# ----------------------------
# Стадия 1: Сборка фронтенда
# ----------------------------
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ----------------------------
# Стадия 2: Сборка сервера
# ----------------------------
FROM node:18 AS server-builder

WORKDIR /app/server

# Копируем package.json и устанавливаем ВСЕ зависимости (включая dev)
COPY server/package*.json ./
RUN npm install

COPY server/ ./

# Копируем собранный фронтенд в static
RUN mkdir -p static
COPY --from=frontend-builder /app/frontend/dist ./static

# Собираем TypeScript
RUN npm run build

# ----------------------------
# Стадия 3: Production образ
# ----------------------------
FROM node:18

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --only=production

# Копируйте остальные файлы
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/static ./static
COPY --from=server-builder /app/server/docs ./docs
COPY server/.env.production ./.env.production
COPY server/.env ./.env

RUN mkdir -p /app/media /app/logs

EXPOSE 8000
CMD ["npm", "run", "start"]
