"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoToBlogApi = void 0;
class VideoToBlogApi {
    constructor() {
        this.name = 'videoToBlogApi';
        this.displayName = 'VideoToBlog API';
        this.documentationUrl = 'https://docs.videotoblog.ai/en/help/articles/2997507-n8n';
        this.icon = {
            light: 'file:video-to-blog.svg',
            dark: 'file:video-to-blog.dark.svg',
        };
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                required: true,
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'x-api-key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://www.videotoblog.ai',
                url: '/api/connectn8n',
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'verify' }),
            },
        };
    }
}
exports.VideoToBlogApi = VideoToBlogApi;
//# sourceMappingURL=VideoToBlogApi.credentials.js.map