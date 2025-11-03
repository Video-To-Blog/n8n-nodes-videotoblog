import type { IAuthenticateGeneric, ICredentialType, INodeProperties, Icon, ICredentialTestRequest } from 'n8n-workflow';

export class VideoToBlogApi implements ICredentialType {
    name = 'videoToBlogApi';
    displayName = 'VideoToBlog API';
    documentationUrl = 'https://docs.videotoblog.ai/en/help/articles/2997507-n8n';
    icon: Icon = {
        light: 'file:video-to-blog.svg',
        dark: 'file:video-to-blog.dark.svg'
    };

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

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://www.videotoblog.ai',
            url: '/api/connectn8n',
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'verify' }),
        },
    };
}


