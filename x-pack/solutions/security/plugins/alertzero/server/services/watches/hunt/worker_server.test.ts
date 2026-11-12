/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createWorkerServerContextMock } from '../../../workers/worker_server_context.mock';
import { getHuntServices } from './create_hunt_services';
import { continuousThreatHuntServerDefinition } from './worker_server';

describe('continuousThreatHuntServerDefinition', () => {
  it('builds its packaging step without resolving any service before start', () => {
    const context = createWorkerServerContextMock();

    const steps = continuousThreatHuntServerDefinition.getStepDefinitions?.(context) ?? [];

    expect(steps.map((step) => ('id' in step ? step.id : undefined))).toEqual([
      'hunt.packageReport',
    ]);
    expect(context.getProposalsPlugin).not.toHaveBeenCalled();
    expect(context.getActionsService).not.toHaveBeenCalled();
  });

  it('shares one set of Hunt services with the routes', () => {
    const context = createWorkerServerContextMock();

    continuousThreatHuntServerDefinition.getStepDefinitions?.(context);

    expect(getHuntServices(context)).toBe(getHuntServices(context));
  });
});
