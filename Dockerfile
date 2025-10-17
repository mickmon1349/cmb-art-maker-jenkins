# 使用 node 官方映像檔建立前端靜態檔案
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 使用輕量 nginx 供靜態檔案服務
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
