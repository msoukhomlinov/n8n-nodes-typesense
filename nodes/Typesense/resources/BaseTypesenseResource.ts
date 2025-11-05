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

  /**
   * Helper method to filter columns from result objects
   * @param result - The result object or array to filter
   * @param filterColumns - Comma-separated list of column names to include
   * @returns Filtered result with only specified columns
   */
  protected filterColumns(
    result: IDataObject | IDataObject[],
    filterColumns: string,
  ): IDataObject | IDataObject[] {
    // Early return if no filter specified
    if (!filterColumns || filterColumns.trim() === '') {
      return result;
    }

    // Parse the comma-separated column names
    const columns = filterColumns
      .split(',')
      .map((col) => col.trim())
      .filter((col) => col.length > 0);

    // If no valid columns after parsing, return original result
    if (columns.length === 0) {
      return result;
    }

    // Function to filter a single object
    const filterObject = (obj: IDataObject): IDataObject => {
      const filtered: IDataObject = {};
      for (const col of columns) {
        if (Object.prototype.hasOwnProperty.call(obj, col)) {
          filtered[col] = obj[col];
        }
      }
      return filtered;
    };

    // Apply filtering to array or single object
    if (Array.isArray(result)) {
      return result.map((item) => filterObject(item));
    } else {
      return filterObject(result);
    }
  }
}
