import { FieldType, INanoDate, InfluxDB, escape } from 'influx';

export async function getProfile(
  dbName: string,
  host: string,
  port: number,
  measurement: string,
  field: string,
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
        tags: []
      }
    ]
  });
  const query = `select ${escape.quoted(field)} as value from ${escape.quoted(measurement)};`;
  return db.query<{ value: number, time: INanoDate }>(query);
}