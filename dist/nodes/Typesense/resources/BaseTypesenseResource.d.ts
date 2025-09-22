import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
export interface ITypesenseResource {
    /**
     * Get the operations supported by this resource
     */
    getOperations(): INodeProperties[];
    /**
     * Get the fields/parameters for this resource
     */
    getFields(): INodeProperties[];
    /**
     * Execute the specified operation
     */
    execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
}
export declare abstract class BaseTypesenseResource implements ITypesenseResource {
    protected readonly resourceName: string;
    constructor(resourceName: string);
    /**
     * Get the resource name
     */
    getResourceName(): string;
    /**
     * Default operations implementation - can be overridden by subclasses
     */
    abstract getOperations(): INodeProperties[];
    /**
     * Default fields implementation - can be overridden by subclasses
     */
    abstract getFields(): INodeProperties[];
    /**
     * Execute the specified operation - must be implemented by subclasses
     */
    abstract execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
    /**
     * Helper method to validate required parameters
     */
    protected validateRequired(context: IExecuteFunctions, parameterName: string, itemIndex: number): string;
    /**
     * Helper method to get optional parameters with default
     */
    protected getOptional(context: IExecuteFunctions, parameterName: string, itemIndex: number, defaultValue?: any): any;
    /**
     * Helper method to handle boolean parameters
     */
    protected getBoolean(context: IExecuteFunctions, parameterName: string, itemIndex: number, defaultValue?: boolean): boolean;
    /**
     * Helper method to handle number parameters
     */
    protected getNumber(context: IExecuteFunctions, parameterName: string, itemIndex: number, defaultValue?: number): number;
    /**
     * Helper method to handle array parameters
     */
    protected getArray(context: IExecuteFunctions, parameterName: string, itemIndex: number, defaultValue?: string[]): string[];
    /**
     * Helper method to handle object parameters
     */
    protected getObject(context: IExecuteFunctions, parameterName: string, itemIndex: number, defaultValue?: IDataObject): IDataObject;
}
