import type { IAuthenticateGeneric, ICredentialType, INodeProperties, IHttpRequestMethods, Icon } from 'n8n-workflow';

export class VideoToBlogApi implements ICredentialType {
    name = 'videoToBlogApi';
    displayName = 'VideoToBlog API';
    documentationUrl = 'https://docs.videotoblog.ai/en/help/articles/2997507-n8n';
    icon = {
        light: 'file:video-to-blog.svg',
        dark: 'file:video-to-blog.dark.svg',
      } as const satisfies Icon;

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'x-api-key': '={{$credentials.apiKey}}',
            },
        },
    };

    test = {
        request: {
            baseURL: 'https://www.videotoblog.ai',
            url: '/api/connectn8n',
            method: 'POST' as IHttpRequestMethods,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'verify' }),
        },
    };
}


