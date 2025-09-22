import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import Typesense from 'typesense';
import type Client from 'typesense/lib/Typesense/Client';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type {
  CollectionFieldSchema,
  CollectionUpdateSchema,
} from 'typesense/lib/Typesense/Collection';

export interface TypesenseCredentials {
  apiKey: string;
  host: string;
  port?: number;
  protocol: 'http' | 'https';
  connectionTimeoutSeconds?: number;
}

type Context = IExecuteFunctions | ILoadOptionsFunctions;

type SchemaParameters = IDataObject & {
  name?: string;
  enableNestedFields?: boolean;
  fields?: Array<IDataObject>;
};

type AdditionalParameters = IDataObject & {
  defaultSortingField?: string;
  tokenSeparators?: string;
  symbolsToIndex?: string;
  metadataJson?: string;
};

function parseCommaSeparated(value?: string): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const parts = value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return parts.length ? parts : undefined;
}

function mapFieldConfiguration(fieldEntry: IDataObject): CollectionFieldSchema {
  const mapped: CollectionFieldSchema = {
    name: fieldEntry.name as string,
    type: fieldEntry.type as CollectionFieldSchema['type'],
  };

  if (fieldEntry.facet !== undefined) mapped.facet = Boolean(fieldEntry.facet);
  if (fieldEntry.optional !== undefined) mapped.optional = Boolean(fieldEntry.optional);
  if (fieldEntry.sort !== undefined) mapped.sort = Boolean(fieldEntry.sort);
  if (fieldEntry.infix !== undefined) mapped.infix = Boolean(fieldEntry.infix);
  if (fieldEntry.index !== undefined) mapped.index = Boolean(fieldEntry.index);
  if (fieldEntry.locale) mapped.locale = String(fieldEntry.locale);

  if (fieldEntry.numDim !== undefined && fieldEntry.numDim !== null) {
    const numDim = Number(fieldEntry.numDim);
    if (!Number.isNaN(numDim) && numDim > 0) {
      mapped.num_dim = numDim;
    }
  }

  return mapped;
}

function extractFields(fields?: Array<IDataObject>): CollectionFieldSchema[] | undefined {
  if (!fields) {
    return undefined;
  }

  const mappedFields = fields
    .map((entry) => (entry.field ?? entry) as IDataObject)
    .filter((field) => field.name && field.type)
    .map(mapFieldConfiguration);

  return mappedFields.length ? mappedFields : undefined;
}

function parseMetadataJson(
  this: Context,
  metadataJson?: string,
): Record<string, unknown> | undefined {
  if (!metadataJson) {
    return undefined;
  }

  try {
    return JSON.parse(metadataJson) as Record<string, unknown>;
  } catch {
    throw new NodeOperationError(this.getNode(), 'Metadata (JSON) must be valid JSON.');
  }
}

export async function getTypesenseClient(this: Context): Promise<Client> {
  const credentials = (await this.getCredentials('typesenseApi')) as TypesenseCredentials | null;

  if (!credentials) {
    throw new NodeOperationError(this.getNode(), 'No credentials found.');
  }

  const port = credentials.port ?? (credentials.protocol === 'https' ? 443 : 8108);

  return new Typesense.Client({
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

function composeBaseSchema(
  this: Context,
  schemaParameters: SchemaParameters = {},
  additionalParameters: AdditionalParameters = {},
): Partial<CollectionCreateSchema> & CollectionUpdateSchema {
  const schema: Partial<CollectionCreateSchema> & CollectionUpdateSchema = {};

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

export function buildCollectionCreateSchema(
  this: Context,
  schemaParameters: SchemaParameters = {},
  additionalParameters: AdditionalParameters = {},
): CollectionCreateSchema {
  if (!schemaParameters.name) {
    throw new NodeOperationError(this.getNode(), 'Collection name is required.');
  }

  const baseSchema = composeBaseSchema.call(this, schemaParameters, additionalParameters);
  const fields = baseSchema.fields;

  if (!fields || fields.length === 0) {
    throw new NodeOperationError(this.getNode(), 'Please define at least one collection field.');
  }

  const schema: CollectionCreateSchema = {
    name: schemaParameters.name as string,
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

export function buildCollectionUpdateSchema(
  this: Context,
  schemaParameters: SchemaParameters = {},
  additionalParameters: AdditionalParameters = {},
): CollectionUpdateSchema {
  const baseSchema = composeBaseSchema.call(this, schemaParameters, additionalParameters);
  const schema: CollectionUpdateSchema = {};

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
