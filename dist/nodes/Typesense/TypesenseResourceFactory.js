"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesenseResourceFactory = void 0;
const CollectionResource_1 = require("./resources/CollectionResource");
const DocumentResource_1 = require("./resources/DocumentResource");
const SearchResource_1 = require("./resources/SearchResource");
const AnalyticsResource_1 = require("./resources/AnalyticsResource");
const APIKeyResource_1 = require("./resources/APIKeyResource");
const AliasResource_1 = require("./resources/AliasResource");
class TypesenseResourceFactory {
    /**
     * Get or create a resource instance
     */
    static getResource(resourceType) {
        if (!this.resourceInstances.has(resourceType)) {
            const resource = this.createResource(resourceType);
            this.resourceInstances.set(resourceType, resource);
        }
        return this.resourceInstances.get(resourceType);
    }
    /**
     * Create a new resource instance
     */
    static createResource(resourceType) {
        switch (resourceType) {
            case 'collection':
                return new CollectionResource_1.CollectionResource();
            case 'document':
                return new DocumentResource_1.DocumentResource();
            case 'search':
                return new SearchResource_1.SearchResource();
            case 'analytics':
                return new AnalyticsResource_1.AnalyticsResource();
            case 'apiKey':
                return new APIKeyResource_1.APIKeyResource();
            case 'alias':
                return new AliasResource_1.AliasResource();
            default:
                throw new Error(`Resource type "${resourceType}" is not supported.`);
        }
    }
    /**
     * Get all supported resource types
     */
    static getSupportedResources() {
        return ['collection', 'document', 'search', 'analytics', 'apiKey', 'alias'];
    }
    /**
     * Check if a resource type is supported
     */
    static isResourceSupported(resourceType) {
        return this.getSupportedResources().includes(resourceType);
    }
    /**
     * Get resource display names for UI
     */
    static getResourceDisplayNames() {
        return [
            { name: 'Collection', value: 'collection' },
            { name: 'Document', value: 'document' },
            { name: 'Search', value: 'search' },
            { name: 'Analytics', value: 'analytics' },
            { name: 'API Key', value: 'apiKey' },
            { name: 'Alias', value: 'alias' },
        ];
    }
}
exports.TypesenseResourceFactory = TypesenseResourceFactory;
TypesenseResourceFactory.resourceInstances = new Map();
