import { inject } from "@loopback/core";
import { juggler } from "@loopback/repository";
import * as config from "./db.datasource.json";

export class DbDataSource extends juggler.DataSource {
  static dataSourceName = "db";

  constructor(
    @inject("datasources.config.db", { optional: true })
    dsConfig: object = config
  ) {
    // Override data source config from environment variables

    Object.assign(dsConfig, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA
    });

    super(dsConfig);
  }
}
