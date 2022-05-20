/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { APIGatewayEvent } from 'aws-lambda';
import documentClient from '@utils/dynamoDBSetup';
import * as urlOperations from '@utils/urlOperations';
import withAuthenticator from '@utils/headerAuth';
import { responseSchema } from '@types';

export const setCustomUrl = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'No body provided' }),
            };
        }
        const parsedJSON = JSON.parse(event.body);
        const url = parsedJSON.url || '';
        const title = parsedJSON.title || '';

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'URL is required',
                })
            };
        }
    return await urlOperations.setCustomUrl(documentClient, url, title);   
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);

export const allUrls = middy(async (): Promise<responseSchema> => {
    return await urlOperations.getAllUrls(documentClient);
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);

export const deleteUrl = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
    const { url } = JSON.parse(event.body || '{}');
    return await urlOperations.deleteUrl(documentClient, url);
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);
