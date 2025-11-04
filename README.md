# n8n-nodes-typesense

An [n8n](https://n8n.io) community node that integrates with [Typesense](https://typesense.org/), the open source search platform. This node provides comprehensive access to Typesense's API, covering collections, documents, search, analytics, and more.

## Features

### Core Resources

- **Collections**: Full CRUD operations for managing Typesense collections with structured inputs or raw JSON schemas
- **Documents**: Complete document management including CRUD operations, search, bulk import/export (JSONL), and delete by query
- **Search**: Advanced search capabilities with multi-search and query suggestions
- **Analytics**: Track and analyze search behavior with custom events, popular queries, and no-results queries
- **API Keys**: Manage API keys with full CRUD+Update operations
- **Aliases**: Create and manage collection aliases for seamless schema migrations
- **Synonyms**: Configure synonym sets for improved search relevance
- **Search Overrides**: Curate search results with rule-based overrides, includes/excludes, and custom filters
- **Conversation Models**: Manage LLM conversation models (OpenAI, Cloudflare, vLLM) for AI-powered features

### Key Capabilities

- Built on the official [`typesense`](https://www.npmjs.com/package/typesense) JavaScript client for reliable API access
- Support for both JSON and structured form inputs across all resources
- JSONL (newline-delimited JSON) support for bulk document operations
- Comprehensive field validation and optional parameters
- Proper error handling with n8n error types
- ~95% API compliance with Typesense API v30.0

## Installation

### Via npm (recommended)

Install the published package into your n8n instance:

```bash
npm install n8n-nodes-typesense
```

Restart n8n so it loads the new node.

### From source (for development/contribution)

1. Clone this repository and install dependencies:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Link or copy the generated `dist` to your n8n community nodes folder and restart n8n.

## Credentials

The node uses a dedicated **Typesense API** credential with the following fields:

- **API Key** – your Typesense admin or search key for authentication.
- **Host** – the hostname of your Typesense server (e.g., `localhost`, `typesense.example.com`, or `a1xyz.us-east-1.typesense.net`).
- **Protocol** – HTTPS or HTTP, depending on your cluster.
- **Port** – the port number (defaults to 443 for HTTPS, 8108 for HTTP).
- **Connection Timeout** – maximum time in seconds to wait for API requests.

The credential tester constructs the base URL from your Protocol, Host, and Port settings, then calls the `/health` endpoint to confirm connectivity.

### Supported Host Formats

For the **Host** field in credentials, enter only the hostname:

- **Plain hostname**: `localhost`, `typesense.example.com`
- **Cloud instances**: `a1xyz.us-east-1.typesense.net`

**Important**: Do not include protocol (`http://`) or port (`:8108`) in the Host field. Use the Protocol and Port fields for those settings.

The credential test will use the Protocol and Port fields to construct the test URL.

## Troubleshooting

### Connection Issues

If you encounter connection problems, here are common issues and solutions:

#### "Invalid URL" Error
- **Cause**: The credential test constructs the baseURL as `protocol://host:port` and then appends `/health`
- **Solution**: Ensure the Host field contains only a hostname (e.g., `localhost`, `typesense.example.com`)
- **Check**: Do not include `http://`, `https://`, or port numbers in the Host field. Use separate Protocol and Port fields.

#### "Connection Timeout" Error
- **Cause**: Cannot reach the Typesense server
- **Solution**:
  - Verify the host is reachable from your network
  - Check firewall settings
  - Confirm the port is open
  - Ensure Typesense server is running

#### "Connection Refused" Error
- **Cause**: Typesense server not running or wrong port
- **Solution**:
  - Verify Typesense is running on the specified host and port
  - Check if the port matches your Typesense configuration
  - Ensure the API key is correct

#### "Authentication Failed" Error
- **Cause**: Invalid or insufficient API key
- **Solution**:
  - Verify the API key is correct
  - Ensure the API key has the required permissions
  - Check if the API key is for the correct Typesense instance

#### "Health Endpoint Not Found" Error
- **Cause**: Typesense version doesn't support the health endpoint
- **Solution**: Try a different approach or check your Typesense version

### Common Port Numbers

- **HTTP**: 8108 (default)
- **HTTPS**: 443 (default)
- **Custom installations**: Check your Typesense configuration

### Testing Your Connection

1. Use the credential test feature in n8n to verify connectivity
2. Check if you can access the health endpoint manually: `http://your-host:your-port/health`
3. Verify network connectivity using `ping your-host` or `telnet your-host your-port`

## Usage

1. Add the **Typesense** node to your workflow and select a resource:
   - **Collection** – Manage collections (CRUD operations)
   - **Document** – Manage documents (CRUD, search, import/export, delete by query)
   - **Search** – Execute multi-search queries and get query suggestions
   - **Analytics** – Track events and analyze search behavior
   - **API Key** – Manage API keys (CRUD+Update)
   - **Alias** – Manage collection aliases (CRUD+Update)
   - **Synonym** – Manage synonym sets (CRUD)
   - **Override** – Curate search results with overrides (CRUD)
   - **Conversation** – Manage LLM conversation models (CRUD+Update)

2. Select an operation for your chosen resource (e.g., Create, Get, Update, Delete)

3. Configure the operation:
   - Use structured form inputs for guided configuration
   - Or use JSON input for advanced/complex configurations
   - Map incoming data or provide literal values as required

4. Execute the workflow to interact with your Typesense cluster

### Example Use Cases

- **E-commerce**: Import product catalogs, configure synonyms for better search, and track popular queries
- **Content Management**: Index articles, use search overrides to promote featured content, and analyze search behavior
- **AI Applications**: Manage conversation models for RAG (Retrieval-Augmented Generation) implementations
- **Data Migration**: Bulk export from one collection and import to another using JSONL format

## Architecture

The node is organized with a modular architecture:

- **Resource Classes**: Each Typesense resource (Collection, Document, etc.) has its own class extending `BaseTypesenseResource`
- **Description Files**: UI field definitions are separated into dedicated description files
- **Factory Pattern**: `TypesenseResourceFactory` manages resource instantiation
- **Generic Functions**: Shared utilities for client initialization and common operations

This structure makes the codebase maintainable and allows for easy extension with additional Typesense features.

## Development scripts

- `npm run build` – Compile TypeScript sources to JavaScript in `dist/`.
- `npm run lint` – Lint the TypeScript sources.
- `npm run format` – Format the project with Prettier.

Feel free to open issues or pull requests if you would like to contribute additional functionality.
