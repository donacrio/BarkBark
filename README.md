# BarkBark

[![Build Status](https://travis-ci.com/DonaCrio/BarkBark.svg?branch=master)](https://travis-ci.com/DonaCrio/BarkBark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## HTTP logs monitoring application

This is a simple monitoring application to monitor logs in a .csv file. It was part of Datadog hiring process.

### Tech choices

I choose to develop this application in NodeJS for the following reasons:

- It's a modern backend framework written in Javascript so the community is large and the language very common.
- It's an event-based language and I did not use Promise. That way there is no concurrency issues.
- It's compatible with Typescript! That way the code can be typed and it's much more secure. It's also easier to collaborate on the same codebase as a team.

### Project structure

The app is divided in 5 parts:

- The app (`/src/BarkBarkApp`): Main application that instantiates the services below. It runs them in a separate event loop.
- The parser (`/src/parser`): Parses the log file and enqueue the logs in a queue that is shared between the classes instances.
- The aggregators (`/src/aggregators`): Compute the metrics over a specific timeframe using the log queue. This part of the code is designed using an observer pattern for metric computing and a factory pattern for aggregator creation. That way all the logic is encapsulated and hidden from the other parts of the code.
- The alert handlers (`/src/alerts`): Watch the aggregators and raise an alert if their metric is above a given threshold. It uses the same patterns as the aggregators.
- The UI (`/src/ui`): Display the data in stdout.

The pros of using a factory pattern for ressources creation and running them in an observer pattern is that it is really easy to add a new kind of resource that is contracted by an abstract class or interface and then run into the manager. That way I was able to add the `ResponseCodeAggregator` very quickly !

## Run configuration

The different run configurations can be found at `src/config.ts`.
There is 3 different run configurations:

- `requestedConfig`: it's the configuration requested in the assignment. A log file is continuously generated and the app is monitoring this file. The metrics are computed over a 10 seconds timeframe and alerts are raised if the traffic is above 10 hits per seconds over the last 2 minutes.
- `testAlertingLogicConfig`: it's the configuration that can be used to test the alerting logic. A log file is generated before running the app.
- `noSimulationConfig`: a basic simulation using the sample data provided in the assignment. This simulation is short and used to check that everything if working fine.

### Setting a run configuration

To set a run configuration you need to pass it as an argument to the `BarkBark` class in the `src/app.ts` file.

### Creating a run configuration

If you want to play with the app you can create your own configuration. In order to avoid any error you need to create an object with `BarkBarkConfig` type and pass it to the `BarkBark` class constructor in the `src/app.ts` file.

## Getting the app up and running

You can either build and run this app locally using Node version 10 or Docker.

### Using Node 10

You need to have the following programs installed on your machine:

- `node 10.17`

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

## Testing the alerting logic

To test the alerting logic you can use the configuration `testAlertingLogicConfig`. It will generate a `.csv` file with logs behaving like the following:

- Normal traffic
- High traffic
- Normal traffic

That way if the alerting logic id working you should be able to see an alert being raised and the recovered.

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
The Travis jobs are defined in `.travis.yml` file at the root of the project. We build a docker container for every PR to ensure the app is compatible with Node JS version 10 before every merge on master.
You can see the details of every jobs that ran on [the Travis repository](https://travis-ci.com/DonaCrio/BarkBark).

## Improvements

Some improvements can be done on this project:

- Because every part of the application is independent, we could run some services `Parser`, `AggregatorManager`, `AlertManager` or `UI` in different processes and make them communicate through socket or HTTP requests. That way we could scale up the app easily.
- We could enhance the UI with a web application in order to display beautiful diagrams and tables. That way the app would also be much more customizable.
- We could store the historical data into a database in order to keep track of the metrics over a long period of time (using more memory would be expensive).
- We could handle multiple `Parser` services to speed up the parsing process and parse multiple sources.
