const mongoose = require("mongoose");
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import uniqueName from "../../models/uniqueName.model";

export const deleteUrl = async (documentClient, url) => {
    const params = {
        TableName: "URL_SHORTNER",
        Key: {
            fromUrl: url,
        },
        ReturnValues : "ALL_OLD",
        ConditionExpression: "attribute_exists(fromUrl)",
    };
    try {
        const { Attributes } = await documentClient.send(new DeleteCommand(params));

        if (Attributes.setFromUniqueNames) {
            mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const name = new uniqueName({
                name: Attributes.fromUrl
            });
            name.save()
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ url: Attributes.fromUrl }),
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
