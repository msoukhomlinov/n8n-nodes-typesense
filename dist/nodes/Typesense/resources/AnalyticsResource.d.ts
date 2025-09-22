import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { BaseTypesenseResource } from './BaseTypesenseResource';
export declare class AnalyticsResource extends BaseTypesenseResource {
    constructor();
    getOperations(): INodeProperties[];
    getFields(): INodeProperties[];
    execute(operation: string, context: IExecuteFunctions, itemIndex: number): Promise<IDataObject | IDataObject[]>;
    private getQuerySuggestions;
    private createAnalyticsEvent;
    private getAnalyticsEvents;
    private deleteAnalyticsEvents;
    private getPopularQueries;
    private getNoResultsQueries;
    private processSuggestionsParameters;
}
