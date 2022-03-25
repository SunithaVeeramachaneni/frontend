server {
    listen 80 ;
    listen [::]:80 ;
    root  /usr/share/nginx/html/cwp;
    server_name cwpqa.innovapptive.com;
    # Client side Redirect to HTTPS
    return 301 https://$host$request_uri;
}
#Settings for a TLS enabled server.
#
server {
    listen       443 ssl http2 ;
    listen       [::]:443 ssl http2 ;
    server_name cwpqa.innovapptive.com;
    client_max_body_size 100m;
    # root         /usr/share/nginx/html/cwp;
    ssl_certificate     "/etc/nginx/cwp-keys/inv_21_22_SSLChain_key.pem";
    ssl_certificate_key "/etc/nginx/cwp-keys/inv_21_22_SSLPrivate_key.pem";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    # Load configuration files for the default server block.
    # include /etc/nginx/default.d/*.conf;
    location / {
        root    /usr/share/nginx/html/cwp/;
    }
    location /wiapi {
        proxy_pass http://wi-service-testing:8001;#whatever port your app run
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /wiapi/appmetrics-dash {
        proxy_pass http://wi-service-testing:8001/appmetrics-dash;#whatever port your app run
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /wiabapapi {
        proxy_pass http://wi-abap-service-testing:8002;#whatever port your app run
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /wiabapapi/appmetrics-dash {
        proxy_pass http://wi-abap-service-testing:8002/appmetrics-dash;#whatever port your app run
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /mccspccabapapi {
        proxy_pass http://mcc-spcc-abap-service-testing:8003;#whatever port your app run
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /mccspccabapapi/appmetrics-dash {
        proxy_pass http://mcc-spcc-abap-service-testing:8003/appmetrics-dash;#whatever port your app run
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /dashboardapi {
        proxy_pass http://dashboard-service-testing:8004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /dashboardapi/appmetrics-dash {
        proxy_pass http://dashboard-service-testing:8004/appmetrics-dash;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /datacollectorapi {
        proxy_pass http://data-collector-service-testing:8005/datacollectorapi;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    error_page 404 /404.html;
    location = /404.html {
    }
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
}
