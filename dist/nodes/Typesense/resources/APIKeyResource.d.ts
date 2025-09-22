import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { BaseTypesenseResource } from './BaseTypesenseResource';
export declare class APIKeyResource extends BaseTypesenseResource {
    constructor();
    getOperations(): INodeProperties[];
    getFields(): INodeProperties[];
    execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
    private createAPIKey;
    private deleteAPIKey;
    private getAPIKey;
    private getAllAPIKeys;
    private updateAPIKey;
}
