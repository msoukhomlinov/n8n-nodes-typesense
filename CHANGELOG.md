# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-04

### Added
- **Collection Resource**: Full CRUD operations for managing Typesense collections
- **Document Resource**: Complete document management with CRUD operations, search, and bulk operations
  - Document Import: Bulk import documents using JSONL format
  - Document Export: Bulk export documents with filtering options
  - Delete by Query: Remove multiple documents matching filter criteria
- **Search Resource**: Advanced search capabilities
  - Multi-search: Execute multiple search queries in a single request
  - Query Suggestions: Get search query suggestions
- **Analytics Resource**: Track and analyze search behavior
  - Create Analytics Events: Log custom analytics events
  - Get Analytics Events: Retrieve logged events
  - Popular Queries: Get most popular search queries
  - No-Results Queries: Identify searches that returned no results
- **API Key Resource**: Full CRUD+Update operations for API key management
- **Alias Resource**: Full CRUD+Update operations for collection aliases
- **Synonym Resource**: Full CRUD operations for managing synonym sets
- **Search Override Resource**: Full CRUD operations for curating search results
  - Configure rules with exact or contains matching
  - Include/exclude specific documents at positions
  - Apply filters, sorting, and query replacements
- **Conversation Models Resource**: Full CRUD+Update operations for LLM conversation management
  - Support for OpenAI, Cloudflare, and vLLM models
  - Configure model parameters, system prompts, and TTL

### Features
- Typesense API credential with health check validation
- Support for both JSON and structured form inputs across all resources
- Proper error handling with n8n error types
- JSONL (newline-delimited JSON) support for bulk operations
- Comprehensive field validation and optional parameters
- Direct HTTP request support for endpoints not exposed by the Typesense client library
