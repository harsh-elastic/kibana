/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createWorkerServerContextMock } from '../workers/worker_server_context.mock';
import type { WorkerServerDefinition, WorkerStepDefinition } from '../workers';
import { registerStepDefinitions } from '.';

describe('registerStepDefinitions', () => {
  it('registers the shared steps, then each Worker step built from the shared context', () => {
    const registerStepDefinition = jest.fn();
    const context = createWorkerServerContextMock();
    const workerStep = { id: 'example.step' } as unknown as WorkerStepDefinition;
    const getStepDefinitions = jest.fn(() => [workerStep]);
    const worker: WorkerServerDefinition = {
      workerId: 'system-security-floor-alert-triage',
      getStepDefinitions,
    };

    registerStepDefinitions({
      workflowsExtensions: { registerStepDefinition },
      context,
      resolveChatModel: jest.fn(),
      workers: [worker, { workerId: 'system-security-floor-attack-discovery' }],
    });

    expect(getStepDefinitions).toHaveBeenCalledWith(context);
    expect(registerStepDefinition.mock.calls.map(([definition]) => definition.id)).toEqual([
      'alertzero.resolveProposals',
      'alertzero.investigation.summarize',
      'example.step',
    ]);
  });
});
