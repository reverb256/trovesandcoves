FROM nginx:alpine
COPY dist/public /usr/share/nginx/html
EXPOSE 80
