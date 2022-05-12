import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { responseSchema } from '../types';

const getUrl = async (documentClient, fromUrl: string): Promise<responseSchema> => {
    if (!fromUrl) return { statusCode: 400, body: JSON.stringify({ message: 'No URL provided' }) };
    
    const params = {
        TableName: "URL_SHORTNER",
        Key: {
            fromUrl
        }
    };
    try {
        const data = await documentClient.send(new GetCommand(params));
        if (data.Item)
            return { statusCode: 200, body: JSON.stringify({ message: data.Item.toUrl }) };

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
};

export default getUrl;
