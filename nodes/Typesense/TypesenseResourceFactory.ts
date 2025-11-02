import type { ITypesenseResource } from './resources/BaseTypesenseResource';
import { CollectionResource } from './resources/CollectionResource';
import { DocumentResource } from './resources/DocumentResource';
import { SearchResource } from './resources/SearchResource';
import { AnalyticsResource } from './resources/AnalyticsResource';
import { APIKeyResource } from './resources/APIKeyResource';
import { AliasResource } from './resources/AliasResource';
import { SynonymResource } from './resources/SynonymResource';
import { OverrideResource } from './resources/OverrideResource';
import { ConversationResource } from './resources/ConversationResource';

export class TypesenseResourceFactory {
  private static resourceInstances: Map<string, ITypesenseResource> = new Map();

  /**
   * Get or create a resource instance
   */
  static getResource(resourceType: string): ITypesenseResource {
    if (!this.resourceInstances.has(resourceType)) {
      const resource = this.createResource(resourceType);
      this.resourceInstances.set(resourceType, resource);
    }

    return this.resourceInstances.get(resourceType)!;
  }

  /**
   * Create a new resource instance
   */
  private static createResource(resourceType: string): ITypesenseResource {
    switch (resourceType) {
      case 'collection':
        return new CollectionResource();

      case 'document':
        return new DocumentResource();

      case 'search':
        return new SearchResource();

      case 'analytics':
        return new AnalyticsResource();

      case 'apiKey':
        return new APIKeyResource();

      case 'alias':
        return new AliasResource();

      case 'synonym':
        return new SynonymResource();

      case 'override':
        return new OverrideResource();

      case 'conversation':
        return new ConversationResource();

      default:
        throw new Error(`Resource type "${resourceType}" is not supported.`);
    }
  }

  /**
   * Get all supported resource types
   */
  static getSupportedResources(): string[] {
    return ['collection', 'document', 'search', 'analytics', 'apiKey', 'alias', 'synonym', 'override', 'conversation'];
  }

  /**
   * Check if a resource type is supported
   */
  static isResourceSupported(resourceType: string): boolean {
    return this.getSupportedResources().includes(resourceType);
  }

  /**
   * Get resource display names for UI
   */
  static getResourceDisplayNames(): Array<{ name: string; value: string }> {
    return [
      { name: 'Collection', value: 'collection' },
      { name: 'Document', value: 'document' },
      { name: 'Search', value: 'search' },
      { name: 'Analytics', value: 'analytics' },
      { name: 'API Key', value: 'apiKey' },
      { name: 'Alias', value: 'alias' },
      { name: 'Synonym', value: 'synonym' },
      { name: 'Override', value: 'override' },
      { name: 'Conversation', value: 'conversation' },
    ];
  }
}
