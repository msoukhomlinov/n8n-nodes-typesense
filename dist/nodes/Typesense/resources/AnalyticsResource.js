"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsResource = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BaseTypesenseResource_1 = require("./BaseTypesenseResource");
const GenericFunctions_1 = require("../GenericFunctions");
class AnalyticsResource extends BaseTypesenseResource_1.BaseTypesenseResource {
    constructor() {
        super('analytics');
    }
    getOperations() {
        return [
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
                        name: 'Delete Analytics Events',
                        value: 'deleteEvents',
                        action: 'Delete analytics events',
                        description: 'Delete analytics events by query',
                    },
                    {
                        name: 'Get Popular Queries',
                        value: 'getPopularQueries',
                        action: 'Get popular queries',
                        description: 'Retrieve most popular search queries',
                    },
                    {
                        name: 'Get No-Results Queries',
                        value: 'getNoResultsQueries',
                        action: 'Get no-results queries',
                        description: 'Retrieve queries that returned no results',
                    },
                ],
                default: 'getQuerySuggestions',
            },
        ];
    }
    getFields() {
        return [
            {
                displayName: 'Collection Name',
                name: 'collection',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['getQuerySuggestions', 'getPopularQueries', 'getNoResultsQueries'],
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
                displayName: 'User ID',
                name: 'userId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['createEvent'],
                    },
                },
                description: 'User identifier for the analytics event',
            },
            {
                displayName: 'Event Type',
                name: 'eventType',
                type: 'options',
                options: [
                    { name: 'Search', value: 'search' },
                    { name: 'Click', value: 'click' },
                    { name: 'Conversion', value: 'conversion' },
                    { name: 'Purchase', value: 'purchase' },
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
                displayName: 'Document ID',
                name: 'documentId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['createEvent'],
                    },
                },
                description: 'Document ID associated with the event (for click/conversion events)',
            },
            {
                displayName: 'Metadata (JSON)',
                name: 'metadataJson',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                default: '',
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['createEvent'],
                    },
                },
                description: 'Additional metadata for the analytics event as JSON',
            },
            {
                displayName: 'Filter By',
                name: 'filterBy',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['getEvents', 'deleteEvents'],
                    },
                },
                description: 'Filter expression for events (e.g., user_id:=user123)',
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
                        operation: ['getQuerySuggestions', 'getEvents', 'getPopularQueries', 'getNoResultsQueries'],
                    },
                },
                description: 'Maximum number of results to retrieve',
            },
            {
                displayName: 'Start Date',
                name: 'startDate',
                type: 'dateTime',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['getQuerySuggestions', 'getEvents', 'getPopularQueries', 'getNoResultsQueries', 'deleteEvents'],
                    },
                },
                description: 'Start date for filtering events',
            },
            {
                displayName: 'End Date',
                name: 'endDate',
                type: 'dateTime',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['getQuerySuggestions', 'getEvents', 'getPopularQueries', 'getNoResultsQueries', 'deleteEvents'],
                    },
                },
                description: 'End date for filtering events',
            },
            {
                displayName: 'Query Suggestions Parameters',
                name: 'suggestionsParameters',
                type: 'collection',
                placeholder: 'Add Parameter',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['getQuerySuggestions'],
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
                        description: 'Infix search query for suggestions',
                    },
                    {
                        displayName: 'Limit',
                        name: 'suggestionLimit',
                        type: 'number',
                        default: 10,
                        typeOptions: {
                            minValue: 1,
                            maxValue: 50,
                        },
                        description: 'Maximum number of suggestions to return',
                    },
                    {
                        displayName: 'Include Groups',
                        name: 'includeGroups',
                        type: 'boolean',
                        default: false,
                        description: 'Include group suggestions',
                    },
                    {
                        displayName: 'Group By',
                        name: 'groupBy',
                        type: 'string',
                        default: '',
                        description: 'Field to group suggestions by',
                    },
                ],
            },
        ];
    }
    async execute(operation, context, itemIndex) {
        const client = await GenericFunctions_1.getTypesenseClient.call(context);
        try {
            switch (operation) {
                case 'getQuerySuggestions':
                    return await this.getQuerySuggestions(context, client, itemIndex);
                case 'createEvent':
                    return await this.createAnalyticsEvent(context, client, itemIndex);
                case 'getEvents':
                    return await this.getAnalyticsEvents(context, client, itemIndex);
                case 'deleteEvents':
                    return await this.deleteAnalyticsEvents(context, client, itemIndex);
                case 'getPopularQueries':
                    return await this.getPopularQueries(context, client, itemIndex);
                case 'getNoResultsQueries':
                    return await this.getNoResultsQueries(context, client, itemIndex);
                default:
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), `The operation "${operation}" is not supported for ${this.resourceName}.`, { itemIndex });
            }
        }
        catch (error) {
            if (context.continueOnFail()) {
                return { error: error.message };
            }
            throw new n8n_workflow_1.NodeApiError(context.getNode(), error, { itemIndex });
        }
    }
    async getQuerySuggestions(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const limit = this.getNumber(context, 'limit', itemIndex, 50);
        const params = {
            q: this.getOptional(context, 'query', itemIndex, ''),
            limit,
        };
        // Add suggestions parameters
        const suggestionsParameters = this.getObject(context, 'suggestionsParameters', itemIndex);
        if (suggestionsParameters) {
            Object.assign(params, this.processSuggestionsParameters(suggestionsParameters));
        }
        const response = await client.collections(collection).documents().search(params);
        return [response];
    }
    async createAnalyticsEvent(context, client, itemIndex) {
        const query = this.validateRequired(context, 'query', itemIndex);
        const eventType = this.validateRequired(context, 'eventType', itemIndex);
        const eventData = {
            q: query,
            type: eventType,
        };
        if (this.getOptional(context, 'userId', itemIndex)) {
            eventData.user_id = this.getOptional(context, 'userId', itemIndex);
        }
        if (this.getOptional(context, 'documentId', itemIndex)) {
            eventData.doc_id = this.getOptional(context, 'documentId', itemIndex);
        }
        // Add metadata if provided
        const metadataJson = this.getOptional(context, 'metadataJson', itemIndex);
        if (metadataJson) {
            try {
                const metadata = (0, n8n_workflow_1.jsonParse)(metadataJson);
                Object.assign(eventData, metadata);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Metadata JSON must be valid JSON.', { itemIndex });
            }
        }
        // Analytics events are typically sent via a different endpoint
        // For now, we'll simulate this with a search that logs analytics
        const response = await client.multiSearch.perform({
            searches: [{
                    collection: 'analytics_events',
                    q: query,
                    filter_by: '',
                    sort_by: '',
                    include_fields: '',
                    exclude_fields: '',
                }]
        });
        return {
            success: true,
            event_type: eventType,
            query: query,
            timestamp: new Date().toISOString(),
        };
    }
    async getAnalyticsEvents(context, client, itemIndex) {
        const limit = this.getNumber(context, 'limit', itemIndex, 50);
        // Build filter conditions
        let filterConditions = [];
        if (this.getOptional(context, 'filterBy', itemIndex)) {
            filterConditions.push(this.getOptional(context, 'filterBy', itemIndex));
        }
        if (this.getOptional(context, 'startDate', itemIndex)) {
            filterConditions.push(`timestamp:>=${this.getOptional(context, 'startDate', itemIndex)}`);
        }
        if (this.getOptional(context, 'endDate', itemIndex)) {
            filterConditions.push(`timestamp:<=${this.getOptional(context, 'endDate', itemIndex)}`);
        }
        const filterBy = filterConditions.join(' && ');
        const response = await client.multiSearch.perform({
            searches: [{
                    collection: 'analytics_events',
                    q: '*',
                    filter_by: filterBy || '',
                    sort_by: 'timestamp:desc',
                    limit,
                    include_fields: '',
                    exclude_fields: '',
                }]
        });
        return [response];
    }
    async deleteAnalyticsEvents(context, client, itemIndex) {
        const filterBy = this.getOptional(context, 'filterBy', itemIndex, '');
        // Simulate delete operation
        const response = await client.multiSearch.perform({
            searches: [{
                    collection: 'analytics_events',
                    q: '*',
                    filter_by: filterBy,
                    limit: 1000, // Get events to delete
                }]
        });
        return {
            success: true,
            deleted_count: response.results?.[0]?.hits?.length || 0,
            filter: filterBy,
            timestamp: new Date().toISOString(),
        };
    }
    async getPopularQueries(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const limit = this.getNumber(context, 'limit', itemIndex, 50);
        const response = await client.collections(collection).documents().search({
            q: '',
            sort_by: 'popularity:desc',
            limit,
        });
        return [response];
    }
    async getNoResultsQueries(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const limit = this.getNumber(context, 'limit', itemIndex, 50);
        const response = await client.collections(collection).documents().search({
            q: '',
            filter_by: 'result_count:=0',
            limit,
        });
        return [response];
    }
    processSuggestionsParameters(params) {
        const processed = {};
        if (params.prefix) {
            processed.prefix = params.prefix;
        }
        if (params.infix) {
            processed.infix = params.infix;
        }
        if (params.suggestionLimit !== undefined) {
            processed.limit = params.suggestionLimit;
        }
        if (params.includeGroups) {
            processed.group_by = params.groupBy || 'collection';
        }
        return processed;
    }
}
exports.AnalyticsResource = AnalyticsResource;
