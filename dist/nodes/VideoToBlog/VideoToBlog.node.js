"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoToBlog = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class VideoToBlog {
    constructor() {
        this.description = {
            displayName: 'VideoToBlog',
            name: 'videoToBlog',
            icon: { light: 'file:video-to-blog.svg', dark: 'file:video-to-blog.dark.svg' },
            group: ['trigger'],
            version: [1, 2],
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
                    const baseUrl = 'https://88a40bb4cc35.ngrok-free.app/api';
                    const credentials = await this.getCredentials('videoToBlogApi');
                    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.apiKey))
                        throw new Error('API key missing in credentials');
                    try {
                        const response = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/connectn8n`,
                            headers: {
                                'x-api-key': String(credentials.apiKey),
                                'Content-Type': 'application/json'
                            },
                            body: {
                                apiKey: credentials.apiKey,
                                destination,
                                webhookBaseUrl: this.getNodeWebhookUrl('default')
                            },
                            json: true,
                            ignoreHttpStatusErrors: true,
                        });
                        if (!response.success) {
                            throw new Error(response.message || `Webhook  failed for destination "${destination}"`);
                        }
                        return true;
                    }
                    catch (error) {
                        const errorPayload = { message: error.message };
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), errorPayload);
                    }
                },
                async delete() {
                    const destination = this.getNodeParameter('destination');
                    const baseUrl = 'https://88a40bb4cc35.ngrok-free.app/api';
                    const credentials = await this.getCredentials('videoToBlogApi');
                    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.apiKey))
                        throw new Error('API key missing in credentials');
                    try {
                        const response = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/connectn8n`,
                            headers: {
                                'x-api-key': String(credentials.apiKey),
                                'Content-Type': 'application/json'
                            },
                            body: {
                                apiKey: credentials.apiKey,
                                destination,
                                webhookBaseUrl: this.getNodeWebhookUrl('default'),
                                action: 'unsubscribe'
                            },
                            json: true,
                            ignoreHttpStatusErrors: true,
                        });
                        if (!response.success) {
                            throw new Error(response.message || `Webhook deletion failed for destination "${destination}"`);
                        }
                        return true;
                    }
                    catch (error) {
                        const errorPayload = { message: error.message };
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), errorPayload);
                    }
                },
            },
        };
    }
    async webhook() {
        try {
            const req = this.getRequestObject();
            const nodeVersion = this.getNode().typeVersion;
            if (!req.body) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Webhook received no body');
            }
            const payload = req.body;
            if (nodeVersion >= 2) {
                const mandatoryFields = [
                    'id',
                    'status',
                    'videoUrl',
                    'createdAt',
                ];
                const status = payload.status;
                if (status === 'processing') {
                    mandatoryFields.push('percentComplete', 'detailedStatus');
                }
                else if (status === 'error') {
                    mandatoryFields.push('errorMessage');
                }
                else if (status === 'complete') {
                    mandatoryFields.push('html', 'markdown', 'emailHtml', 'title', 'metaDescription', 'metaTitle', 'slug', 'tags');
                }
                const missingFields = mandatoryFields.filter(field => payload[field] === undefined || payload[field] === null);
                if (missingFields.length) {
                    throw new Error(`Invalid payload: missing mandatory fields - ${missingFields.join(', ')}`);
                }
            }
            return {
                workflowData: [[{ json: payload }]],
            };
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
        }
    }
    ;
}
exports.VideoToBlog = VideoToBlog;
//# sourceMappingURL=VideoToBlog.node.js.map