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
        name: 'Get Query Suggestions',
        value: 'getQuerySuggestions',
        action: 'Get query suggestions',
        description: 'Retrieve popular search queries and suggestions',
      },
      {
        name: 'Create Analytics Event',
        value: 'createEvent',
        action: 'Create analytics event',
        description: 'Log a custom analytics event',
      },
      {
        name: 'Get Analytics Events',
        value: 'getEvents',
        action: 'Get analytics events',
        description: 'Retrieve analytics events with filtering',
      },
      {
        name: 'Get Popular Queries',
        value: 'getPopularQueries',
        action: 'Get popular queries',
        description: 'Retrieve most popular search queries',
      },
    ],
    default: 'getQuerySuggestions',
  },
];

export const analyticsFields: INodeProperties[] = [
  {
    displayName: 'Collection Name',
    name: 'collection',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getQuerySuggestions', 'getPopularQueries'],
      },
    },
    description: 'Name of the collection for query suggestions',
  },
  {
    displayName: 'Query Text',
    name: 'query',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['createEvent'],
      },
    },
    description: 'Search query text for the analytics event',
  },
  {
    displayName: 'Event Type',
    name: 'eventType',
    type: 'options',
    options: [
      { name: 'Search', value: 'search' },
      { name: 'Click', value: 'click' },
      { name: 'Conversion', value: 'conversion' },
    ],
    default: 'search',
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
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 200,
    },
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getQuerySuggestions', 'getEvents', 'getPopularQueries'],
      },
    },
    description: 'Maximum number of results to retrieve',
  },
];
