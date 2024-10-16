export type OmotesSDKOptions = {
  rabbitMQUrl: string;
  rabbitMQUsername: string;
  rabbitMQPassword: string;
  rabbitMQPort: number;
  influxUser: string;
  influxPassword: string;
};

export type JobTypeName =
  'grow_simulator'
  | 'simulator'
  | 'grow_optimizer_default'
  | 'grow_optimizer_no_heat_losses'
  | 'grow_optimizer_with_pressure';
