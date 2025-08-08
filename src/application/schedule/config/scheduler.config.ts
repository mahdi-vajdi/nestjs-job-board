import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';

export interface SchedulerConfig {
  fetchExternalApiCronPattern: string;
}

export const SCHEDULER_CONFIG_TOKEN = 'scheduler-config-token';

const schedulerConfigSchema = Joi.object<SchedulerConfig>({
  fetchExternalApiCronPattern: Joi.string().required(),
});

export const schedulerConfig = registerAs<
  SchedulerConfig,
  ConfigFactory<SchedulerConfig>
>(SCHEDULER_CONFIG_TOKEN, () => {
  const { error, value } = schedulerConfigSchema.validate(
    {
      externalApiCronPattern: env.SCHEDULER_FETCH_EXTERNAL_API_CRON_PATTERN,
    },
    {
      allowUnknown: false,
      abortEarly: false,
    },
  );

  if (error) {
    throw new Error(`Scheduler config env validation error: ${error.message}`);
  }

  return value;
});
