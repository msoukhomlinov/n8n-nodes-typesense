import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
  INodeType,
  INodeTypeDescription,
  JsonObject,
  NodeConnectionType,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { TypesenseResourceFactory } from './TypesenseResourceFactory';

export class Typesense implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Typesense',
    name: 'typesense',
    icon: 'file:typesense.svg',
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
    ],
  };


  /**
   * Get all properties including dynamically loaded operations and fields
   */
  getProperties(resourceType?: string): INodeProperties[] {
    const baseProperties: INodeProperties[] = [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: TypesenseResourceFactory.getResourceDisplayNames(),
        default: 'collection',
      },
    ];

    // If a specific resource is selected, add its operations and fields
    if (resourceType && TypesenseResourceFactory.isResourceSupported(resourceType)) {
      const resource = TypesenseResourceFactory.getResource(resourceType);
      baseProperties.push(...resource.getOperations());
      baseProperties.push(...resource.getFields());
    } else {
      // Default to collection operations and fields for backward compatibility
      const collectionResource = TypesenseResourceFactory.getResource('collection');
      baseProperties.push(...collectionResource.getOperations());
      baseProperties.push(...collectionResource.getFields());
    }

    return baseProperties;
  }

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
            { itemIndex }
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
