import type { INodeProperties } from 'n8n-workflow';

export const analyticsOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
      },
    },
    options: [
      {
        name: 'Create Analytics Event',
        value: 'createEvent',
        action: 'Create analytics event',
        description: 'Submit an analytics event (requires server started with --analytics-dir)',
      },
      {
        name: 'Get Analytics Events',
        value: 'getEvents',
        action: 'Get analytics events',
        description: 'Retrieve analytics events (requires server started with --analytics-dir)',
      },
      {
        name: 'Flush Analytics',
        value: 'flush',
        action: 'Flush analytics',
        description: 'Flush in-memory analytics data (requires server started with --analytics-dir)',
      },
      {
        name: 'Get Analytics Status',
        value: 'getStatus',
        action: 'Get analytics status',
        description: 'Get analytics status (requires server started with --analytics-dir)',
      },
      {
        name: 'Create Analytics Rule',
        value: 'createRule',
        action: 'Create analytics rule',
        description: 'Create one or more analytics rules',
      },
      {
        name: 'Get Analytics Rules',
        value: 'getRules',
        action: 'Get analytics rules',
        description: 'Retrieve all analytics rules',
      },
      {
        name: 'Get Analytics Rule',
        value: 'getRule',
        action: 'Get analytics rule',
        description: 'Retrieve a specific analytics rule',
      },
      {
        name: 'Update Analytics Rule',
        value: 'updateRule',
        action: 'Update analytics rule',
        description: 'Create or update an analytics rule',
      },
      {
        name: 'Delete Analytics Rule',
        value: 'deleteRule',
        action: 'Delete analytics rule',
        description: 'Delete an analytics rule',
      },
    ],
    default: 'createEvent',
  },
];

export const analyticsFields: INodeProperties[] = [
  {
    displayName: 'Rule Name',
    name: 'ruleName',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['createEvent', 'getRule', 'updateRule', 'deleteRule'],
      },
    },
    description: 'Name of the analytics rule this event corresponds to',
  },
  {
    displayName: 'Event Type',
    name: 'eventType',
    type: 'options',
    options: [
      { name: 'Click', value: 'click' },
      { name: 'Conversion', value: 'conversion' },
      { name: 'Query', value: 'query' },
      { name: 'Visit', value: 'visit' },
    ],
    default: 'query',
    required: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['createEvent'],
      },
    },
    description: 'Type of analytics event',
  },
  {
    displayName: 'Event Data (JSON)',
    name: 'eventDataJson',
    type: 'string',
    typeOptions: {
      rows: 6,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['createEvent'],
      },
    },
    description:
      'Event data as JSON. Should include user_id, doc_id (or doc_ids), q (query), and optionally analytics_tag',
  },
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getEvents'],
      },
    },
    description: 'User identifier to retrieve events for',
  },
  {
    displayName: 'Rule Name',
    name: 'ruleNameForEvents',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getEvents'],
      },
    },
    description: 'Analytics rule name to retrieve events for',
  },
  {
    displayName: 'Number of Events',
    name: 'n',
    type: 'number',
    default: 100,
    typeOptions: {
      minValue: 1,
      maxValue: 1000,
    },
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getEvents'],
      },
    },
    description: 'Number of events to return (max 1000)',
  },
  {
    displayName: 'Rule Tag',
    name: 'ruleTag',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getRules'],
      },
    },
    description: 'Filter rules by rule_tag (optional)',
  },
  {
    displayName: 'Analytics Rule (JSON)',
    name: 'ruleJson',
    type: 'string',
    typeOptions: {
      rows: 10,
    },
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['createRule', 'updateRule'],
      },
    },
    description:
      'Analytics rule as JSON. Required fields: name, type (popular_queries|nohits_queries|counter|log), collection, event_type. Can be a single object or array of objects.',
  },
];
