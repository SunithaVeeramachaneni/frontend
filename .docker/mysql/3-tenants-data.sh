mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"use CWPCatalog;
UPDATE catalogs set erps = JSON_SET(erps, '$.sap.saml.clientSecret', '$SAML_CLIENT_SECRET'), erps = JSON_SET(erps, '$.sap.password', '$SAP_PASSWORD'), rdbms = JSON_SET(rdbms, '$.password', '$RDBMS_PASSWORD'), nosql = JSON_SET(nosql, '$.password', '$NOSQL_PASSWORD') where id=1;
GRANT ALL PRIVILEGES ON Innovapptive.* TO '$MYSQL_USER'@'%';
"

