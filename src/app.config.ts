import * as Joi from 'joi';
import { ConfigFactory, registerAs } from '@nestjs/config';

export interface AppConfig {
  debugMode: boolean;
}

export const APP_CONFIG_TOKEN = 'app-configs-token';

const appConfigSchema = Joi.object<AppConfig>({
  debugMode: Joi.boolean().default(false),
});

export const appConfig = registerAs<AppConfig, ConfigFactory<AppConfig>>(
  APP_CONFIG_TOKEN,
  () => {
    const { error, value } = appConfigSchema.validate(
      {
        debugMode: process.env.DEBUG_MODE,
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
