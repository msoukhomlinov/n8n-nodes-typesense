import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { BaseTypesenseResource } from './BaseTypesenseResource';
export declare class AliasResource extends BaseTypesenseResource {
    constructor();
    getOperations(): INodeProperties[];
    getFields(): INodeProperties[];
    execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
    private createAlias;
    private deleteAlias;
    private getAlias;
    private getAllAliases;
    private updateAlias;
}
