/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import documentClient from './dynamoDBSetup';
import getUrlSchema from './utils/getUrl';
interface mapUrlSchema {
    pathParameters: {
        url: string;
    }
}

interface mapUrlResponseSchema {
    statusCode: 200 | 400 | 404 | 500;
    body: string;
}

module.exports.mapUrl = async (event: mapUrlSchema):Promise<mapUrlResponseSchema> => {
    return await getUrlSchema(documentClient, event.pathParameters?.url);
}