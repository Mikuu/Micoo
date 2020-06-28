Run Micoo
--

There are 3 ways to launch Micoo, for local development, for testing with local images and for
deploying with images from Docker Hub.

> all below steps are executing from the project root directory.

#### Local development

- create exchange directory

```commandline
mkdir exchange
npm install
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
npm install
./run.sh
```

- start micoo-engine service

```commandline
cd engine
npm install
./run.sh
```

then, visit `http://localhost:3001`.

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

- launch all from local image

```commandline
cd env
docker-compose -f docker-compose.local.yaml up
```

then visit `http://localhost:8123`.

#### Launch with images from Docker Hub

```commandline
cd env
docker-compose up
```

then visit `http://localhost:8123`.

#### Launch with Postern

`postern` is not necessary for most of the cases, but if you need to use it, follow below

##### local development with Postern

go through the same steps as described in `Local development` above, then

- start micoo-postern service

```commandline
cd postern
npm install
./run.sh
```

##### local Docker image with Postern

go through the same containerization steps as described in `Testing with local image` above, before start compose,

- containerize micoo-postern service

```commandline
cd postern
./build-image.sh
```
 
- start all with another compose file

 ```commandline
 cd env
 docker-compose -f docker-compose.local.p.yaml up
 ```

then visit `http://localhost:8123`.

##### Docker Hub image with Postern

```commandline
cd env
docker-compose -f docker-compose.p.yaml up
```

then visit `http://localhost:8123`.
