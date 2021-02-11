import React from 'react'
import { PageModuleConfig } from '../../types'

export const MODULE_MAP: { [index: string]: PageModuleConfig } = {
  MODULE_001: {
    moduleKey: 'DynamicModule001',
    moduleLabel: 'My Module 01',
    config: {},
  },
  MODULE_002: {
    moduleKey: 'DynamicModule002',
    moduleLabel: 'My Module 02',
    config: {},
  },
  MODULE_003: {
    moduleKey: 'BarChart',
    moduleLabel: 'Bar Chart',
    config: {},
  },
  MODULE_004: {
    moduleKey: 'DataGenerator',
    moduleLabel: 'Data Generator',
    config: {},
  },
  MODULE_005: {
    moduleKey: 'QueryIdentifier',
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
