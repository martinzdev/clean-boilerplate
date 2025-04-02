import { DomainEvents } from "@/core/events/domain-events";
import { envSchema } from "@/infra/env/env";
import { SessionEntity } from "@/modules/identity/infra/persistence/typeorm/entities/session.entity";
import { UserEntity } from "@/modules/identity/infra/persistence/typeorm/entities/user.entity";
import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";

import { config } from "dotenv";
config({ path: ".env", override: true });
config({ path: ".env.test", override: true });
const env = envSchema.parse(process.env);

const typeOrmEntities = [UserEntity, SessionEntity];
const schemaId = randomUUID();
let dataSource: DataSource;

const createDataSourceSchema = async (schemaId: string): Promise<string> => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const tempDataSource = new DataSource({
    type: "postgres",
    url: env.DATABASE_URL,
    entities: [...typeOrmEntities],
    synchronize: true,
    logging: true,
  });

  await tempDataSource.initialize();
  await tempDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaId}"`);
  await tempDataSource.destroy();

  const databaseURL = new URL(env.DATABASE_URL);

  databaseURL.searchParams.set("schema", schemaId);

  process.env.DATABASE_URL = databaseURL.toString();
  process.env.DATABASE_SCHEMA = schemaId;

  console.log(`[setup-e2e] Updated DATABASE_URL to: ${databaseURL.toString()}`);
  console.log(`[setup-e2e] Set DATABASE_SCHEMA to: ${schemaId}`);

  return databaseURL.toString();
};

beforeAll(async () => {
  const databaseURL = await createDataSourceSchema(schemaId);

  dataSource = new DataSource({
    type: "postgres",
    url: databaseURL,
    schema: schemaId,
    entities: [...typeOrmEntities],
    synchronize: true,
    logging: true,
  });

  await dataSource.initialize();

  await dataSource.query(`SET search_path TO "${schemaId}"`);

  await dataSource.synchronize(true);

  DomainEvents.shouldRun = false;
});

afterAll(async () => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.query(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
    await dataSource.destroy();
  }
});
