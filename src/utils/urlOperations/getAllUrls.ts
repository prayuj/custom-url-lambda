import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const getAllUrls = async (documentClient) => {
    const params = {
        TableName: "URL_SHORTNER",
        ProjectionExpression: "fromUrl, toUrl, hits",
    };
    try {
        const data = await documentClient.send(new ScanCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({
                urls: data.Items,
            }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error}),
        }
    }
};
