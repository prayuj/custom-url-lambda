export interface mapUrlSchema {
    pathParameters: {
        url: string;
    }
}

export interface mapUrlResponseSchema {
    statusCode: 200 | 400 | 404 | 500;
    body: string;
}