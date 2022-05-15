/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import middy from '@middy/core'
import cors from '@middy/http-cors'
import documentClient from './utils/dynamoDBSetup';
import * as urlOperations from './utils/urlOperations';
import withCookieAuthenticator from './utils/cookieAuth';
import { responseSchema } from './types';

const baseMapUrl = async (event):Promise<responseSchema> => {
    return await urlOperations.mapUrl(documentClient, event.pathParameters?.url);
};

const baseSetCustomUrl = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const { title, url } = JSON.parse(event.body);
        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'URL are required',
                })
            };
        }

        return await urlOperations.setCustomUrl(documentClient, url, title);
    });    
};

const baseAllUrls = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async () => {
        return await urlOperations.getAllUrls(documentClient);
    });
};

const baseDeleteUrl = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const { url } = JSON.parse(event.body);
        return await urlOperations.deleteUrl(documentClient, url);
    });
};

const mapUrl = middy(baseMapUrl)
    .use(cors({ credentials: true }));

const setCustomUrl = middy(baseSetCustomUrl)
    .use(cors({ credentials: true }));

const allUrls = middy(baseAllUrls)
    .use(cors({ credentials: true }));

const deleteUrl = middy(baseDeleteUrl)
    .use(cors({ credentials: true }));

module.exports = {
    mapUrl,
    setCustomUrl,
    allUrls,
    deleteUrl,
}