import type { INodeProperties } from 'n8n-workflow';

export const searchOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['search'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        action: 'Search across collections',
        description: 'Search for documents across one or more collections',
      },
      {
        name: 'Multi Search',
        value: 'multiSearch',
        action: 'Multi-search',
        description: 'Execute multiple search requests in a single API call',
      },
      {
        name: 'Vector Search',
        value: 'vectorSearch',
        action: 'Vector search',
        description: 'Search using vector embeddings for semantic similarity',
      },
      {
        name: 'Semantic Search',
        value: 'semanticSearch',
        action: 'Semantic search',
        description: 'Search using natural language understanding',
      },
      {
        name: 'Advanced Search',
        value: 'advancedSearch',
        action: 'Advanced search',
        description: 'Advanced search with complex filtering and ranking',
      },
    ],
    default: 'search',
  },
];

export const searchFields: INodeProperties[] = [
  {
    displayName: 'Collection Name',
    name: 'collection',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    description: 'Name of the collection to search in',
  },
  {
    displayName: 'Collections',
    name: 'collections',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['multiSearch'],
      },
    },
    description: 'Comma-separated list of collection names for multi-search',
  },
  {
    displayName: 'Search Query',
    name: 'query',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Search query text',
  },
  {
    displayName: 'Query By',
    name: 'queryBy',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Comma-separated list of fields to search in',
  },
  {
    displayName: 'Filter By',
    name: 'filterBy',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Filter expression (e.g., num_employees:>100)',
  },
  {
    displayName: 'Sort By',
    name: 'sortBy',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Sort expression (e.g., num_employees:desc)',
  },
  {
    displayName: 'Facet By',
    name: 'facetBy',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Comma-separated list of fields to facet by',
  },
  {
    displayName: 'Vector Query',
    name: 'vectorQuery',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['vectorSearch', 'semanticSearch'],
      },
    },
    description: 'Vector embeddings for similarity search (comma-separated numbers)',
  },
  {
    displayName: 'Vector Field',
    name: 'vectorField',
    type: 'string',
    default: 'embedding',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['vectorSearch', 'semanticSearch'],
      },
    },
    description: 'Name of the vector field to search in',
  },
  {
    displayName: 'Semantic Query',
    name: 'semanticQuery',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['semanticSearch'],
      },
    },
    description: 'Natural language query for semantic search',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
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
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of results to retrieve',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: {
      minValue: 1,
    },
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    description: 'Page number for pagination',
  },
  {
    displayName: 'Include Fields',
    name: 'includeFields',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    description: 'Comma-separated list of fields to include in results',
  },
  {
    displayName: 'Exclude Fields',
    name: 'excludeFields',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    description: 'Comma-separated list of fields to exclude from results',
  },
];
