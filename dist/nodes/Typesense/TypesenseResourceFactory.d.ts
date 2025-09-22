import type { ITypesenseResource } from './resources/BaseTypesenseResource';
export declare class TypesenseResourceFactory {
    private static resourceInstances;
    /**
     * Get or create a resource instance
     */
    static getResource(resourceType: string): ITypesenseResource;
    /**
     * Create a new resource instance
     */
    private static createResource;
    /**
     * Get all supported resource types
     */
    static getSupportedResources(): string[];
    /**
     * Check if a resource type is supported
     */
    static isResourceSupported(resourceType: string): boolean;
    /**
     * Get resource display names for UI
     */
    static getResourceDisplayNames(): Array<{
        name: string;
        value: string;
    }>;
}
