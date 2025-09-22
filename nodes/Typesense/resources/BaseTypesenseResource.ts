import type {
  IDataObject,
  IExecuteFunctions,
  INodeProperties,
  INodeExecutionData,
} from 'n8n-workflow';

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
  execute(
    operation: string,
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]>;
}

export abstract class BaseTypesenseResource implements ITypesenseResource {
  protected readonly resourceName: string;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
  }

  /**
   * Get the resource name
   */
  public getResourceName(): string {
    return this.resourceName;
  }

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
  abstract execute(
    operation: string,
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]>;

  /**
   * Helper method to validate required parameters
   */
  protected validateRequired(
    context: IExecuteFunctions,
    parameterName: string,
    itemIndex: number,
  ): string {
    const value = context.getNodeParameter(parameterName, itemIndex) as string;
    if (!value) {
      throw new Error(`${parameterName} is required`);
    }
    return value;
  }

  /**
   * Helper method to get optional parameters with default
   */
  protected getOptional(
    context: IExecuteFunctions,
    parameterName: string,
    itemIndex: number,
    defaultValue: any = undefined,
  ): any {
    return context.getNodeParameter(parameterName, itemIndex, defaultValue);
  }

  /**
   * Helper method to handle boolean parameters
   */
  protected getBoolean(
    context: IExecuteFunctions,
    parameterName: string,
    itemIndex: number,
    defaultValue: boolean = false,
  ): boolean {
    return context.getNodeParameter(parameterName, itemIndex, defaultValue) as boolean;
  }

  /**
   * Helper method to handle number parameters
   */
  protected getNumber(
    context: IExecuteFunctions,
    parameterName: string,
    itemIndex: number,
    defaultValue: number = 0,
  ): number {
    return context.getNodeParameter(parameterName, itemIndex, defaultValue) as number;
  }

  /**
   * Helper method to handle array parameters
   */
  protected getArray(
    context: IExecuteFunctions,
    parameterName: string,
    itemIndex: number,
    defaultValue: string[] = [],
  ): string[] {
    const value = context.getNodeParameter(parameterName, itemIndex, defaultValue) as string[];
    return Array.isArray(value) ? value : defaultValue;
  }

  /**
   * Helper method to handle object parameters
   */
  protected getObject(
    context: IExecuteFunctions,
    parameterName: string,
    itemIndex: number,
    defaultValue: IDataObject = {},
  ): IDataObject {
    return context.getNodeParameter(parameterName, itemIndex, defaultValue) as IDataObject;
  }
}
