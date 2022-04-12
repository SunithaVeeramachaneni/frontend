FROM nginx:alpine
LABEL author="CWP Development Team"

# npm run build -- --delete-output-path false --watch true
# docker build -f nginx.dev.dockerfile -t nginx-local .
# docker run -p 8080:80 -v ${pwd}/dist/cwp:/usr/share/nginx/html nginx-local
