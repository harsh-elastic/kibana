/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { MitreAttackDataClient } from '@kbn/mitre-attack-plugin/server';
import type { ProposalsPluginStart } from '@kbn/proposals-plugin/server';
import { getHuntServices } from './create_hunt_services';

describe('getHuntServices', () => {
  it('resolves every service when it is read, so it can be built before start', () => {
    const mitre: { client?: MitreAttackDataClient } = {};
    const proposalsService = {};
    const privileges = {};
    const getProposalsPlugin = jest.fn(
      () =>
        ({
          getProposalsService: () => proposalsService,
          getProposalPrivileges: () => privileges,
        } as unknown as ProposalsPluginStart)
    );

    const services = getHuntServices({
      getProposalsPlugin,
      getInference: () => undefined,
      getSearchInferenceEndpoints: () => undefined,
      getMitreDataClient: () => mitre.client,
    });

    expect(getProposalsPlugin).not.toHaveBeenCalled();
    expect(services.mitreDataClient).toBeUndefined();

    mitre.client = {} as MitreAttackDataClient;

    expect(services.mitreDataClient).toBe(mitre.client);
    expect(services.getProposalsService()).toBe(proposalsService);
    expect(services.getProposalPrivileges()).toBe(privileges);
  });

  it('builds the services once per context', () => {
    const context = {
      getProposalsPlugin: jest.fn(),
      getInference: () => undefined,
      getSearchInferenceEndpoints: () => undefined,
      getMitreDataClient: () => undefined,
    };

    expect(getHuntServices(context)).toBe(getHuntServices(context));
  });
});
