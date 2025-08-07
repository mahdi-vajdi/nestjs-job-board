import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';

export interface IWinstonLoggerConfig {
  useFile: boolean;
  filePath: string;
  level: string;
  environment: string;
}

export const WINSTON_LOGGER_CONFIG_TOKEN = 'winston-logger-configs-token';

const winstonLoggerConfigSchema = Joi.object<IWinstonLoggerConfig>({
  useFile: Joi.boolean().default(false),
  filePath: Joi.string().required(),
  level: Joi.string()
    .valid('debug', 'verbose', 'log', 'warn', 'error')
    .required(),
  environment: Joi.string().default('development'),
});

export const winstonLoggerConfig = registerAs<
  IWinstonLoggerConfig,
  ConfigFactory<IWinstonLoggerConfig>
>(WINSTON_LOGGER_CONFIG_TOKEN, () => {
  const { error, value } = winstonLoggerConfigSchema.validate(
    {
      useFile: env.LOG_USE_FILE,
      filePath: env.LOG_FILE,
      level: env.LOG_LEVEL,
      environment: env.NODE_ENV,
    },
    {
      allowUnknown: false,
      abortEarly: false,
    },
  );

  if (error) {
    throw new Error(
      `Winston logger config env validation error: ${error.message}`,
    );
  }

  return value;
});
