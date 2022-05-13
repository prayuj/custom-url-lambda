import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { responseSchema } from '../../types';

export const getUrl = async (documentClient, fromUrl: string): Promise<responseSchema> => {
    if (!fromUrl) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No URL provided' }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
    };
    
    const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
            fromUrl
        }
    };
    try {
        const data = await documentClient.send(new GetCommand(params));
        if (data.Item)
            return { statusCode: 200,
                body: JSON.stringify({ url: data.Item.toUrl }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            };

        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'Could not find resource'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        }
    }
};
