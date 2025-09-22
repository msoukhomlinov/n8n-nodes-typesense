import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { BaseTypesenseResource } from './BaseTypesenseResource';
export declare class SearchResource extends BaseTypesenseResource {
    constructor();
    getOperations(): INodeProperties[];
    getFields(): INodeProperties[];
    execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
    private performSearch;
    private performMultiSearch;
    private performSearchWithConversation;
    private buildSearchParameters;
    private processAdvancedSearchParameters;
    private performVectorSearch;
    private performSemanticSearch;
    private performAdvancedSearch;
    private processAdvancedQueryParameters;
}
