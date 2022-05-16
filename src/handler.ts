/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { APIGatewayEvent } from 'aws-lambda';
import documentClient from './utils/dynamoDBSetup';
import { setCustomUrl, getAllUrls, deleteUrl, mapUrl } from './utils/urlOperations';
import withAuthenticator from './utils/headerAuth';
import { responseSchema } from './types';
import setResponseHeaders from './utils/setHeaders';

module.exports.mapUrl = async (event: APIGatewayEvent):Promise<responseSchema> => {
    return await mapUrl(documentClient, event.pathParameters?.url);
};

module.exports.setCustomUrl = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
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
        return await setCustomUrl(documentClient, url, title);   
})
.before(withAuthenticator)
.use(cors({ origin: '*' }));

module.exports.allUrls = middy(async (): Promise<responseSchema> => {
    return await getAllUrls(documentClient);
})
.before(withAuthenticator)
.use(cors({ origin: '*' }));

module.exports.deleteUrl = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
    const { url } = JSON.parse(event.body);
    return await deleteUrl(documentClient, url);
})
.before(withAuthenticator)
.use(cors({ origin: '*' }));
