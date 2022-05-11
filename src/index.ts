import { GetCommand } from '@aws-sdk/lib-dynamodb';
import documentClient from './dynamoDBSetup';
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
    const url = event.pathParameters?.url || '';

    if (!url) return { statusCode: 400, body: JSON.stringify({message: 'No URL provided'}) };
    const params = {
        TableName: "URL_SHORTNER",
        Key: {
            fromUrl: url,
        }
    };
    try {
        const data = await documentClient.send(new GetCommand(params));
        if (data.Item) 
            return { statusCode: 200, body: JSON.stringify({message: data.Item.toUrl}) };

        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'Could not find resource'
            }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        }
    }
}