import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  JsonObject,
  NodeConnectionType,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { TypesenseResourceFactory } from './TypesenseResourceFactory';
import { collectionOperations, collectionFields } from './descriptions/CollectionDescription';
import { documentOperations, documentFields } from './descriptions/DocumentDescription';
import { searchOperations, searchFields } from './descriptions/SearchDescription';
import { analyticsOperations, analyticsFields } from './descriptions/AnalyticsDescription';
import { apiKeyOperations, apiKeyFields } from './descriptions/APIKeyDescription';
import { aliasOperations, aliasFields } from './descriptions/AliasDescription';
import { synonymOperations, synonymFields } from './descriptions/SynonymDescription';
import { overrideOperations, overrideFields } from './descriptions/OverrideDescription';
import { conversationOperations, conversationFields } from './descriptions/ConversationDescription';

export class Typesense implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Typesense',
    name: 'typesense',
    icon: 'file:typesense.svg',
    usableAsTool: true,
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}} {{ $parameter["resource"] }}',
    description: 'Interact with the Typesense search platform',
    defaults: {
      name: 'Typesense',
    },
    inputs: ['main'] as Array<NodeConnectionType>,
    outputs: ['main'] as Array<NodeConnectionType>,
    credentials: [
      {
        name: 'typesenseApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: TypesenseResourceFactory.getResourceDisplayNames(),
        default: 'collection',
      },
      // Collection operations and fields
      ...collectionOperations,
      ...collectionFields,
      // Document operations and fields
      ...documentOperations,
      ...documentFields,
      // Search operations and fields
      ...searchOperations,
      ...searchFields,
      // Analytics operations and fields
      ...analyticsOperations,
      ...analyticsFields,
      // API Key operations and fields
      ...apiKeyOperations,
      ...apiKeyFields,
      // Alias operations and fields
      ...aliasOperations,
      ...aliasFields,
      // Synonym operations and fields
      ...synonymOperations,
      ...synonymFields,
      // Override operations and fields
      ...overrideOperations,
      ...overrideFields,
      // Conversation operations and fields
      ...conversationOperations,
      ...conversationFields,
    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const resourceType = this.getNodeParameter('resource', itemIndex) as string;
      const operation = this.getNodeParameter('operation', itemIndex) as string;

      try {
        // Validate resource type
        if (!TypesenseResourceFactory.isResourceSupported(resourceType)) {
          throw new NodeOperationError(
            this.getNode(),
            `The resource "${resourceType}" is not supported. Supported resources: ${TypesenseResourceFactory.getSupportedResources().join(', ')}`,
            { itemIndex },
          );
        }

        // Get the appropriate resource implementation
        const resource = TypesenseResourceFactory.getResource(resourceType);

        // Execute the operation using the resource implementation
        const result = await resource.execute(operation, this, itemIndex);

        // Handle both single objects and arrays
        if (Array.isArray(result)) {
          returnData.push(...result);
        } else {
          returnData.push(result);
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ error: (error as Error).message });
          continue;
        }

        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
