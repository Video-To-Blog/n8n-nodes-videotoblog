import type { 
    IHookFunctions, 
    IWebhookFunctions, 
    INodeType, 
    INodeTypeDescription, 
    IWebhookResponseData, 
    IDataObject 
} from 'n8n-workflow';

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
            {
                displayName: 'Continue On Fail',
                name: 'continueOnFail',
                type: 'boolean',
                default: false,
                description: 'Whether to continue workflow execution if this node fails',
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
            return false; // always create manually
        },

        async create(this: IHookFunctions): Promise<boolean> {
            const destination = this.getNodeParameter('destination') as string;
            const baseUrl = 'https://91ad81c89a94.ngrok-free.app/api';

            const credentials = await this.getCredentials('videoToBlogApi');
            if (!credentials?.apiKey) throw new Error('API key missing in credentials');

            await this.helpers.httpRequest({
                method: 'POST',
                url: `${baseUrl}/connectn8n`,
                headers: { 
                    'x-api-key': String(credentials.apiKey), 
                    'Content-Type': 'text/plain' 
                },
                body: JSON.stringify({
                    apiKey: credentials.apiKey,
                    destination,
                    webhookBaseUrl: this.getNodeWebhookUrl('default'),
                }),
                json: false,
            });

            return true;
        },

        async delete(this: IHookFunctions): Promise<boolean> {
            const destination = this.getNodeParameter('destination') as string;
            const baseUrl = 'https://91ad81c89a94.ngrok-free.app/api';

            const credentials = await this.getCredentials('videoToBlogApi');
            if (!credentials?.apiKey) throw new Error('API key missing in credentials');

            await this.helpers.httpRequest({
                method: 'POST',
                url: `${baseUrl}/connectn8n`,
                headers: { 
                    'x-api-key': String(credentials.apiKey), 
                    'Content-Type': 'text/plain' 
                },
                body: JSON.stringify({
                    apiKey: credentials.apiKey,
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
        const continueOnFail = this.getNodeParameter('continueOnFail', 0) as boolean;

        try {
            const req = this.getRequestObject();

            if (!req.body) {
                throw new Error('Webhook received no body');
            }

            const payload = req.body as IDataObject;

			const mandatoryFields = [
				'html',
				'markdown',
				'emailHtml',
				'title',
				'metaDescription',
				'metaTitle',
				'slug',
				'tags'
			];

			const missingFields = mandatoryFields.filter(field => payload[field] === undefined || payload[field] === null);

			if (missingFields.length) {
				throw new Error(`Invalid payload: missing mandatory fields - ${missingFields.join(', ')}`);
			}


            return {
                workflowData: [[{ json: payload }]],
            };

        } catch (error) {
            if (continueOnFail) {
                return {
                    workflowData: [[{ json: { error: (error as Error).message } }]],
                };
            }
            throw error;
        }
    }
}
