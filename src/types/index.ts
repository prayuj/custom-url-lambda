export interface mapUrlSchema {
    pathParameters: {
        url: string;
    }
}

export interface responseSchema {
    statusCode: 200 | 400 | 401| 404 | 500;
    body: string;
    headers: {
        [key: string]: any;
    };
}