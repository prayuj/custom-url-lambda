import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { responseSchema } from "../../types";

export const getAllUrls = async (documentClient):Promise<responseSchema> => {
    const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
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
            body: JSON.stringify({ error }),
        }
    }
};
