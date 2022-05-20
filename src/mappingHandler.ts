import middy from '@middy/core';
import cors from '@middy/http-cors';
import documentClient from '@utils/dynamoDBSetup';
import * as urlOperations from '@utils/urlOperations';
import { APIGatewayEvent } from 'aws-lambda';
import { responseSchema } from '@types';
export const mapUrl = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
    return await urlOperations.mapUrl(documentClient, event.pathParameters?.url, event.queryStringParameters);
})
.use(cors({ origin: '*' }));