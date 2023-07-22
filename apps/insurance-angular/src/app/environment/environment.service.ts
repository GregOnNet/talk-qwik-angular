import { Inject, Injectable } from '@angular/core';

import { EnvironmentConfiguration } from './environment-configuration';
import { ENVIRONMENT_CONFIGURATION_TOKEN } from './environment-configuration.token';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  constructor(
    @Inject(ENVIRONMENT_CONFIGURATION_TOKEN) public configuration: EnvironmentConfiguration
  ) {}
}
