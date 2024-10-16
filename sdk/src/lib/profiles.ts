import { FieldType, INanoDate, InfluxDB, escape } from 'influx';

export async function getProfile(
  dbName: string,
  host: string,
  port: number,
  measurement: string,
  field: string,
  filterId: string,
  username: string,
  password: string
) {
  const db = new InfluxDB({
    database: dbName,
    host,
    port,
    username,
    password,
    schema: [
      {
        measurement,
        fields: {
          [field]: FieldType.FLOAT
        },
        tags: ['output_esdl_id']
      }
    ]
  });
  // @TODO: Filter on column assetId
  const query = `select ${escape.quoted(field)} as value, output_esdl_id from ${escape.quoted(measurement)} where output_esdl_id = $filterId;`;
  return db.query<{ value: number, time: INanoDate }>(query, { placeholders: { filterId } });
}