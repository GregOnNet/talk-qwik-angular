import { InjectionToken } from '@angular/core';

import { EnvironmentConfiguration } from './environment-configuration';

export const ENVIRONMENT_CONFIGURATION_TOKEN = new InjectionToken<EnvironmentConfiguration>(
  'ENVIRONMENT CONFIGURATION TOKEN'
);
