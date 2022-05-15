/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import documentClient from './utils/dynamoDBSetup';
import { setCustomUrl, getAllUrls, deleteUrl, mapUrl } from './utils/urlOperations';
import withCookieAuthenticator from './utils/cookieAuth';
import { responseSchema } from './types';

module.exports.mapUrl = async (event):Promise<responseSchema> => {
    return await mapUrl(documentClient, event.pathParameters?.url);
};

module.exports.setCustomUrl = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const { title, url } = JSON.parse(event.body);
        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'URL is required',
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            };
        }

        return await setCustomUrl(documentClient, url, title);
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
