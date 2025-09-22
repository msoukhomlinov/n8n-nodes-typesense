import type { ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class TypesenseApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    test: {
        request: {
            method: "GET";
            url: string;
        };
    };
}
