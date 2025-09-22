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

- **API Key** – your Typesense admin or search key.
- **Protocol** – HTTPS or HTTP, depending on your cluster.
- **Host** and **Port** – the address of your Typesense server. Defaults to port 443 for HTTPS.
- **Connection Timeout** – optional timeout in seconds for API requests.

The credential tester calls the `/health` endpoint to confirm connectivity before the node runs.

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
