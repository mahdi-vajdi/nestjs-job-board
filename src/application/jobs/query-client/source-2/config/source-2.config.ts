import * as Joi from 'joi';
import { ConfigFactory, registerAs } from '@nestjs/config';
import { env } from 'node:process';

export interface Source2Config {
  url: string;
}

export const SOURCE_2_CONFIG_TOKEN = 'source-2-config-token';

const source2ConfigValidator = Joi.object<Source2Config>({
  url: Joi.string().uri().required(),
});

export const source2Config = registerAs<
  Source2Config,
  ConfigFactory<Source2Config>
>(SOURCE_2_CONFIG_TOKEN, () => {
  const { error, value } = source2ConfigValidator.validate(
    {
      url: env.SOURCE_2_BASE_URL,
    },
    {
      abortEarly: false,
      allowUnknown: false,
    },
  );

  if (error) {
    throw new Error(
      'Source 2 configuration validation failed: ' + error.message,
    );
  }

  return value;
});
