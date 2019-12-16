# BarkBark

[![Build Status](https://travis-ci.com/DonaCrio/BarkBark.svg?branch=master)](https://travis-ci.com/DonaCrio/BarkBark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## HTTP logs monitoring application

## Getting the app up and running

You can either build and run this app locally using Node version 10 or Docker.

### Using Node 10

You need to have the following programs installed on your machine:

- `node=^10.17.0`

First build the application:

```
npm run build
```

Then run the app:

```
npm start
```

### Run the app in dev mode

You first need to install the node modules:

```
npm install
```

Then run the app in dev mode:

```
npm run dev
```

## Development notes

## Testing

For testing purposes and maintainability, unit tests have been written. You can run them by using the following command:

```
npm run test
```

## Dockerfile

The app cannot be run into a Docker container for now because the console library used to build the interface seems \
to be incompatible with Docker. However, we keep a Dockerfile for the CI jobs (see next section).

## Repository and CI

The development has been made using [a GitHub repository](https://www.github.com/donacrio/BarkBark).
Pull requests were made to avoid commiting on master directly. Every PR needed to have it's Travis CI jobs passing.
The Travis jobs are defined in `.travis.yml` file at the root of the project. We build a docker container for every PR to ensure the app is compatible with NodeJS version 10 before every merge on master.
You can see the details of every jobs that ran on [the Travis repository](https://travis-ci.com/DonaCrio/BarkBark).
