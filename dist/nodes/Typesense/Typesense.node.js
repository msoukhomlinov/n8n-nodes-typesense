"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typesense = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const TypesenseResourceFactory_1 = require("./TypesenseResourceFactory");
class Typesense {
    constructor() {
        this.description = {
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
            inputs: ['main'],
            outputs: ['main'],
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
                    options: TypesenseResourceFactory_1.TypesenseResourceFactory.getResourceDisplayNames(),
                    default: 'collection',
                },
            ],
        };
    }
    /**
     * Get all properties including dynamically loaded operations and fields
     */
    getProperties(resourceType) {
        const baseProperties = [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: TypesenseResourceFactory_1.TypesenseResourceFactory.getResourceDisplayNames(),
                default: 'collection',
            },
        ];
        // If a specific resource is selected, add its operations and fields
        if (resourceType && TypesenseResourceFactory_1.TypesenseResourceFactory.isResourceSupported(resourceType)) {
            const resource = TypesenseResourceFactory_1.TypesenseResourceFactory.getResource(resourceType);
            baseProperties.push(...resource.getOperations());
            baseProperties.push(...resource.getFields());
        }
        else {
            // Default to collection operations and fields for backward compatibility
            const collectionResource = TypesenseResourceFactory_1.TypesenseResourceFactory.getResource('collection');
            baseProperties.push(...collectionResource.getOperations());
            baseProperties.push(...collectionResource.getFields());
        }
        return baseProperties;
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const resourceType = this.getNodeParameter('resource', itemIndex);
            const operation = this.getNodeParameter('operation', itemIndex);
            try {
                // Validate resource type
                if (!TypesenseResourceFactory_1.TypesenseResourceFactory.isResourceSupported(resourceType)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resourceType}" is not supported. Supported resources: ${TypesenseResourceFactory_1.TypesenseResourceFactory.getSupportedResources().join(', ')}`, { itemIndex });
                }
                // Get the appropriate resource implementation
                const resource = TypesenseResourceFactory_1.TypesenseResourceFactory.getResource(resourceType);
                // Execute the operation using the resource implementation
                const result = await resource.execute(operation, this, itemIndex);
                // Handle both single objects and arrays
                if (Array.isArray(result)) {
                    returnData.push(...result);
                }
                else {
                    returnData.push(result);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex });
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.Typesense = Typesense;
