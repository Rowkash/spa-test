### Run with Docker

- Run the command:

```shell
docker compose build
docker compose up -d
# -d - to run in the background
# --build - to rebuild containers
```
### Documentation on using the API is located at the link "http://localhost:3000/api"
### Adminer for operate with db - "http://localhost:5000"

Data connect to db in .env file

### Example .env file

```shell
PORT=3000

DATABASE_TYPE=mysql
# DATABASE_HOST=localhost
DATABASE_HOST=db # for docker
DATABASE_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=adminroot
MYSQL_DATABASE=dzen-test
MYSQL_ROOT_PASSWORD=adminroot
DATABASE_SYNCHRONIZE=false

# REDIS_HOST=localhost
REDIS_HOST=redis # for docker
REDIS_PORT=6379

JWT_SECRET=kardashian
```

Also you can rename file " env-example " in main project folder 
