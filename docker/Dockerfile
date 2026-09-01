FROM nginx:1.27-alpine

RUN apk add --no-cache git openssh-client

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY . /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/docker

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
