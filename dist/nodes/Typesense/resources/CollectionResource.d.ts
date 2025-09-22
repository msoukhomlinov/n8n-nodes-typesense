import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { BaseTypesenseResource } from './BaseTypesenseResource';
export declare class CollectionResource extends BaseTypesenseResource {
    constructor();
    getOperations(): INodeProperties[];
    getFields(): INodeProperties[];
    execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
    private createCollection;
    private deleteCollection;
    private getCollection;
    private getAllCollections;
    private updateCollection;
}
