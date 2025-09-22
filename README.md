# n8n-nodes-typesense

An [n8n](https://n8n.io) community node that integrates with [Typesense](https://typesense.org/), the open source search platform. This first release focuses on collection management and is structured so that additional Typesense resources can be added with ease.

## Features

- Create new collections with structured inputs or raw JSON schemas.
- Retrieve a collection or list all collections from your cluster.
- Update existing schemas and delete collections you no longer need.
- Built on the official [`typesense`](https://www.npmjs.com/package/typesense) JavaScript client for reliable API access.

## Installation

1. Clone this repository locally or add it to your n8n instance as a custom community node.
2. From the repository directory, install dependencies and build the project:
   ```bash
   npm install
   npm run build
   ```
3. Copy the generated `dist` directory (or publish the package) to your n8n community nodes folder.
4. Restart n8n so it loads the new node.

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

1. Add the **Typesense** node to your workflow and select the **Collection** resource.
2. Pick an operation:
   - **Create** – Define a collection schema through the UI helper or by pasting JSON.
   - **Get** – Fetch a single collection.
   - **Get Many** – List available collections with optional limits.
   - **Update** – Add new fields or adjust metadata on an existing collection.
   - **Delete** – Remove a collection entirely.
3. Map incoming data or provide literal values as required.
4. Execute the workflow to interact with your Typesense cluster.

## Extending the node

The node is organised with resource-specific description files and generic helper functions. To add support for documents, aliases, or other Typesense features, create new description modules and extend the `execute` logic without inflating any single file beyond a maintainable size.

## Development scripts

- `npm run build` – Compile TypeScript sources to JavaScript in `dist/`.
- `npm run lint` – Lint the TypeScript sources.
- `npm run format` – Format the project with Prettier.

Feel free to open issues or pull requests if you would like to contribute additional functionality.
