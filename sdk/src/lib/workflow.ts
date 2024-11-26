import { RequestAvailableWorkflows } from '@omotes/proto';
import { Connection } from 'amqplib';
import { from, map, shareReplay } from 'rxjs';
import { getChannel } from './channel';
import { AvailableWorkflowsHandler } from './handlers/AvailableWorkflowsHandler';

export async function setupAvailableWorkflows(connection: Connection, clientId: string) {
  const availableChannel$ = from(getChannel(connection, `available_workflows.${clientId}`, 'available_workflows')).pipe(
    map(({ channel }) => channel)
  );
  const workflowsHandler = new AvailableWorkflowsHandler(availableChannel$, clientId);
  const requestChannel = await connection.createChannel();
  requestChannel.sendToQueue('request_available_workflows', Buffer.from(new RequestAvailableWorkflows().serializeBinary()));
  return {
    workflows: workflowsHandler.getWorkflows().pipe(shareReplay(1)),
    trigger: () => requestChannel.sendToQueue('request_available_workflows', Buffer.from(new RequestAvailableWorkflows().serializeBinary()))
  };
}

