import { Connection } from 'amqplib';
import { from, map, shareReplay } from 'rxjs';
import { getChannel } from './channel';
import { AvailableWorkflowsHandler } from './handlers/AvailableWorkflowsHandler';
import { RequestAvailableWorkflowsHandler } from './handlers/RequestAvailableWorkflowsHandler';

export async function setupAvailableWorkflows(connection: Connection, clientId: string) {
  const availableChannel$ = from(getChannel(connection, `available_workflows.${clientId}`, 'available_workflows')).pipe(
    map(({ channel }) => channel)
  );
  const { channel: requestChannel } = await getChannel(connection, 'request_available_workflows');

  const requestHandler = new RequestAvailableWorkflowsHandler();
  const workflowsHandler = new AvailableWorkflowsHandler(availableChannel$, clientId);
  requestHandler.start(requestChannel);
  return workflowsHandler.getWorkflows().pipe(shareReplay(1));
}

