import { FactoryProvider, inject } from '@angular/core';
import { QueryClientService } from '@ngneat/query';
import { QueryClient } from './query.client';

/**
 *
 * Allow to inject @ngneat/qeuery's QueryClientService with
 * Constructor DI.
 *
 * See https://github.com/ngneat/query/issues/98 for details.
 *
 */
export function provideNgNeatQueryClient(): FactoryProvider {
  return {
    provide: QueryClient,
    useFactory: () => inject(QueryClientService)
  };
}
