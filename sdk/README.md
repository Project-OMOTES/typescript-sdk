# @omotes/sdk

This library exposes functionality to publish and consume jobs on the [OMOTES computation engine](https://github.com/Project-OMOTES/computation-engine). Please make sure to follow the steps in that repository to get started running the computation engine locally.

## Documentation

### `OmotesSDK`

Main entry point of this SDK. Requires RabbitMQ port, credentials described above.

#### Example

```typescript
const sdk = new OmotesSDK({
  rabbitMQUrl: 'localhost',
  rabbitMQUsername: 'foo',
  rabbitMQPassword: 'bar',
  rabbitMQPort: 8088
});

// This is required to setup an AMQP connection.
await sdk.connect();
```

### Submitting a job

If you have an ESDL file ready to file with the OMOTES Computation Engine, you can submit a job like so:

```typescript
const job = await sdk.submitJob('grow_simulator', 'my-esdl');
```

This will return an instance of the class `Job` which can then be used to retrieve different `Handler`s (`ProgressHandler`, `ResultsHandler`, `StatusHandler`). These handlers all implement a getter method (`getProgress()`, `getResult()`, `getStatus()`). They return an `Observable<T>` with information on the submitted job.

### Handlers

#### ResultsHandler

Get a `ResultsHandler` like so:

```typescript
const job = await sdk.submitJob('grow_optimizer', 'esdl');
const resultsHandler = sdk.getResultsHandler(job.uuid);
resultsHandler.getResults().subscribe((result) => {
  expect(result).toEqual({
    uuid: 'uuid',
    logs: 'logs',
    outputEsdl: Buffer.from('output_esdl').toString('base64'),
    resultType: JobResult.ResultType.SUCCEEDED
  });
});
```

#### ProgressHandler

Get a `ProgressHandler` like so:

```typescript
const job = await sdk.submitJob('grow_optimizer', 'esdl');
const progressHandler = sdk.getProgressHandler(job.uuid);
progressHandler.getProgress().subscribe((progress) => {
  console.log(progress); // a value between 0 and 1
});
```

#### StatusHandler

Get a `StatusHandler` like so:

```typescript
const job = sdk.submitJob('grow_optimizer', 'esdl');
const statusHandler = sdk.getStatusHandler(job.uuid);
statusHandler.getStatus().subscribe((status) => {
  console.log(status); // one of 'REGISTERED' | 'ENQUEUED' | 'RUNNING' | 'FINISHED' | 'CANCELLED'
});
```

## Building

Run `nx build sdk` to build the library.

## Running unit tests

Run `nx test sdk` to execute the unit tests via [Jest](https://jestjs.io).
