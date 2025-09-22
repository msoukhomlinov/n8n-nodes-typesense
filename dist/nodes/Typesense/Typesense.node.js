"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typesense = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const CollectionDescription_1 = require("./descriptions/CollectionDescription");
const GenericFunctions_1 = require("./GenericFunctions");
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
                    options: [
                        {
                            name: 'Collection',
                            value: 'collection',
                        },
                    ],
                    default: 'collection',
                },
                ...CollectionDescription_1.collectionOperations,
                ...CollectionDescription_1.collectionFields,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const client = await GenericFunctions_1.getTypesenseClient.call(this);
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const resource = this.getNodeParameter('resource', itemIndex);
            const operation = this.getNodeParameter('operation', itemIndex);
            try {
                if (resource !== 'collection') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not supported.`);
                }
                if (operation === 'create') {
                    const useJson = this.getNodeParameter('jsonParameters', itemIndex);
                    let schemaPayload;
                    if (useJson) {
                        const schemaJson = this.getNodeParameter('schemaJson', itemIndex);
                        if (!schemaJson) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Schema JSON must be provided.', {
                                itemIndex,
                            });
                        }
                        schemaPayload = (0, n8n_workflow_1.jsonParse)(schemaJson);
                        if (!schemaPayload.name || !Array.isArray(schemaPayload.fields)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Schema JSON must include both "name" and "fields" properties.', { itemIndex });
                        }
                    }
                    else {
                        const schemaParameters = this.getNodeParameter('schemaParameters', itemIndex);
                        const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});
                        schemaPayload = GenericFunctions_1.buildCollectionCreateSchema.call(this, schemaParameters, additionalFields);
                    }
                    const response = await client.collections().create(schemaPayload);
                    returnData.push(response);
                    continue;
                }
                if (operation === 'delete') {
                    const collectionId = this.getNodeParameter('collectionId', itemIndex);
                    const response = await client.collections(collectionId).delete();
                    returnData.push(response);
                    continue;
                }
                if (operation === 'get') {
                    const collectionId = this.getNodeParameter('collectionId', itemIndex);
                    const response = await client.collections(collectionId).retrieve();
                    returnData.push(response);
                    continue;
                }
                if (operation === 'getAll') {
                    const returnAll = this.getNodeParameter('returnAll', itemIndex);
                    const allCollections = (await client
                        .collections()
                        .retrieve());
                    if (!Array.isArray(allCollections)) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Unexpected response received from Typesense.');
                    }
                    if (returnAll) {
                        returnData.push(...allCollections);
                        continue;
                    }
                    const limit = this.getNodeParameter('limit', itemIndex);
                    returnData.push(...allCollections.slice(0, limit));
                    continue;
                }
                if (operation === 'update') {
                    const collectionId = this.getNodeParameter('collectionId', itemIndex);
                    const useJson = this.getNodeParameter('jsonParameters', itemIndex);
                    let updatePayload;
                    if (useJson) {
                        const schemaJson = this.getNodeParameter('schemaJson', itemIndex);
                        if (!schemaJson) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Schema JSON must be provided.', {
                                itemIndex,
                            });
                        }
                        updatePayload = (0, n8n_workflow_1.jsonParse)(schemaJson);
                    }
                    else {
                        const schemaParameters = this.getNodeParameter('updateSchemaParameters', itemIndex, {});
                        const additionalFields = this.getNodeParameter('updateAdditionalFields', itemIndex, {});
                        updatePayload = GenericFunctions_1.buildCollectionUpdateSchema.call(this, schemaParameters, additionalFields);
                    }
                    if (Object.keys(updatePayload).length === 0) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please provide at least one field to update.', {
                            itemIndex,
                        });
                    }
                    const response = await client.collections(collectionId).update(updatePayload);
                    returnData.push(response);
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported.`);
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
