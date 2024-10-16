import { Connection } from 'amqplib';

export async function getChannel(connection: Connection, queueName: string, routingKey?: string) {
  const name = routingKey ? `${queueName}.${routingKey}` : queueName;
  const channel = await connection.createChannel();
  const exchange = await channel.assertExchange('omotes_exchange', 'direct');
  const queue = await channel.assertQueue(name, { durable: true });
  await channel.bindQueue(queue.queue, exchange.exchange, name);
  return { channel, exchange };
}