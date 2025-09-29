# Этап сборки
FROM node:20-alpine AS build

WORKDIR /app

# 1) тянем lock-файл и ставим ВСЕ зависимости (включая dev)
COPY package*.json ./
RUN npm ci

# 2) копируем код и билдим
COPY . .
RUN npm run build

# Этап запуска (Nginx)
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]