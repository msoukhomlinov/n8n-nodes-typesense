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
  synonymSets?: string;
  voiceQueryModelJson?: string;
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

  // Add new field properties from API spec
  if (fieldEntry.reference) mapped.reference = String(fieldEntry.reference);
  if (fieldEntry.drop !== undefined) mapped.drop = Boolean(fieldEntry.drop);
  if (fieldEntry.store !== undefined) mapped.store = Boolean(fieldEntry.store);
  if (fieldEntry.vecDist) mapped.vec_dist = String(fieldEntry.vecDist);
  if (fieldEntry.rangeIndex !== undefined) mapped.range_index = Boolean(fieldEntry.rangeIndex);
  if (fieldEntry.stem !== undefined) mapped.stem = Boolean(fieldEntry.stem);
  if (fieldEntry.stemDictionary) mapped.stem_dictionary = String(fieldEntry.stemDictionary);

  // Handle field-level token separators and symbols to index
  if (fieldEntry.tokenSeparators) {
    const separators = parseCommaSeparated(String(fieldEntry.tokenSeparators));
    if (separators) mapped.token_separators = separators;
  }

  if (fieldEntry.symbolsToIndex) {
    const symbols = parseCommaSeparated(String(fieldEntry.symbolsToIndex));
    if (symbols) mapped.symbols_to_index = symbols;
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

function parseHost(host: string): { host: string; port?: number; protocol?: string } {
  // Remove common URL prefixes if present
  const cleanHost = host.trim();

  // Handle URLs with protocols
  if (cleanHost.startsWith('http://') || cleanHost.startsWith('https://')) {
    try {
      const url = new URL(cleanHost);
      return {
        host: url.hostname,
        port: url.port ? parseInt(url.port, 10) : undefined,
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
      };
    } catch {
      // Fall through to basic parsing
    }
  }

  // Handle host:port format
  const parts = cleanHost.split(':');
  if (parts.length === 2) {
    const port = parseInt(parts[1], 10);
    if (!isNaN(port)) {
      return {
        host: parts[0],
        port,
      };
    }
  }

  // Return as-is for plain hostnames
  return { host: cleanHost };
}

export async function getTypesenseClient(this: Context): Promise<Client> {
  const credentials = (await this.getCredentials('typesenseApi')) as TypesenseCredentials | null;

  if (!credentials) {
    throw new NodeOperationError(this.getNode(), 'No credentials found.');
  }

  // Parse host to extract any embedded protocol or port information
  const parsedHost = parseHost(credentials.host);

  // Use parsed values if available, otherwise fall back to credential values
  const host = parsedHost.host;
  const port =
    parsedHost.port ?? credentials.port ?? (credentials.protocol === 'https' ? 443 : 8108);
  const protocol = parsedHost.protocol ?? credentials.protocol;

  // Validate host
  if (!host || host.trim() === '') {
    throw new NodeOperationError(
      this.getNode(),
      'Host is required. Please provide a valid hostname.',
    );
  }

  // Validate port
  if (port < 1 || port > 65535) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid port: ${port}. Port must be between 1 and 65535.`,
    );
  }

  // Validate protocol
  if (!['http', 'https'].includes(protocol)) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid protocol: ${protocol}. Must be 'http' or 'https'.`,
    );
  }

  // Create client with validated connection details
  try {
    const client = new Typesense.Client({
      nodes: [
        {
          host,
          port,
          protocol,
        },
      ],
      apiKey: credentials.apiKey,
      connectionTimeoutSeconds: credentials.connectionTimeoutSeconds ?? 10,
    });

    // Test the connection by making a simple health check
    try {
      await client.health.retrieve();
    } catch (connectionError) {
      const errorMessage = (connectionError as Error).message.toLowerCase();
      let userFriendlyMessage = 'Connection failed. Please check your settings and try again.';

      if (errorMessage.includes('timeout') || errorMessage.includes('etimedout')) {
        userFriendlyMessage = `Connection timeout. Please check:
• Host: ${host} is reachable
• Port: ${port} is correct
• Network connectivity
• Firewall settings`;
      } else if (errorMessage.includes('refused') || errorMessage.includes('connection refused')) {
        userFriendlyMessage = `Connection refused. Please check:
• Host: ${host} is correct
• Port: ${port} is correct
• Typesense server is running
• Network connectivity`;
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
        userFriendlyMessage = `Authentication failed. Please check:
• API Key is correct
• API Key has the required permissions`;
      } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        userFriendlyMessage = `Health endpoint not found. Please check:
• Host: ${host} is correct
• Port: ${port} is correct
• Typesense version supports /health endpoint`;
      } else if (errorMessage.includes('invalid url') || errorMessage.includes('invalid host')) {
        userFriendlyMessage = `Invalid URL format. Please check:
• Host: ${host} is a valid hostname
• Port: ${port} is between 1-65535
• Protocol: ${protocol} is http or https`;
      }

      throw new NodeOperationError(this.getNode(), userFriendlyMessage);
    }

    return client;
  } catch (error) {
    if (error instanceof NodeOperationError) {
      throw error;
    }

    throw new NodeOperationError(
      this.getNode(),
      `Failed to create Typesense client: ${(error as Error).message}`,
    );
  }
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

  // Add new API parameters
  if (additionalParameters.synonymSets) {
    const synonymSets = parseCommaSeparated(additionalParameters.synonymSets);
    if (synonymSets) {
      (schema as Record<string, unknown>).synonym_sets = synonymSets;
    }
  }

  if (additionalParameters.voiceQueryModelJson) {
    try {
      const voiceQueryModel = parseMetadataJson.call(this, additionalParameters.voiceQueryModelJson);
      if (voiceQueryModel) {
        (schema as Record<string, unknown>).voice_query_model = voiceQueryModel;
      }
    } catch {
      throw new NodeOperationError(this.getNode(), 'Voice Query Model JSON must be valid JSON.');
    }
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
