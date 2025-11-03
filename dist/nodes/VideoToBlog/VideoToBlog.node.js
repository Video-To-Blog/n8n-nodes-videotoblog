"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoToBlog = void 0;
class VideoToBlog {
    constructor() {
        this.description = {
            displayName: 'VideoToBlog',
            name: 'videoToBlog',
            icon: { light: 'file:video-to-blog.svg', dark: 'file:video-to-blog.dark.svg' },
            group: ['trigger'],
            version: 1,
            subtitle: '={{"Post Exported"}}',
            description: 'Emits events from Video To Blog when a post is exported',
            defaults: { name: 'VideoToBlog' },
            inputs: [],
            outputs: ['main'],
            usableAsTool: true,
            credentials: [{ name: 'videoToBlogApi', required: true }],
            properties: [
                {
                    displayName: 'Destination',
                    name: 'destination',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'Friendly destination name configured in Video To Blog'
                },
                {
                    displayName: 'Trigger Event',
                    name: 'event',
                    type: 'options',
                    options: [{ name: 'Post Exported', value: 'postExported' }],
                    default: 'postExported',
                    description: 'Event to listen for'
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'vt',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    return false;
                },
                async create() {
                    const destination = this.getNodeParameter('destination');
                    const baseUrl = 'https://www.videotoblog.ai/api';
                    const credentials = await this.getCredentials('videoToBlogApi');
                    await this.helpers.httpRequest({
                        method: 'POST',
                        url: `${baseUrl}/connectn8n`,
                        headers: { 'x-api-key': String(credentials === null || credentials === void 0 ? void 0 : credentials.apiKey), 'Content-Type': 'text/plain' },
                        body: JSON.stringify({
                            apiKey: credentials === null || credentials === void 0 ? void 0 : credentials.apiKey,
                            destination,
                            webhookBaseUrl: this.getNodeWebhookUrl('default'),
                        }),
                        json: false,
                    });
                    return true;
                },
                async delete() {
                    const destination = this.getNodeParameter('destination');
                    const baseUrl = 'https://www.videotoblog.ai/api';
                    const credentials = await this.getCredentials('videoToBlogApi');
                    await this.helpers.httpRequest({
                        method: 'POST',
                        url: `${baseUrl}/connectn8n`,
                        headers: { 'x-api-key': String(credentials === null || credentials === void 0 ? void 0 : credentials.apiKey), 'Content-Type': 'text/plain' },
                        body: JSON.stringify({
                            apiKey: credentials === null || credentials === void 0 ? void 0 : credentials.apiKey,
                            destination,
                            webhookBaseUrl: this.getNodeWebhookUrl('default'),
                            action: 'unsubscribe',
                        }),
                        json: false,
                    });
                    return true;
                },
            },
        };
    }
    async webhook() {
        const req = this.getRequestObject();
        const payload = req.body;
        return {
            workflowData: [[{ json: payload }]],
        };
    }
}
exports.VideoToBlog = VideoToBlog;
//# sourceMappingURL=VideoToBlog.node.js.map