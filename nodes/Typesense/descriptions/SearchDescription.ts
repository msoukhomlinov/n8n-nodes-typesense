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
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getCollections',
    },
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    description: 'Select a collection from your Typesense instance',
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
    description:
      'Comma-separated list of collection names for multi-search. Use the Collection Name field above to see available collections.',
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
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Fields to search in. Select multiple fields from your collection schema.',
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
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Field to sort by. Add :asc or :desc after selecting (e.g., num_employees:desc).',
    hint: 'You can manually add :asc or :desc to the field name',
  },
  {
    displayName: 'Facet By',
    name: 'facetBy',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'advancedSearch'],
      },
    },
    description: 'Fields to facet by. Select multiple fields from your collection schema.',
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
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: 'embedding',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['vectorSearch', 'semanticSearch'],
      },
    },
    description: 'Select the vector field to search in',
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
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    description: 'Fields to include in results. Leave empty to include all fields.',
  },
  {
    displayName: 'Exclude Fields',
    name: 'excludeFields',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    description: 'Fields to exclude from results',
  },
  // Typo Tolerance Options
  {
    displayName: 'Typo Tolerance Options',
    name: 'typoTolerance',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Prefix', name: 'prefix', type: 'string', default: '' },
      { displayName: 'Infix', name: 'infix', type: 'string', default: '' },
      { displayName: 'Enable Typo Tolerance', name: 'enableTypoTolerance', type: 'boolean', default: true },
      { displayName: 'Num Typos', name: 'numTypos', type: 'number', default: 2, typeOptions: { minValue: 0, maxValue: 2 } },
      { displayName: 'Min Length for 1 Typo', name: 'minLengthFor1Typo', type: 'number', default: 4, typeOptions: { minValue: 1 } },
      { displayName: 'Min Length for 2 Typos', name: 'minLengthFor2Typos', type: 'number', default: 7, typeOptions: { minValue: 1 } },
      { displayName: 'Typo Tokens Threshold', name: 'typoTokensThreshold', type: 'number', default: 1, typeOptions: { minValue: 0 } },
      { displayName: 'Drop Tokens Threshold', name: 'dropTokensThreshold', type: 'number', default: 1, typeOptions: { minValue: 0 } },
      {
        displayName: 'Drop Tokens Mode',
        name: 'dropTokensMode',
        type: 'options',
        options: [
          { name: 'Right to Left', value: 'right_to_left' },
          { name: 'Left to Right', value: 'left_to_right' },
          { name: 'Both Sides', value: 'both_sides' },
        ],
        default: 'right_to_left',
      },
      { displayName: 'Split Join Tokens', name: 'splitJoinTokens', type: 'options', options: [ { name: 'Off', value: 'off' }, { name: 'Fallback', value: 'fallback' }, { name: 'Always', value: 'always' } ], default: 'fallback' },
      { displayName: 'Enable Typos for Numerical Tokens', name: 'enableTyposForNumericalTokens', type: 'boolean', default: true },
      { displayName: 'Enable Typos for Alphanumeric Tokens', name: 'enableTyposForAlphaNumericalTokens', type: 'boolean', default: true },
      { displayName: 'Synonym Num Typos', name: 'synonymNumTypos', type: 'number', default: 0, typeOptions: { minValue: 0, maxValue: 2 } },
    ],
  },

  // Ranking & Relevance
  {
    displayName: 'Ranking & Relevance',
    name: 'ranking',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Query By Weights', name: 'queryByWeights', type: 'string', default: '' },
      { displayName: 'Text Match Type', name: 'textMatchType', type: 'options', options: [ { name: 'Max Score', value: 'max_score' }, { name: 'Max Weight', value: 'max_weight' }, { name: 'Sum Score', value: 'sum_score' } ], default: 'max_score' },
      { displayName: 'Prioritise Exact Match', name: 'prioritizeExactMatch', type: 'boolean', default: true },
      { displayName: 'Prioritise Token Position', name: 'prioritizeTokenPosition', type: 'boolean', default: false },
      { displayName: 'Prioritise Num Matching Fields', name: 'prioritizeNumMatchingFields', type: 'boolean', default: true },
      { displayName: 'Pinned Hits', name: 'pinnedHits', type: 'string', default: '' },
      { displayName: 'Hidden Hits', name: 'hiddenHits', type: 'string', default: '' },
      { displayName: 'Filter Curated Hits', name: 'filterCuratedHits', type: 'boolean', default: false },
      { displayName: 'Enable Overrides', name: 'enableOverrides', type: 'boolean', default: true },
      { displayName: 'Override Tags', name: 'overrideTags', type: 'string', default: '' },
      { displayName: 'Enable Synonyms', name: 'enableSynonyms', type: 'boolean', default: true },
      { displayName: 'Synonym Prefix', name: 'synonymPrefix', type: 'boolean', default: false },
      { displayName: 'Max Candidates', name: 'maxCandidates', type: 'number', default: 4, typeOptions: { minValue: 1 } },
      { displayName: 'Exhaustive Search', name: 'exhaustiveSearch', type: 'boolean', default: false },
    ],
  },

  // Highlighting
  {
    displayName: 'Highlighting',
    name: 'highlighting',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Highlight Fields', name: 'highlightFields', type: 'string', default: '' },
      { displayName: 'Enable Highlighting', name: 'enableHighlighting', type: 'boolean', default: true },
      { displayName: 'Highlight Full Fields', name: 'highlightFullFields', type: 'string', default: '' },
      { displayName: 'Highlight Affix Num Tokens', name: 'highlightAffixNumTokens', type: 'number', default: 4, typeOptions: { minValue: 0 } },
      { displayName: 'Highlight Start Tag', name: 'highlightStartTag', type: 'string', default: '' },
      { displayName: 'Highlight End Tag', name: 'highlightEndTag', type: 'string', default: '' },
      { displayName: 'Enable Highlight v1', name: 'enableHighlightV1', type: 'boolean', default: true },
      { displayName: 'Snippet Threshold', name: 'snippetThreshold', type: 'number', default: 30, typeOptions: { minValue: 0 } },
    ],
  },

  // Faceting Options
  {
    displayName: 'Faceting Options',
    name: 'faceting',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Facet Strategy', name: 'facetStrategy', type: 'options', options: [ { name: 'Automatic', value: 'automatic' }, { name: 'Exhaustive', value: 'exhaustive' }, { name: 'Top Values', value: 'top_values' } ], default: 'automatic' },
      { displayName: 'Max Facet Values', name: 'maxFacetValues', type: 'number', default: 10, typeOptions: { minValue: 0 } },
      { displayName: 'Facet Query', name: 'facetQuery', type: 'string', default: '' },
      { displayName: 'Facet Query Num Typos', name: 'facetQueryNumTypos', type: 'number', default: 2, typeOptions: { minValue: 0, maxValue: 2 } },
      { displayName: 'Facet Return Parent', name: 'facetReturnParent', type: 'string', default: '' },
      { displayName: 'Facet Sample Percent', name: 'facetSamplePercent', type: 'number', default: 100, typeOptions: { minValue: 0, maxValue: 100 } },
      { displayName: 'Facet Sample Threshold', name: 'facetSampleThreshold', type: 'number', default: 0, typeOptions: { minValue: 0 } },
    ],
  },

  // Grouping Options
  {
    displayName: 'Grouping Options',
    name: 'grouping',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Group Missing Values', name: 'groupMissingValues', type: 'boolean', default: true },
    ],
  },

  // Filter Options
  {
    displayName: 'Filter Options',
    name: 'filterOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Enable Lazy Filter', name: 'enableLazyFilter', type: 'boolean', default: false },
      { displayName: 'Max Filter By Candidates', name: 'maxFilterByCandidates', type: 'number', default: 4, typeOptions: { minValue: 1 } },
    ],
  },

  // Caching
  {
    displayName: 'Caching',
    name: 'caching',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Use Cache', name: 'useCache', type: 'boolean', default: false },
      { displayName: 'Cache TTL (seconds)', name: 'cacheTtl', type: 'number', default: 60, typeOptions: { minValue: 1 } },
    ],
  },

  // Advanced Options
  {
    displayName: 'Advanced Options',
    name: 'advanced',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search', 'multiSearch', 'vectorSearch', 'semanticSearch', 'advancedSearch'],
      },
    },
    options: [
      { displayName: 'Preset', name: 'preset', type: 'string', default: '' },
      { displayName: 'Pre-segmented Query', name: 'preSegmentedQuery', type: 'boolean', default: false },
      { displayName: 'Stopwords', name: 'stopwords', type: 'string', default: '' },
      { displayName: 'Validate Field Names', name: 'validateFieldNames', type: 'boolean', default: true },
      { displayName: 'Conversation', name: 'conversation', type: 'string', default: '' },
      { displayName: 'Limit Hits', name: 'limitHits', type: 'number', default: 0, typeOptions: { minValue: 0 } },
      { displayName: 'Search Cutoff (ms)', name: 'searchCutoffMs', type: 'number', default: 0, typeOptions: { minValue: 0 } },
    ],
  },
];
