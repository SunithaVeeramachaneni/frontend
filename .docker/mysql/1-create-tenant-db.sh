mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE Innovapptive;
use CWPCatalog;
GRANT ALL PRIVILEGES ON Innovapptive.* TO '$MYSQL_USER'@'%';
"
