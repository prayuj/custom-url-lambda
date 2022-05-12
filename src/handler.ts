/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import documentClient from './dynamoDBSetup';
import { getUrl, setCustomUrl, getAllUrls, deleteUrl, getAccessLogs } from './utils/urlOperations';
import withCookieAuthenticator from './utils/cookieAuth';

import { responseSchema } from './types';

module.exports.mapUrl = async (event):Promise<responseSchema> => {
    return await getUrl(documentClient, event.pathParameters?.url);
};

module.exports.setCustomUrl = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const { title, url } = JSON.parse(event.body);
        if (!title || !url) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Title and URL are required',
                }),
            };
        }

        return await setCustomUrl(documentClient, title, url);
    });    
};

module.exports.allUrls = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async () => {
        return await getAllUrls(documentClient);
    });
};

module.exports.deleteUrl = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const { url } = JSON.parse(event.body);
        return await deleteUrl(documentClient, url);
    });
};