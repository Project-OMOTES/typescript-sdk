import { JobProgressUpdate } from '@omotes/proto';
import * as jspb from "google-protobuf";

export class MockChannel<T extends jspb.Message> {
  private pushFn?: (message: { content: Buffer }) => void;
  public readonly consume = jest.fn().mockImplementation((_: string, pushFn: (message: { content: Buffer }) => void) => {
    this.pushFn = pushFn;
  });
  public close = jest.fn();
  public ack = jest.fn();

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