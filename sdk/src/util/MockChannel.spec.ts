import { JobProgressUpdate } from '@omotes/proto';
import * as jspb from "google-protobuf";

export class MockConnection {
  public channel = new MockChannel();
  public readonly createChannel = jest.fn().mockResolvedValue(this.channel);
}

export class MockChannel<T extends jspb.Message> {
  private pushFn?: (message: { content: Buffer }) => void;
  public readonly consume = jest.fn().mockImplementation((_: string, pushFn: (message: { content: Buffer }) => void) => {
    this.pushFn = pushFn;
  });
  public close = jest.fn();
  public ack = jest.fn();
  public assertExchange = jest.fn().mockResolvedValue({ exchange: 'exchange' });
  public assertQueue = jest.fn().mockResolvedValue({ queue: 'queue' });
  public deleteQueue = jest.fn();
  public sendToQueue = jest.fn();
  public bindQueue = jest.fn();

  public pushMessage(message: T) {
    if (this.pushFn) {
      this.pushFn({
        content: Buffer.from(message.serializeBinary()),
      });
    }
  }
}

describe('MockChannel', () => {
  it('should create', () => {
    const mockChannel = new MockChannel();
    expect(mockChannel).toBeDefined();
  });

  it('should push message', (done) => {
    const mockChannel = new MockChannel();
    mockChannel.consume('test', (message: { content: Buffer }) => {
      expect(message.content).toBeDefined();
      const deserialized = JobProgressUpdate.deserializeBinary(message.content);
      expect(deserialized.toObject()).toEqual(expect.objectContaining({ progress: 0.5 }));
      done();
    });
    const message = new JobProgressUpdate();
    message.setProgress(0.5);
    mockChannel.pushMessage(message);
    expect(mockChannel.consume).toHaveBeenCalled();
  })
});