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
  CREATE_PRESENTATION: {
    moduleName: 'CreatePresentation',
    moduleLabel: 'Create Presentation',
    config: {},
  },
  QUERY_IDENTIFIER: {
    moduleName: 'QueryIdentifier',
    moduleLabel: 'Query Identifer',
    config: {},
    pages: ['credential'],
  },
  WELCOME: {
    moduleName: 'Welcome',
    moduleLabel: 'Welcome',
    config: {},
    unlisted: true,
  },
}

export const PAGE_DEFAULT_MODULES: PageModulesDefaults = {
  dashboard: [MODULE_MAP.WELCOME],
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
  [MODULE_MAP.CREATE_PRESENTATION.moduleName]: React.lazy(
    () => import('./CreatePresentation'),
  ),
  [MODULE_MAP.WELCOME.moduleName]: React.lazy(() => import('./Welcome')),
}
