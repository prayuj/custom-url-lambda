import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const deleteUrl = async (documentClient, url) => {
    const params = {
        TableName: "URL_SHORTNER",
        Key: {
            fromUrl: url,
        },
        ConditionExpression: "attribute_exists(fromUrl)",
    };
    try {
        await documentClient.send(new DeleteCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ url }),
        };
    } catch (error) {

        if (error.name === "ConditionalCheckFailedException") {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Could not find resource'
                }),
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        }
    }
}

export default deleteUrl;