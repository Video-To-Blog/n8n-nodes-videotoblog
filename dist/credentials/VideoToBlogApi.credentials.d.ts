import type { IAuthenticateGeneric, ICredentialType, INodeProperties, IHttpRequestMethods } from 'n8n-workflow';
export declare class VideoToBlogApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:video-to-blog.svg";
        readonly dark: "file:video-to-blog.dark.svg";
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: {
        request: {
            baseURL: string;
            url: string;
            method: IHttpRequestMethods;
            headers: {
                'Content-Type': string;
            };
            body: string;
        };
    };
}
