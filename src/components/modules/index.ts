import React from 'react'
import { PageModuleConfig, PageModulesDefaults } from '../../types'

export const MODULE_MAP: { [index: string]: PageModuleConfig } = {
  DYNAMIC_MODULE_01: {
    moduleName: 'DynamicModule001',
    moduleLabel: 'My Module 01',
    config: {},
  },
  DYNAMIC_MODULE_02: {
    moduleName: 'DynamicModule002',
    moduleLabel: 'My Module 02',
    config: {},
  },
  BAR_CHART: {
    moduleName: 'BarChart',
    moduleLabel: 'Bar Chart',
    config: {},
  },
  DATA_GENERATOR: {
    moduleName: 'DataGenerator',
    moduleLabel: 'Data Generator',
    config: {},
  },
  ISSUE_CREDENTIAL: {
    moduleName: 'IssueCredential',
    moduleLabel: 'Issue Credential',
    config: {},
  },
  QUERY_IDENTIFIER: {
    moduleName: 'QueryIdentifier',
    moduleLabel: 'Query Identifer',
    config: {},
    pages: ['credential'],
  },
}

export const PAGE_DEFAULT_MODULES: PageModulesDefaults = {
  overview: [
    MODULE_MAP.ISSUE_CREDENTIAL,
    MODULE_MAP.BAR_CHART,
    MODULE_MAP.DATA_GENERATOR,
  ],
}

export const DYNAMIC_MODULES = {
  [MODULE_MAP.DYNAMIC_MODULE_01.moduleName]: React.lazy(
    () => import('./DynamicModule001'),
  ),
  [MODULE_MAP.DYNAMIC_MODULE_02.moduleName]: React.lazy(
    () => import('./DynamicModule002'),
  ),
  [MODULE_MAP.BAR_CHART.moduleName]: React.lazy(() => import('./BarChart')),
  [MODULE_MAP.DATA_GENERATOR.moduleName]: React.lazy(
    () => import('./DataGenerator'),
  ),
  [MODULE_MAP.QUERY_IDENTIFIER.moduleName]: React.lazy(
    () => import('./QueryIdentifier'),
  ),
  [MODULE_MAP.ISSUE_CREDENTIAL.moduleName]: React.lazy(
    () => import('./IssueCredential'),
  ),
}
