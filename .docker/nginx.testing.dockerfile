# Stage 1
FROM node:14.18.2-alpine as build
LABEL author="CWP Development Team"
WORKDIR /usr/src/cwp
ARG NPM_AUTH_TOKEN
COPY . .
RUN npm i
RUN npm run testing -- --delete-output-path false

# Stage 2
FROM nginx:alpine
COPY --from=build /usr/src/cwp/.docker/nginx/cwpqa.innovapptive.com /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/cwp/.docker/keys/inv_21_22_SSLChain_key.pem /etc/nginx/cwp-keys/
COPY --from=build /usr/src/cwp/.docker/keys/inv_21_22_SSLPrivate_key.pem /etc/nginx/cwp-keys/
COPY --from=build /usr/src/cwp/dist/cwp /usr/share/nginx/html/cwp

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80 443
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
