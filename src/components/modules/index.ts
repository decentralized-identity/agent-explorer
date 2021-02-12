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
  QUERY_IDENTIFIER: {
    moduleName: 'QueryIdentifier',
    moduleLabel: 'Query Identifer',
    config: {},
    pages: ['credential'],
  },
}

export const PAGE_DEFAULT_MODULES: PageModulesDefaults = {
  overview: [MODULE_MAP.BAR_CHART, MODULE_MAP.DATA_GENERATOR],
}

export const DYNAMIC_MODULES = {
  DynamicModule001: React.lazy(() => import('./DynamicModule001')),
  DynamicModule002: React.lazy(() => import('./DynamicModule002')),
  BarChart: React.lazy(() => import('./BarChart')),
  DataGenerator: React.lazy(() => import('./DataGenerator')),
  QueryIdentifier: React.lazy(() => import('./QueryIdentifier')),
}
