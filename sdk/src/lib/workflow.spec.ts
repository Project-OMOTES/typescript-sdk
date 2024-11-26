import { Connection } from 'amqplib';
import { MockConnection } from '../util/MockChannel.spec';
import { setupAvailableWorkflows } from './workflow';

describe('setupAvailableWorkflows', () => {
  let connection: MockConnection;
  beforeEach(() => {
    connection = new MockConnection();
  })

  it('should call create two channels', async () => {
    await setupAvailableWorkflows(connection as unknown as Connection, 'client_id');
    expect(connection.createChannel).toHaveBeenCalledTimes(2);
  });

  it('should assert queues in correct order', async () => {
    await setupAvailableWorkflows(connection as unknown as Connection, 'client_id');
    const assertCalls = connection.channel.assertQueue.mock.calls.map(([queueName]) => {
      return queueName;
    });
    expect(assertCalls).toEqual(['available_workflows.client_id']);
  })
});