"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesenseApi = void 0;
class TypesenseApi {
    constructor() {
        this.name = 'typesenseApi';
        this.displayName = 'Typesense API';
        this.documentationUrl = 'https://typesense.org/docs/';
        this.properties = [
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
        this.test = {
            request: {
                method: 'GET',
                url: '={{$self["protocol"]}}://{{$self["host"]}}:{{$self["port"]}}/health',
            },
        };
    }
}
exports.TypesenseApi = TypesenseApi;
