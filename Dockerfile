
# Этап сборки
FROM node:18-alpine AS build

WORKDIR /app

# Скопировать package.json и package-lock.json
COPY package*.json ./

# Установить зависимости
RUN npm install

# Скопировать остальные файлы и собрать проект
COPY . .
RUN npm run build

# Этап запуска (Nginx для отдачи статики)
FROM nginx:stable-alpine

# Удаляем дефолтную конфигурацию и копируем свою (по желанию)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение в папку nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]