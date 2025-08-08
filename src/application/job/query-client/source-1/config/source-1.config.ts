import * as Joi from 'joi';
import { ConfigFactory, registerAs } from '@nestjs/config';
import { env } from 'node:process';

export interface Source1Config {
  url: string;
}

export const SOURCE_1_CONFIG_TOKEN = 'source-1-config-token';

const source1ConfigValidator = Joi.object<Source1Config>({
  url: Joi.string().uri().required(),
});

export const source1Config = registerAs<
  Source1Config,
  ConfigFactory<Source1Config>
>(SOURCE_1_CONFIG_TOKEN, () => {
  const { error, value } = source1ConfigValidator.validate(
    {
      url: env.SOURCE_1_URL,
    },
    {
      abortEarly: false,
      allowUnknown: false,
    },
  );

  if (error) {
    throw new Error(
      'Source 1 configuration validation failed: ' + error.message,
    );
  }

  return value;
});
