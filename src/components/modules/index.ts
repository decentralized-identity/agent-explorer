import React from 'react'
import { PageModuleConfig } from '../../types'

export const MODULE_MAP: { [index: string]: PageModuleConfig } = {
  MODULE_001: {
    moduleName: 'DynamicModule001',
    moduleLabel: 'My Module 01',
    config: {},
  },
  MODULE_002: {
    moduleName: 'DynamicModule002',
    moduleLabel: 'My Module 02',
    config: {},
  },
  MODULE_003: {
    moduleName: 'BarChart',
    moduleLabel: 'Bar Chart',
    config: {},
  },
  MODULE_004: {
    moduleName: 'DataGenerator',
    moduleLabel: 'Data Generator',
    config: {},
  },
  MODULE_005: {
    moduleName: 'QueryIdentifier',
    moduleLabel: 'Query Identifer',
    config: {},
    pages: ['credential'],
  },
}

export const DYNAMIC_MODULES = {
  DynamicModule001: React.lazy(() => import('./DynamicModule001')),
  DynamicModule002: React.lazy(() => import('./DynamicModule002')),
  BarChart: React.lazy(() => import('./BarChart')),
  DataGenerator: React.lazy(() => import('./DataGenerator')),
  QueryIdentifier: React.lazy(() => import('./QueryIdentifier')),
}
