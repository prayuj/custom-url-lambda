import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { responseSchema } from "../../types";

const updateUrlCount = async (documentClient, url): Promise<responseSchema> => {
    const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
            fromUrl: url,
        },
        ConditionExpression: "attribute_exists(fromUrl)",
        UpdateExpression: "set hits = hits + :val",
        ExpressionAttributeValues: {
            ":val": 1,
        },
        ReturnValues: "ALL_NEW",
    };
    try {
        const data = await documentClient.send(new UpdateCommand(params));
        if (data.Attributes) {
            return {
                statusCode: 200,
                body: JSON.stringify({ item: data.Attributes })
            };
        }
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'Could not find resource'
            }),
        }
    } catch (error) {
        if (error.name === "ConditionalCheckFailedException") {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Could not find resource'
                })
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify(error),
        }
    }

};

export default updateUrlCount;