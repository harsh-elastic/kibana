/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreStart } from '@kbn/core/server';
import { Subscription } from 'rxjs';
import type { WorkerFeatureFlag } from './types';

export interface WorkerFeatureFlagValues {
  get: <T extends boolean | string>(flag: WorkerFeatureFlag<T>) => T;
  /** Core's start contract only offers flag observables, so each value is held as it changes. */
  subscribe: (featureFlags: CoreStart['featureFlags']) => Subscription;
}

/** Holds the latest value of each declared flag, its fallback until `subscribe`. */
export const createWorkerFeatureFlagValues = (
  flags: readonly WorkerFeatureFlag[]
): WorkerFeatureFlagValues => {
  const values = new Map<string, boolean | string>(
    flags.map(({ key, fallback }) => [key, fallback])
  );

  return {
    get: <T extends boolean | string>({ key }: WorkerFeatureFlag<T>): T => {
      const value = values.get(key);
      if (value === undefined) {
        throw new Error(`Feature flag ${key} is not declared by any AlertZero Worker`);
      }
      // The value comes from the observable matching the declared fallback's type.
      return value as T;
    },
    subscribe: (featureFlags) => {
      const subscription = new Subscription();
      for (const { key, fallback } of flags) {
        const hold = (value: boolean | string) => {
          values.set(key, value);
        };
        subscription.add(
          typeof fallback === 'boolean'
            ? featureFlags.getBooleanValue$(key, fallback).subscribe(hold)
            : featureFlags.getStringValue$(key, fallback).subscribe(hold)
        );
      }
      return subscription;
    },
  };
};
