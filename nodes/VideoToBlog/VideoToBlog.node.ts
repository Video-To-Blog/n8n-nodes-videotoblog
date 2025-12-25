import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import type { IHookFunctions, IWebhookFunctions, INodeType, INodeTypeDescription, IWebhookResponseData, IDataObject, JsonObject } from 'n8n-workflow';
export class VideoToBlog implements INodeType {
	description: INodeTypeDescription = {
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

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},

			// Register webhook URL in VTB on activation or test
			async create(this: IHookFunctions): Promise<boolean> {
				const destination = this.getNodeParameter('destination') as string;
				const baseUrl = 'https://videotoblog.ai/api';

				const credentials = await this.getCredentials('videoToBlogApi');

				if (!credentials?.apiKey) throw new Error('API key missing in credentials');

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
					const errorPayload = { message: (error as Error).message } as JsonObject;
					throw new NodeApiError(this.getNode(), errorPayload);
				}
			},

			// Unregister webhook URL in VTB
			async delete(this: IHookFunctions): Promise<boolean> {
				const destination = this.getNodeParameter('destination') as string;
				const baseUrl = 'https://videotoblog.ai/api';

				const credentials = await this.getCredentials('videoToBlogApi');

				if (!credentials?.apiKey) throw new Error('API key missing in credentials');

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
					const errorPayload = { message: (error as Error).message } as JsonObject;
					throw new NodeApiError(this.getNode(), errorPayload);
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		try {
			const req = this.getRequestObject();

			if (!req.body) {
				throw new NodeOperationError(this.getNode(), 'Webhook received no body');
			}

			const payload = req.body as IDataObject;

			const mandatoryFields = [
				'id',
				'status',
				'videoUrl',
				'createdAt',
			];

			const status = payload.status as string;

			if (status === 'processing') {
				mandatoryFields.push('percentComplete', 'detailedStatus');
			} else if (status === 'error') {
				mandatoryFields.push('errorMessage');
			} else if (status === 'complete') {
				mandatoryFields.push(
					'html',
					'markdown',
					'emailHtml',
					'title',
					'metaDescription',
					'metaTitle',
					'slug',
					'tags',
				);
			}

			const missingFields = mandatoryFields.filter(field => payload[field] === undefined || payload[field] === null);

			if (missingFields.length) {
				throw new Error(`Invalid payload: missing mandatory fields - ${missingFields.join(', ')}`);
			}

			return {
				workflowData: [[{ json: payload }]],
			};

		}
		catch (error) {
			throw new NodeOperationError(this.getNode(), error as Error);
		}
	};
}