/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { APIGatewayEvent } from 'aws-lambda';
import documentClient from './utils/dynamoDBSetup';
import { setCustomUrl, getAllUrls, deleteUrl } from './utils/urlOperations';
import withAuthenticator from './utils/headerAuth';
import { responseSchema } from './types';
import { getCloudWatchLogStreams, getLogsFromStream } from './utils/logOperations';

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
.use(cors({ origin: '*' }))
.before(withAuthenticator);

module.exports.allUrls = middy(async (): Promise<responseSchema> => {
    return await getAllUrls(documentClient);
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);

module.exports.deleteUrl = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
    const { url } = JSON.parse(event.body);
    return await deleteUrl(documentClient, url);
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);

module.exports.getCloudWatchLogStreams = middy(async (): Promise<responseSchema> => {
    return await getCloudWatchLogStreams();
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);

module.exports.getLogsFromStream = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
    const { logStreamName } = event.queryStringParameters;
    if(!logStreamName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No logStreamName provided' }),
        };
    }
    return await getLogsFromStream(logStreamName);
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);
