import React from 'react'
import { PageWidgetConfig, PageWidgetDefaults } from '../../types'

export const WIDGET_MAP: { [index: string]: PageWidgetConfig } = {
  WIDGET_EXAMPLE: {
    widgetName: 'WidgetExample',
    widgetLabel: 'Widget Example',
    config: {},
  },
  BAR_CHART: {
    widgetName: 'BarChart',
    widgetLabel: 'Bar Chart',
    config: {},
  },
  DATA_GENERATOR: {
    widgetName: 'DataGenerator',
    widgetLabel: 'Data Generator',
    config: {},
  },
  ISSUE_CREDENTIAL: {
    widgetName: 'IssueCredential',
    widgetLabel: 'Issue Credential',
    config: {},
  },
  CREATE_PRESENTATION: {
    widgetName: 'CreatePresentation',
    widgetLabel: 'Create Presentation',
    config: {},
  },
  QUERY_IDENTIFIER: {
    widgetName: 'QueryIdentifier',
    widgetLabel: 'Query Identifer',
    config: {},
    pages: ['credential'],
  },
  WELCOME: {
    widgetName: 'Welcome',
    widgetLabel: 'Welcome',
    config: {},
    unlisted: true,
  },
}

export const PAGE_DEFAULT_WIDGETS: PageWidgetDefaults = {
  dashboard: [WIDGET_MAP.WELCOME],
}

export const DYNAMIC_COMPONENTS: {
  [x: string]: React.LazyExoticComponent<React.FC<any>>
} = {
  [WIDGET_MAP.WIDGET_EXAMPLE.widgetName]: React.lazy(
    () => import('./WidgetExample'),
  ),
  [WIDGET_MAP.BAR_CHART.widgetName]: React.lazy(() => import('./BarChart')),
  [WIDGET_MAP.DATA_GENERATOR.widgetName]: React.lazy(
    () => import('./DataGenerator'),
  ),
  [WIDGET_MAP.QUERY_IDENTIFIER.widgetName]: React.lazy(
    () => import('./QueryIdentifier'),
  ),
  [WIDGET_MAP.ISSUE_CREDENTIAL.widgetName]: React.lazy(
    () => import('./IssueCredential'),
  ),
  [WIDGET_MAP.CREATE_PRESENTATION.widgetName]: React.lazy(
    () => import('./CreatePresentation'),
  ),
  [WIDGET_MAP.WELCOME.widgetName]: React.lazy(() => import('./Welcome')),
}
