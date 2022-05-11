/**
 * Import the load for DynamoDB here and not in individual files
 * because when container reuse happens, the setup is already loaded
 */
import documentClient from './dynamoDBSetup';
import getUrlSchema from './utils/getUrl';

import { mapUrlResponseSchema } from './types';

module.exports.mapUrl = async (event):Promise<mapUrlResponseSchema> => {
    return await getUrlSchema(documentClient, event.pathParameters?.url);
}