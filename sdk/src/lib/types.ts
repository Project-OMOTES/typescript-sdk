export type OmotesSDKOptions = {
  rabbitMQUrl: string;
  rabbitMQUsername: string;
  rabbitMQPassword: string;
  rabbitMQPort: number;
};

export type JobTypeName = 'grow_simulator' | 'simulator' | 'grow_optimizer';
