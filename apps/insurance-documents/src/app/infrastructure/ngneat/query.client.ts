import { InjectionToken } from '@angular/core';
import { QueryClientService } from '@ngneat/query';

export type UnwrapInjectionToken<T> = T extends InjectionToken<infer U> ? U : never;

type QueryCore = UnwrapInjectionToken<typeof QueryClientService>;

/**
 *
 * Merges all members of QueryCore into QueryClient.
 * This is ok as long as QueryClient is setup via Angular's IoC-Container, because
 * QueryClient will get QueryClientService implementation.
 *
 */
export interface QueryClient extends QueryCore {}
export class QueryClient {}
