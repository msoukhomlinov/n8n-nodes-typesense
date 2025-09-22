"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypesenseClient = getTypesenseClient;
exports.buildCollectionCreateSchema = buildCollectionCreateSchema;
exports.buildCollectionUpdateSchema = buildCollectionUpdateSchema;
const n8n_workflow_1 = require("n8n-workflow");
const typesense_1 = __importDefault(require("typesense"));
function parseCommaSeparated(value) {
    if (!value) {
        return undefined;
    }
    const parts = value
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    return parts.length ? parts : undefined;
}
function mapFieldConfiguration(fieldEntry) {
    const mapped = {
        name: fieldEntry.name,
        type: fieldEntry.type,
    };
    if (fieldEntry.facet !== undefined)
        mapped.facet = Boolean(fieldEntry.facet);
    if (fieldEntry.optional !== undefined)
        mapped.optional = Boolean(fieldEntry.optional);
    if (fieldEntry.sort !== undefined)
        mapped.sort = Boolean(fieldEntry.sort);
    if (fieldEntry.infix !== undefined)
        mapped.infix = Boolean(fieldEntry.infix);
    if (fieldEntry.index !== undefined)
        mapped.index = Boolean(fieldEntry.index);
    if (fieldEntry.locale)
        mapped.locale = String(fieldEntry.locale);
    if (fieldEntry.numDim !== undefined && fieldEntry.numDim !== null) {
        const numDim = Number(fieldEntry.numDim);
        if (!Number.isNaN(numDim) && numDim > 0) {
            mapped.num_dim = numDim;
        }
    }
    return mapped;
}
function extractFields(fields) {
    if (!fields) {
        return undefined;
    }
    const mappedFields = fields
        .map((entry) => (entry.field ?? entry))
        .filter((field) => field.name && field.type)
        .map(mapFieldConfiguration);
    return mappedFields.length ? mappedFields : undefined;
}
function parseMetadataJson(metadataJson) {
    if (!metadataJson) {
        return undefined;
    }
    try {
        return JSON.parse(metadataJson);
    }
    catch {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Metadata (JSON) must be valid JSON.');
    }
}
async function getTypesenseClient() {
    const credentials = (await this.getCredentials('typesenseApi'));
    if (!credentials) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials found.');
    }
    const port = credentials.port ?? (credentials.protocol === 'https' ? 443 : 8108);
    return new typesense_1.default.Client({
        nodes: [
            {
                host: credentials.host,
                port,
                protocol: credentials.protocol,
            },
        ],
        apiKey: credentials.apiKey,
        connectionTimeoutSeconds: credentials.connectionTimeoutSeconds ?? 10,
    });
}
function composeBaseSchema(schemaParameters = {}, additionalParameters = {}) {
    const schema = {};
    if (schemaParameters.enableNestedFields) {
        schema.enable_nested_fields = true;
    }
    const fields = extractFields(schemaParameters.fields);
    if (fields) {
        schema.fields = fields;
    }
    if (additionalParameters.defaultSortingField) {
        schema.default_sorting_field = additionalParameters.defaultSortingField;
    }
    const tokenSeparators = parseCommaSeparated(additionalParameters.tokenSeparators);
    if (tokenSeparators) {
        schema.token_separators = tokenSeparators;
    }
    const symbolsToIndex = parseCommaSeparated(additionalParameters.symbolsToIndex);
    if (symbolsToIndex) {
        schema.symbols_to_index = symbolsToIndex;
    }
    const metadata = parseMetadataJson.call(this, additionalParameters.metadataJson);
    if (metadata) {
        schema.metadata = metadata;
    }
    return schema;
}
function buildCollectionCreateSchema(schemaParameters = {}, additionalParameters = {}) {
    if (!schemaParameters.name) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Collection name is required.');
    }
    const baseSchema = composeBaseSchema.call(this, schemaParameters, additionalParameters);
    const fields = baseSchema.fields;
    if (!fields || fields.length === 0) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please define at least one collection field.');
    }
    const schema = {
        name: schemaParameters.name,
        fields,
    };
    if (baseSchema.enable_nested_fields !== undefined) {
        schema.enable_nested_fields = baseSchema.enable_nested_fields;
    }
    if (baseSchema.default_sorting_field) {
        schema.default_sorting_field = baseSchema.default_sorting_field;
    }
    if (baseSchema.token_separators) {
        schema.token_separators = baseSchema.token_separators;
    }
    if (baseSchema.symbols_to_index) {
        schema.symbols_to_index = baseSchema.symbols_to_index;
    }
    if (baseSchema.metadata) {
        schema.metadata = baseSchema.metadata;
    }
    return schema;
}
function buildCollectionUpdateSchema(schemaParameters = {}, additionalParameters = {}) {
    const baseSchema = composeBaseSchema.call(this, schemaParameters, additionalParameters);
    const schema = {};
    if (baseSchema.fields) {
        schema.fields = baseSchema.fields;
    }
    if (baseSchema.enable_nested_fields !== undefined) {
        schema.enable_nested_fields = baseSchema.enable_nested_fields;
    }
    if (baseSchema.default_sorting_field) {
        schema.default_sorting_field = baseSchema.default_sorting_field;
    }
    if (baseSchema.token_separators) {
        schema.token_separators = baseSchema.token_separators;
    }
    if (baseSchema.symbols_to_index) {
        schema.symbols_to_index = baseSchema.symbols_to_index;
    }
    if (baseSchema.metadata) {
        schema.metadata = baseSchema.metadata;
    }
    return schema;
}
