import type { IDataObject, IExecuteFunctions, INodeProperties, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';
import type Client from 'typesense/lib/Typesense/Client';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import { getTypesenseClient } from '../GenericFunctions';

interface TypesenseCredentials {
  apiKey: string;
  host: string;
  port?: number;
  protocol: 'http' | 'https';
}

export class AnalyticsResource extends BaseTypesenseResource {
  constructor() {
    super('analytics');
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
            resource: ['analytics'],
          },
        },
        options: [
          {
            name: 'Create Analytics Event',
            value: 'createEvent',
            action: 'Create analytics event',
            description: 'Submit an analytics event (requires analytics rule)',
          },
          {
            name: 'Get Analytics Events',
            value: 'getEvents',
            action: 'Get analytics events',
            description: 'Retrieve analytics events for a user and rule',
          },
          {
            name: 'Flush Analytics',
            value: 'flush',
            action: 'Flush analytics',
            description: 'Flush in-memory analytics data to disk',
          },
          {
            name: 'Get Analytics Status',
            value: 'getStatus',
            action: 'Get analytics status',
            description: 'Get analytics subsystem status',
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
  }

  getFields(): INodeProperties[] {
    return [
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
  }

  async execute(
    operation: string,
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]> {
    const client = await getTypesenseClient.call(context);
    const credentials = (await context.getCredentials('typesenseApi')) as TypesenseCredentials;

    try {
      switch (operation) {
        case 'createEvent':
          return await this.createAnalyticsEvent(context, client, credentials, itemIndex);

        case 'getEvents':
          return await this.getAnalyticsEvents(context, client, credentials, itemIndex);

        case 'flush':
          return await this.flushAnalytics(context, client, credentials);

        case 'getStatus':
          return await this.getAnalyticsStatus(context, client, credentials);

        case 'createRule':
          return await this.createAnalyticsRule(context, client, credentials, itemIndex);

        case 'getRules':
          return await this.getAnalyticsRules(context, client, credentials, itemIndex);

        case 'getRule':
          return await this.getAnalyticsRule(context, client, credentials, itemIndex);

        case 'updateRule':
          return await this.updateAnalyticsRule(context, client, credentials, itemIndex);

        case 'deleteRule':
          return await this.deleteAnalyticsRule(context, client, credentials, itemIndex);

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

  /**
   * Get the base URL for Typesense API
   */
  private getBaseUrl(credentials: TypesenseCredentials): string {
    const port = credentials.port ?? (credentials.protocol === 'https' ? 443 : 8108);
    return `${credentials.protocol}://${credentials.host}:${port}`;
  }

  /**
   * Make HTTP request to Typesense analytics endpoint
   */
  private async makeAnalyticsRequest(
    context: IExecuteFunctions,
    credentials: TypesenseCredentials,
    method: string,
    endpoint: string,
    body?: IDataObject | IDataObject[],
    queryParams?: Record<string, string>,
  ): Promise<IDataObject | IDataObject[]> {
    const baseUrl = this.getBaseUrl(credentials);
    let url = `${baseUrl}${endpoint}`;

    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const options: IDataObject = {
      method,
      url,
      headers: {
        'X-TYPESENSE-API-KEY': credentials.apiKey,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = body;
      options.json = true;
    }

    return (await context.helpers.request(options)) as IDataObject | IDataObject[];
  }

  private async createAnalyticsEvent(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
    itemIndex: number,
  ): Promise<IDataObject> {
    const ruleName = this.validateRequired(context, 'ruleName', itemIndex);
    const eventType = this.validateRequired(context, 'eventType', itemIndex);
    const eventDataJson = this.validateRequired(context, 'eventDataJson', itemIndex);

    let eventData: IDataObject;
    try {
      eventData = jsonParse<IDataObject>(eventDataJson);
    } catch {
      throw new NodeOperationError(context.getNode(), 'Event data JSON must be valid JSON.', {
        itemIndex,
      });
    }

    const analyticsEvent: IDataObject = {
      name: ruleName,
      event_type: eventType,
      data: eventData,
    };

    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'POST',
      '/analytics/events',
      analyticsEvent,
    );

    return response as IDataObject;
  }

  private async getAnalyticsEvents(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const userId = this.validateRequired(context, 'userId', itemIndex);
    const ruleName = this.validateRequired(context, 'ruleNameForEvents', itemIndex);
    const n = this.getNumber(context, 'n', itemIndex, 100);

    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'GET',
      '/analytics/events',
      undefined,
      {
        user_id: userId,
        name: ruleName,
        n: n.toString(),
      },
    );

    return [response as IDataObject];
  }

  private async flushAnalytics(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
  ): Promise<IDataObject> {
    const response = await this.makeAnalyticsRequest(context, credentials, 'POST', '/analytics/flush');

    return response as IDataObject;
  }

  private async getAnalyticsStatus(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
  ): Promise<IDataObject> {
    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'GET',
      '/analytics/status',
    );

    return response as IDataObject;
  }

  private async createAnalyticsRule(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]> {
    const ruleJson = this.validateRequired(context, 'ruleJson', itemIndex);

    let ruleData: IDataObject | IDataObject[];
    try {
      ruleData = jsonParse<IDataObject | IDataObject[]>(ruleJson);
    } catch {
      throw new NodeOperationError(context.getNode(), 'Rule JSON must be valid JSON.', {
        itemIndex,
      });
    }

    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'POST',
      '/analytics/rules',
      ruleData,
    );

    return Array.isArray(response) ? response : [response];
  }

  private async getAnalyticsRules(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const ruleTag = this.getOptional(context, 'ruleTag', itemIndex, '');

    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'GET',
      '/analytics/rules',
      undefined,
      ruleTag ? { rule_tag: ruleTag } : undefined,
    );

    return Array.isArray(response) ? response : [response];
  }

  private async getAnalyticsRule(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
    itemIndex: number,
  ): Promise<IDataObject> {
    const ruleName = this.validateRequired(context, 'ruleName', itemIndex);

    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'GET',
      `/analytics/rules/${encodeURIComponent(ruleName)}`,
    );

    return response as IDataObject;
  }

  private async updateAnalyticsRule(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
    itemIndex: number,
  ): Promise<IDataObject> {
    const ruleName = this.validateRequired(context, 'ruleName', itemIndex);
    const ruleJson = this.validateRequired(context, 'ruleJson', itemIndex);

    let ruleData: IDataObject;
    try {
      ruleData = jsonParse<IDataObject>(ruleJson);
    } catch {
      throw new NodeOperationError(context.getNode(), 'Rule JSON must be valid JSON.', {
        itemIndex,
      });
    }

    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'PUT',
      `/analytics/rules/${encodeURIComponent(ruleName)}`,
      ruleData,
    );

    return response as IDataObject;
  }

  private async deleteAnalyticsRule(
    context: IExecuteFunctions,
    client: Client,
    credentials: TypesenseCredentials,
    itemIndex: number,
  ): Promise<IDataObject> {
    const ruleName = this.validateRequired(context, 'ruleName', itemIndex);

    const response = await this.makeAnalyticsRequest(
      context,
      credentials,
      'DELETE',
      `/analytics/rules/${encodeURIComponent(ruleName)}`,
    );

    return response as IDataObject;
  }
}
