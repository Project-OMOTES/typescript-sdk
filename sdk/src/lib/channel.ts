import { Connection } from 'amqplib';

export async function getChannel(connection: Connection, queueName: string) {
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  return channel;
}