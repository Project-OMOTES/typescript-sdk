import { AvailableWorkflows, Workflow } from '@omotes/proto';
import { Channel } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel } from '../../util/MockChannel.spec';
import { AvailableWorkflowsHandler } from './AvailableWorkflowsHandler';

describe('AvailableWorkflowsHandler', () => {
  describe('#getWorkflows', () => {
    let channel: MockChannel<AvailableWorkflows>;
    let handler: AvailableWorkflowsHandler;

    beforeEach(() => {
      channel = new MockChannel();
      handler = new AvailableWorkflowsHandler(
        of(channel as unknown as Channel),
        'client_id'
      );
    });

    it('should report workflows', (done) => {
      const { message, workflows } = getWorkflows();
      handler.getWorkflows().subscribe((responses) => {
        expect(responses).toEqual(workflows);
        done();
      });
      channel.pushMessage(message);
    });
  });
});

function getWorkflows() {
  const message = new AvailableWorkflows();
  const workflows = [
    { typeName: 'workflow1', typeDescription: 'description1', parametersList: [] },
    { typeName: 'workflow2', typeDescription: 'description2', parametersList: [] },
  ];
  const list = workflows.map(({ typeDescription, typeName }) => {
    const w = new Workflow();
    w.setTypeDescription(typeDescription);
    w.setTypeName(typeName);
    return w;
  })
  message.setWorkflowsList(list);
  return {
    workflows,
    message
  }
}