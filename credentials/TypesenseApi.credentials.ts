import type { ICredentialType, INodeProperties } from 'n8n-workflow';

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
    },
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: '',
      placeholder: 'a1xyz.us-east-1.typesense.net',
      required: true,
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
      description: 'Defaults to 443 for HTTPS and 8108 for HTTP',
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
      description: 'Time before an API request is aborted',
    },
  ];

  test = {
    request: {
      method: 'GET' as const,
      url: '={{$self["protocol"]}}://{{$self["host"]}}:{{$self["port"]}}/health',
    },
  };
}
