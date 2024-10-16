import { Connection } from 'amqplib';

export async function getChannel(connection: Connection, queueName: string, clientIdentifier?: string) {
  const name = clientIdentifier ? `${queueName}.${clientIdentifier}` : queueName;
  const channel = await connection.createChannel();
  const exchange = await channel.assertExchange('omotes_exchange', 'direct');
  const queue = await channel.assertQueue(name, { durable: true });
  await channel.bindQueue(queue.queue, exchange.exchange, name);
  return { channel, exchange };
}