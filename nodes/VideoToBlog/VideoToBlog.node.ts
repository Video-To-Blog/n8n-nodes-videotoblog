import type { IHookFunctions, IWebhookFunctions, INodeType, INodeTypeDescription, IWebhookResponseData, IDataObject } from 'n8n-workflow';

export class VideoToBlog implements INodeType {
	description: INodeTypeDescription = {
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
			// Signature verification intentionally omitted until server-side signing is live
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

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			// Register webhook URL in VT on activation or test
			async create(this: IHookFunctions) {
				const destination = this.getNodeParameter('destination') as string;
				const baseUrl = 'https://www.videotoblog.ai/api';
				const credentials = await this.getCredentials('videoToBlogApi');
				await this.helpers.httpRequest({
					method: 'POST',
					url: `${baseUrl}/connectn8n`,
					headers: { 'x-api-key': String(credentials?.apiKey), 'Content-Type': 'text/plain' },
					body: JSON.stringify({
						apiKey: credentials?.apiKey,
						destination,
						webhookBaseUrl: this.getNodeWebhookUrl('default'),
					}),
					json: false,
				});
				return true;
			},
			// Unregister webhook URL in VT
			async delete(this: IHookFunctions) {
				const destination = this.getNodeParameter('destination') as string;
				const baseUrl = 'https://www.videotoblog.ai/api';
				const credentials = await this.getCredentials('videoToBlogApi');
				await this.helpers.httpRequest({
					method: 'POST',
					url: `${baseUrl}/connectn8n`,
					headers: { 'x-api-key': String(credentials?.apiKey), 'Content-Type': 'text/plain' },
					body: JSON.stringify({
						apiKey: credentials?.apiKey,
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

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const payload = req.body as IDataObject;
		return {
			workflowData: [[{ json: payload }]],
		};
	}
}
