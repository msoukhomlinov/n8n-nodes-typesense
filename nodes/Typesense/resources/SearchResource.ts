import type { IDataObject, IExecuteFunctions, INodeProperties, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import type Client from 'typesense/lib/Typesense/Client';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import { getTypesenseClient } from '../GenericFunctions';

export class SearchResource extends BaseTypesenseResource {
  constructor() {
    super('search');
  }

  getOperations(): INodeProperties[] {
    return [
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
  }

  getFields(): INodeProperties[] {
    return [
      {
        displayName: 'Collection Name',
        name: 'collection',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
          },
        },
        description: 'Comma-separated list of fields to facet by',
      },
      {
        displayName: 'Group By',
        name: 'groupBy',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search', 'multiSearch'],
          },
        },
        description: 'Field to group results by',
      },
      {
        displayName: 'Group Limit',
        name: 'groupLimit',
        type: 'number',
        default: 3,
        typeOptions: {
          minValue: 1,
          maxValue: 99,
        },
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search', 'multiSearch'],
            groupBy: [''],
          },
        },
        description: 'Maximum number of hits to return per group',
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: true,
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
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
            operation: ['search', 'multiSearch', 'searchWithConversation'],
          },
        },
        description: 'Comma-separated list of fields to exclude from results',
      },
      {
        displayName: 'Highlight Fields',
        name: 'highlightFields',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search', 'multiSearch', 'searchWithConversation'],
          },
        },
        description: 'Comma-separated list of fields to highlight',
      },
      {
        displayName: 'Search Parameters',
        name: 'searchParameters',
        type: 'collection',
        placeholder: 'Add Parameter',
        default: {},
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search', 'multiSearch', 'searchWithConversation'],
          },
        },
        options: [
          {
            displayName: 'Prefix',
            name: 'prefix',
            type: 'string',
            default: '',
            description: 'Returns suggestions that match the given prefix',
          },
          {
            displayName: 'Infix',
            name: 'infix',
            type: 'string',
            default: '',
            description: 'Infix search query (e.g., "hat" in "hatstand")',
          },
          {
            displayName: 'Enable Highlighting',
            name: 'enableHighlighting',
            type: 'boolean',
            default: true,
            description: 'Enable search result highlighting',
          },
          {
            displayName: 'Enable Typo Tolerance',
            name: 'enableTypoTolerance',
            type: 'boolean',
            default: true,
            description: 'Enable typo tolerance for search queries',
          },
          {
            displayName: 'Num Typos',
            name: 'numTypos',
            type: 'number',
            default: 2,
            typeOptions: {
              minValue: 0,
              maxValue: 2,
            },
            displayOptions: {
              show: {
                enableTypoTolerance: [true],
              },
            },
            description: 'Maximum number of typos allowed',
          },
          {
            displayName: 'Min Length for 1 Typo',
            name: 'minLengthFor1Typo',
            type: 'number',
            default: 3,
            typeOptions: {
              minValue: 1,
            },
            displayOptions: {
              show: {
                enableTypoTolerance: [true],
              },
            },
            description: 'Minimum word length for 1 typo',
          },
          {
            displayName: 'Min Length for 2 Typos',
            name: 'minLengthFor2Typos',
            type: 'number',
            default: 7,
            typeOptions: {
              minValue: 1,
            },
            displayOptions: {
              show: {
                enableTypoTolerance: [true],
              },
            },
            description: 'Minimum word length for 2 typos',
          },
          {
            displayName: 'Typo Tokens Threshold',
            name: 'typoTokensThreshold',
            type: 'number',
            default: 1,
            typeOptions: {
              minValue: 0,
            },
            displayOptions: {
              show: {
                enableTypoTolerance: [true],
              },
            },
            description: 'Typo tolerance threshold for tokens',
          },
          {
            displayName: 'Drop Tokens Threshold',
            name: 'dropTokensThreshold',
            type: 'number',
            default: 1,
            typeOptions: {
              minValue: 0,
            },
            description: 'Drop tokens threshold for search',
          },
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
            displayOptions: {
              show: {
                dropTokensThreshold: ['1', '2'],
              },
            },
            description: 'Direction for dropping tokens',
          },
          {
            displayName: 'Vector Query',
            name: 'vectorQuery',
            type: 'string',
            default: '',
            description: 'Vector query for semantic search',
          },
          {
            displayName: 'Voice Query',
            name: 'voiceQuery',
            type: 'string',
            default: '',
            description: 'Voice search query',
          },
          {
            displayName: 'Conversation',
            name: 'conversation',
            type: 'string',
            typeOptions: {
              rows: 4,
            },
            default: '',
            displayOptions: {
              show: {
                resource: ['search'],
                operation: ['searchWithConversation'],
              },
            },
            description: 'Conversation context for search',
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
            displayName: 'Distance Threshold',
            name: 'distanceThreshold',
            type: 'number',
            default: 0.8,
            typeOptions: {
              minValue: 0,
              maxValue: 1,
            },
            displayOptions: {
              show: {
                resource: ['search'],
                operation: ['vectorSearch'],
              },
            },
            description: 'Similarity threshold for vector search (0-1)',
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
            displayName: 'Model Name',
            name: 'modelName',
            type: 'string',
            default: 'openai/text-embedding-ada-002',
            displayOptions: {
              show: {
                resource: ['search'],
                operation: ['semanticSearch'],
              },
            },
            description: 'Name of the embedding model to use',
          },
          {
            displayName: 'Advanced Query Parameters',
            name: 'advancedQueryParams',
            type: 'collection',
            placeholder: 'Add Parameter',
            default: {},
            displayOptions: {
              show: {
                resource: ['search'],
                operation: ['advancedSearch'],
              },
            },
            options: [
              {
                displayName: 'Query Weights',
                name: 'queryWeights',
                type: 'string',
                default: '',
                description: 'Field weights for query terms (e.g., title:2,description:1)',
              },
              {
                displayName: 'Text Match Type',
                name: 'textMatchType',
                type: 'options',
                options: [
                  { name: 'Exact', value: 'exact' },
                  { name: 'Contains', value: 'contains' },
                  { name: 'Fuzzy', value: 'fuzzy' },
                ],
                default: 'exact',
                description: 'Type of text matching to perform',
              },
              {
                displayName: 'Exhaustive Search',
                name: 'exhaustiveSearch',
                type: 'boolean',
                default: false,
                description: 'Perform exhaustive search instead of approximate',
              },
              {
                displayName: 'Search Cutoff',
                name: 'searchCutoff',
                type: 'number',
                default: 40000,
                typeOptions: {
                  minValue: 1,
                  maxValue: 100000,
                },
                description: 'Maximum number of documents to search',
              },
              {
                displayName: 'Collection Weights',
                name: 'collectionWeights',
                type: 'string',
                default: '',
                description: 'Weights for different collections in multi-collection search',
              },
              {
                displayName: 'Pinned Hits',
                name: 'pinnedHits',
                type: 'string',
                default: '',
                description: 'Document IDs to pin at the top of results',
              },
              {
                displayName: 'Hidden Hits',
                name: 'hiddenHits',
                type: 'string',
                default: '',
                description: 'Document IDs to hide from results',
              },
            ],
          },
        ],
      },
    ];
  }

  async execute(
    operation: string,
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]> {
    const client = await getTypesenseClient.call(context);

    try {
      switch (operation) {
        case 'search':
          return await this.performSearch(context, client, itemIndex);

        case 'multiSearch':
          return await this.performMultiSearch(context, client, itemIndex);

        case 'vectorSearch':
          return await this.performVectorSearch(context, client, itemIndex);

        case 'semanticSearch':
          return await this.performSemanticSearch(context, client, itemIndex);

        case 'advancedSearch':
          return await this.performAdvancedSearch(context, client, itemIndex);

        default:
          throw new NodeOperationError(
            context.getNode(),
            `The operation "${operation}" is not supported for ${this.resourceName}.`,
            { itemIndex },
          );
      }
    } catch (error) {
      if (context.continueOnFail()) {
        return { error: (error as Error).message };
      }
      throw new NodeApiError(context.getNode(), error as JsonObject, { itemIndex });
    }
  }

  private async performSearch(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const query = this.validateRequired(context, 'query', itemIndex);

    const searchParams = this.buildSearchParameters(context, itemIndex);
    // Typesense requires `q` for text searches
    (searchParams as IDataObject).q = query;

    const response = await client.collections(collection).documents().search(searchParams);
    return [response as unknown as IDataObject];
  }

  private async performMultiSearch(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collections = this.validateRequired(context, 'collections', itemIndex);
    const query = this.validateRequired(context, 'query', itemIndex);

    // Build multiple search requests
    const searchRequests = collections.split(',').map((collectionName) => {
      const searchParams = this.buildSearchParameters(context, itemIndex);
      return {
        collection: collectionName.trim(),
        q: query,
        ...searchParams,
      };
    });

    const response = await client.multiSearch.perform({ searches: searchRequests });
    return [response as IDataObject];
  }

  // searchWithConversation removed; conversation is a regular parameter of Search

  private buildSearchParameters(context: IExecuteFunctions, itemIndex: number): IDataObject {
    const params: IDataObject = {};

    // Basic search parameters
    if (this.getOptional(context, 'queryBy', itemIndex)) {
      params.query_by = this.getOptional(context, 'queryBy', itemIndex);
    }

    if (this.getOptional(context, 'filterBy', itemIndex)) {
      params.filter_by = this.getOptional(context, 'filterBy', itemIndex);
    }

    if (this.getOptional(context, 'sortBy', itemIndex)) {
      params.sort_by = this.getOptional(context, 'sortBy', itemIndex);
    }

    if (this.getOptional(context, 'facetBy', itemIndex)) {
      params.facet_by = this.getOptional(context, 'facetBy', itemIndex);
    }

    if (this.getOptional(context, 'groupBy', itemIndex)) {
      params.group_by = this.getOptional(context, 'groupBy', itemIndex);
    }

    if (this.getOptional(context, 'groupBy', itemIndex)) {
      const groupLimit = this.getNumber(context, 'groupLimit', itemIndex, 3);
      params.group_limit = groupLimit;
    }

    // Field selection
    if (this.getOptional(context, 'includeFields', itemIndex)) {
      params.include_fields = this.getOptional(context, 'includeFields', itemIndex);
    }

    if (this.getOptional(context, 'excludeFields', itemIndex)) {
      params.exclude_fields = this.getOptional(context, 'excludeFields', itemIndex);
    }

    if (this.getOptional(context, 'highlightFields', itemIndex)) {
      params.highlight_fields = this.getOptional(context, 'highlightFields', itemIndex);
    }

    // Pagination
    const page = this.getNumber(context, 'page', itemIndex, 1);
    params.page = page;

    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
    if (!returnAll) {
      const limit = this.getNumber(context, 'limit', itemIndex, 50);
      params.per_page = limit;
    }

    // Advanced search parameters
    // Backward compatibility: legacy bucket
    const legacySearchParams = this.getObject(context, 'searchParameters', itemIndex);
    if (legacySearchParams) {
      Object.assign(params, this.processAdvancedSearchParameters(legacySearchParams));
    }

    // New grouped option buckets
    const typoTolerance = this.getObject(context, 'typoTolerance', itemIndex);
    if (typoTolerance) Object.assign(params, this.buildTypoToleranceParams(typoTolerance));

    const ranking = this.getObject(context, 'ranking', itemIndex);
    if (ranking) Object.assign(params, this.buildRankingParams(ranking));

    const highlighting = this.getObject(context, 'highlighting', itemIndex);
    if (highlighting) Object.assign(params, this.buildHighlightingParams(highlighting));

    const faceting = this.getObject(context, 'faceting', itemIndex);
    if (faceting) Object.assign(params, this.buildFacetingParams(faceting));

    const grouping = this.getObject(context, 'grouping', itemIndex);
    if (grouping) Object.assign(params, this.buildGroupingParams(grouping));

    const caching = this.getObject(context, 'caching', itemIndex);
    if (caching) Object.assign(params, this.buildCachingParams(caching));

    const advanced = this.getObject(context, 'advanced', itemIndex);
    if (advanced) Object.assign(params, this.buildAdvancedParams(advanced));

    const filterOptions = this.getObject(context, 'filterOptions', itemIndex);
    if (filterOptions) Object.assign(params, this.buildFilterParams(filterOptions));

    return params;
  }

  private processAdvancedSearchParameters(params: IDataObject): IDataObject {
    const processed: IDataObject = {};

    if (params.prefix) {
      processed.prefix = params.prefix;
    }

    if (params.infix) {
      processed.infix = params.infix;
    }

    if (params.enableHighlighting !== undefined) {
      processed.enable_highlighting = params.enableHighlighting;
    }

    // Typo tolerance settings
    if (params.enableTypoTolerance !== undefined) {
      processed.enable_typo_tolerance = params.enableTypoTolerance;
    }

    if (params.numTypos !== undefined) {
      processed.num_typos = params.numTypos;
    }

    if (params.minLengthFor1Typo !== undefined) {
      processed.min_len_1typo = params.minLengthFor1Typo;
    }

    if (params.minLengthFor2Typos !== undefined) {
      processed.min_len_2typo = params.minLengthFor2Typos;
    }

    if (params.typoTokensThreshold !== undefined) {
      processed.typo_tokens_threshold = params.typoTokensThreshold;
    }

    if (params.dropTokensThreshold !== undefined) {
      processed.drop_tokens_threshold = params.dropTokensThreshold;
    }

    if (params.dropTokensMode) {
      processed.drop_tokens_mode = params.dropTokensMode;
    }

    // Vector search
    if (params.vectorQuery) {
      processed.vector_query = params.vectorQuery;
    }

    // Voice search
    if (params.voiceQuery) {
      processed.voice_query = params.voiceQuery;
    }

    return processed;
  }

  private buildTypoToleranceParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.prefix !== undefined) p.prefix = params.prefix;
    if (params.infix !== undefined) p.infix = params.infix;
    if (params.enableTypoTolerance !== undefined)
      p.enable_typo_tolerance = params.enableTypoTolerance;
    if (params.numTypos !== undefined) p.num_typos = params.numTypos;
    if (params.minLengthFor1Typo !== undefined) p.min_len_1typo = params.minLengthFor1Typo;
    if (params.minLengthFor2Typos !== undefined) p.min_len_2typo = params.minLengthFor2Typos;
    if (params.typoTokensThreshold !== undefined)
      p.typo_tokens_threshold = params.typoTokensThreshold;
    if (params.dropTokensThreshold !== undefined)
      p.drop_tokens_threshold = params.dropTokensThreshold;
    if (params.dropTokensMode) p.drop_tokens_mode = params.dropTokensMode;
    if (params.splitJoinTokens) p.split_join_tokens = params.splitJoinTokens;
    if (params.enableTyposForNumericalTokens !== undefined)
      p.enable_typos_for_numerical_tokens = params.enableTyposForNumericalTokens;
    if (params.enableTyposForAlphaNumericalTokens !== undefined)
      p.enable_typos_for_alpha_numerical_tokens = params.enableTyposForAlphaNumericalTokens;
    if (params.synonymNumTypos !== undefined) p.synonym_num_typos = params.synonymNumTypos;
    return p;
  }

  private buildRankingParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.queryByWeights) p.query_by_weights = params.queryByWeights;
    if (params.textMatchType) p.text_match_type = params.textMatchType;
    if (params.prioritizeExactMatch !== undefined)
      p.prioritize_exact_match = params.prioritizeExactMatch;
    if (params.prioritizeTokenPosition !== undefined)
      p.prioritize_token_position = params.prioritizeTokenPosition;
    if (params.prioritizeNumMatchingFields !== undefined)
      p.prioritize_num_matching_fields = params.prioritizeNumMatchingFields;
    if (params.pinnedHits) p.pinned_hits = params.pinnedHits;
    if (params.hiddenHits) p.hidden_hits = params.hiddenHits;
    if (params.filterCuratedHits !== undefined)
      p.filter_curated_hits = params.filterCuratedHits;
    if (params.enableOverrides !== undefined) p.enable_overrides = params.enableOverrides;
    if (params.overrideTags) p.override_tags = params.overrideTags;
    if (params.enableSynonyms !== undefined) p.enable_synonyms = params.enableSynonyms;
    if (params.synonymPrefix !== undefined) p.synonym_prefix = params.synonymPrefix;
    if (params.maxCandidates !== undefined) p.max_candidates = params.maxCandidates;
    if (params.exhaustiveSearch !== undefined) p.exhaustive_search = params.exhaustiveSearch;
    return p;
  }

  private buildHighlightingParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.highlightFields) p.highlight_fields = params.highlightFields;
    if (params.enableHighlighting !== undefined)
      p.enable_highlighting = params.enableHighlighting;
    if (params.highlightFullFields) p.highlight_full_fields = params.highlightFullFields;
    if (params.highlightAffixNumTokens !== undefined)
      p.highlight_affix_num_tokens = params.highlightAffixNumTokens;
    if (params.highlightStartTag) p.highlight_start_tag = params.highlightStartTag;
    if (params.highlightEndTag) p.highlight_end_tag = params.highlightEndTag;
    if (params.enableHighlightV1 !== undefined)
      p.enable_highlight_v1 = params.enableHighlightV1;
    if (params.snippetThreshold !== undefined) p.snippet_threshold = params.snippetThreshold;
    return p;
  }

  private buildFacetingParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.facetBy) p.facet_by = params.facetBy;
    if (params.facetStrategy) p.facet_strategy = params.facetStrategy;
    if (params.maxFacetValues !== undefined) p.max_facet_values = params.maxFacetValues;
    if (params.facetQuery) p.facet_query = params.facetQuery;
    if (params.facetQueryNumTypos !== undefined)
      p.facet_query_num_typos = params.facetQueryNumTypos;
    if (params.facetReturnParent) p.facet_return_parent = params.facetReturnParent;
    if (params.facetSamplePercent !== undefined)
      p.facet_sample_percent = params.facetSamplePercent;
    if (params.facetSampleThreshold !== undefined)
      p.facet_sample_threshold = params.facetSampleThreshold;
    return p;
  }

  private buildGroupingParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.groupBy) p.group_by = params.groupBy;
    if (params.groupLimit !== undefined) p.group_limit = params.groupLimit;
    if (params.groupMissingValues !== undefined)
      p.group_missing_values = params.groupMissingValues;
    return p;
  }

  private buildCachingParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.useCache !== undefined) p.use_cache = params.useCache;
    if (params.cacheTtl !== undefined) p.cache_ttl = params.cacheTtl;
    return p;
  }

  private buildAdvancedParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.preSegmentedQuery !== undefined) p.pre_segmented_query = params.preSegmentedQuery;
    if (params.preset) p.preset = params.preset;
    if (params.stopwords) p.stopwords = params.stopwords;
    if (params.validateFieldNames !== undefined)
      p.validate_field_names = params.validateFieldNames;
    if (params.limitHits !== undefined) p.limit_hits = params.limitHits;
    if (params.searchCutoffMs !== undefined) p.search_cutoff_ms = params.searchCutoffMs;
    if (params.conversation) p.conversation = params.conversation;
    // Vector/voice in advanced (if provided here)
    if (params.vectorQuery) p.vector_query = params.vectorQuery;
    if (params.voiceQuery) p.voice_query = params.voiceQuery;
    return p;
  }

  private buildFilterParams(params: IDataObject): IDataObject {
    const p: IDataObject = {};
    if (params.enableLazyFilter !== undefined) p.enable_lazy_filter = params.enableLazyFilter;
    if (params.maxFilterByCandidates !== undefined)
      p.max_filter_by_candidates = params.maxFilterByCandidates;
    return p;
  }

  private async performVectorSearch(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const vectorQuery = this.validateRequired(context, 'vectorQuery', itemIndex);
    const vectorField = this.getOptional(context, 'vectorField', itemIndex, 'embedding');
    const distanceThreshold = this.getNumber(context, 'distanceThreshold', itemIndex, 0.8);

    // Parse vector query into array of numbers
    const vector = vectorQuery.split(',').map((v: string) => parseFloat(v.trim()));
    if (vector.some(isNaN)) {
      throw new NodeOperationError(
        context.getNode(),
        'Vector query must be comma-separated numbers.',
        { itemIndex },
      );
    }

    const searchParams: IDataObject = {
      q: '*', // Match all documents
      vector_query: `${vectorQuery}:${vectorField}`,
      filter_by: `distance(${vectorField}:${vectorQuery}):<=${distanceThreshold}`,
    };

    // Add common search parameters
    Object.assign(searchParams, this.buildSearchParameters(context, itemIndex));

    const response = await client.collections(collection).documents().search(searchParams);
    return [response as unknown as IDataObject];
  }

  private async performSemanticSearch(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const semanticQuery = this.validateRequired(context, 'semanticQuery', itemIndex);
    const vectorField = this.getOptional(context, 'vectorField', itemIndex, 'embedding');

    const searchParams: IDataObject = {
      q: semanticQuery,
      query_by: vectorField,
      vector_query: `${semanticQuery}:${vectorField}`,
    };

    // Add common search parameters
    Object.assign(searchParams, this.buildSearchParameters(context, itemIndex));

    const response = await client.collections(collection).documents().search(searchParams);
    return [response as unknown as IDataObject];
  }

  private async performAdvancedSearch(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    this.validateRequired(context, 'query', itemIndex);

    const searchParams = this.buildSearchParameters(context, itemIndex);

    // Add advanced query parameters
    const advancedParams = this.getObject(context, 'advancedQueryParams', itemIndex);
    if (advancedParams) {
      Object.assign(searchParams, this.processAdvancedQueryParameters(advancedParams));
    }

    const response = await client.collections(collection).documents().search(searchParams);
    return [response as unknown as IDataObject];
  }

  private processAdvancedQueryParameters(params: IDataObject): IDataObject {
    const processed: IDataObject = {};

    if (params.queryWeights) {
      processed.query_weights = params.queryWeights;
    }

    if (params.textMatchType) {
      processed.text_match_type = params.textMatchType;
    }

    if (params.exhaustiveSearch) {
      processed.exhaustive_search = params.exhaustiveSearch;
    }

    if (params.searchCutoff !== undefined) {
      processed.search_cutoff = params.searchCutoff;
    }

    if (params.collectionWeights) {
      processed.collection_weights = params.collectionWeights;
    }

    if (params.pinnedHits) {
      processed.pinned_hits = params.pinnedHits;
    }

    if (params.hiddenHits) {
      processed.hidden_hits = params.hiddenHits;
    }

    return processed;
  }
}
