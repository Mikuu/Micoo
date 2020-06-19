Run Micoo
--

There are 3 ways to launch Micoo, for local development, for testing with local images and for
deploying with images from Docker Hub.

> all below steps are executing from the project root directory.

#### Local development

- create exchange directory
```commandline
mkdir exchange
```

- containerize micoo-nginx service
```commandline
cd env/nginx/containerize
./build-image.sh
```

- launch environment
```commandline
cd env
docker-compose -f docker-compose.env.yaml up
```

- start micoo-dashboard service
```commandline
cd dashboard
npm build
MICOO_DB_USERNAME=micoo-user export MICOO_DB_PASSWORD=micoo-password npm start
```

- start micoo-engine service
```commandline
cd engine
npm build
MICOO_DB_USERNAME=micoo-user export MICOO_DB_PASSWORD=micoo-password npm start
```

- start micoo-postern service
```commandline
cd postern
npm build
MICOO_DB_USERNAME=micoo-user export MICOO_DB_PASSWORD=micoo-password npm start
```

#### Testing with local image

- containerize micoo-nginx service
```commandline
cd env/nginx/containerize
./build-image.sh
```

- containerize micoo-dashboard service
```commandline
cd dashboard
./build-image.sh
```

- containerize micoo-engine service
```commandline
cd engine
./build-image.sh
```

- containerize micoo-postern service
```commandline
cd postern
./build-image.sh
```

- launch all from local image
```commandline
cd env
docker-compose -f docker-compose.local.yaml up
```

#### Launch with images from Docker Hub
```commandline
cd env
docker-compose up
```
