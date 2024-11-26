import { Connection } from 'amqplib';

export async function getChannel(connection: Connection, queueName: string, routingKey?: string) {
  const channel = await connection.createChannel();
  const exchange = await channel.assertExchange('omotes_exchange', 'direct', { durable: false });
  const queue = await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queue.queue, exchange.exchange, routingKey ?? queueName);
  return { channel, exchange };
}