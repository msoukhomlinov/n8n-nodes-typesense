import type { IExecuteFunctions, INodeExecutionData, INodeProperties, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class Typesense implements INodeType {
    description: INodeTypeDescription;
    /**
     * Get all properties including dynamically loaded operations and fields
     */
    getProperties(resourceType?: string): INodeProperties[];
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
