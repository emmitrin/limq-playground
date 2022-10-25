import { ApiConfig } from '../client';

export enum APIPostResponse {
    Ok,
    AuthenticationError,
    UnknownError,
    ChannelIsFull,
    Timeout,
    AnotherClientIsOnline,
    UnknownMessageType,
    UnrecognizedStatusCode,
}

const respSlice = [
    APIPostResponse.Ok,
    APIPostResponse.AuthenticationError,
    APIPostResponse.UnknownError,
    APIPostResponse.ChannelIsFull,
    APIPostResponse.Timeout,
    APIPostResponse.AnotherClientIsOnline,
    APIPostResponse.UnknownMessageType,
];

function unmarshalResponse(statusCode: number): APIPostResponse {
    if (statusCode >= 0 && statusCode < respSlice.length)
        return respSlice[statusCode];

    return APIPostResponse.UnrecognizedStatusCode;
}

interface PostResponse {
    'status_code': number;
}

export default async function PublishToChannel(key: string, data: string | ArrayBuffer): Promise<APIPostResponse> {
    const endpoint = `${ApiConfig.httpPrefix}/publish${key}`;

    const messageType = (typeof data === 'string') ? 'text' : 'binary';

    const responseObject = await fetch(endpoint, {
        method: 'POST',
        headers: { 'X-Message-Type': messageType },
        body: data,
    });

    const response: PostResponse = await responseObject.json();

    return unmarshalResponse(response['status_code']);
}

