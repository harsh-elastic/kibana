/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { loggerMock } from '@kbn/logging-mocks';
import type { WorkerServerContext } from './types';

const notStarted = (): never => {
  throw new Error('not started');
};

/** A context where every service that exists only after `start` throws, unless overridden. */
export const createWorkerServerContextMock = (
  overrides: Partial<WorkerServerContext> = {}
): WorkerServerContext => ({
  logger: loggerMock.create(),
  getActionsService: jest.fn(notStarted),
  getConversations: jest.fn(notStarted),
  getProposalsPlugin: jest.fn(notStarted),
  getInference: jest.fn(() => undefined),
  getSearchInferenceEndpoints: jest.fn(() => undefined),
  getMitreDataClient: jest.fn(() => undefined),
  getFleetAgentService: jest.fn(() => undefined),
  getTaskManager: jest.fn(notStarted),
  getWorkflowsManagement: jest.fn(() => undefined),
  getInternalEsClient: jest.fn(notStarted),
  isContextEngineEnabled: jest.fn(async () => false),
  getFeatureFlag: jest.fn(({ fallback }) => fallback),
  ...overrides,
});
