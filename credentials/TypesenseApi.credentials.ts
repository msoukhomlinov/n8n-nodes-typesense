import type {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class TypesenseApi implements ICredentialType {
  name = 'typesenseApi';

  displayName = 'Typesense API';

  documentationUrl = 'https://typesense.org/docs/';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Typesense API key for authentication',
    },
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: '',
      placeholder: 'localhost',
      required: true,
      description: 'Typesense server hostname (e.g., localhost, typesense.example.com). Do not include protocol (http://) or port (:8108).',
    },
    {
      displayName: 'Protocol',
      name: 'protocol',
      type: 'options',
      options: [
        {
          name: 'HTTPS',
          value: 'https',
        },
        {
          name: 'HTTP',
          value: 'http',
        },
      ],
      default: 'https',
      description: 'Protocol to use for connection',
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 443,
      typeOptions: {
        minValue: 1,
        maxValue: 65535,
      },
      description: 'Port number (443 for HTTPS, 8108 for HTTP)',
    },
    {
      displayName: 'Connection Timeout (seconds)',
      name: 'connectionTimeoutSeconds',
      type: 'number',
      default: 10,
      typeOptions: {
        minValue: 1,
        maxValue: 60,
      },
      description: 'Maximum time to wait for API requests',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.protocol}}://{{$credentials.host}}:{{$credentials.port}}',
      url: '/health',
      method: 'GET',
    },
  };
}
