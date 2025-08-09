import * as Joi from 'joi';
import { ConfigFactory, registerAs } from '@nestjs/config';
import { env } from 'node:process';

export interface IHttpConfig {
  port: number;
}

export const HTTP_CONFIG_TOKEN = 'http-configs-token';

const httpConfigSchema = Joi.object<IHttpConfig>({
  port: Joi.number().port().required(),
});

export const httpConfig = registerAs<IHttpConfig, ConfigFactory<IHttpConfig>>(
  HTTP_CONFIG_TOKEN,
  () => {
    const { error, value } = httpConfigSchema.validate(
      {
        port: env.HTTP_PORT,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );

    if (error) throw error;

    return value;
  },
);
