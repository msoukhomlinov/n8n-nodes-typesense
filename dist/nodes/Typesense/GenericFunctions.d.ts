import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import type Client from 'typesense/lib/Typesense/Client';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type { CollectionUpdateSchema } from 'typesense/lib/Typesense/Collection';
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
export declare function getTypesenseClient(this: Context): Promise<Client>;
export declare function buildCollectionCreateSchema(this: Context, schemaParameters?: SchemaParameters, additionalParameters?: AdditionalParameters): CollectionCreateSchema;
export declare function buildCollectionUpdateSchema(this: Context, schemaParameters?: SchemaParameters, additionalParameters?: AdditionalParameters): CollectionUpdateSchema;
export {};
