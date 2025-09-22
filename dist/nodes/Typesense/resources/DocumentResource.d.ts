import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { BaseTypesenseResource } from './BaseTypesenseResource';
export declare class DocumentResource extends BaseTypesenseResource {
    constructor();
    getOperations(): INodeProperties[];
    getFields(): INodeProperties[];
    execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
    private createDocument;
    private deleteDocument;
    private getDocument;
    private getAllDocuments;
    private updateDocument;
    private searchDocuments;
    private deleteByQuery;
    private buildDocumentData;
    private processSearchParameters;
}
