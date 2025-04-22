# 1. Node 환경에서 빌드
FROM node:20 AS builder
WORKDIR /app

# yarn registry 변경
RUN yarn config set registry https://registry.npmjs.org/

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# 2. Nginx를 사용해 정적 파일 서빙
FROM nginx:1.23-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
