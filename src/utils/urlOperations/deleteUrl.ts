import mongoose from 'mongoose';
import uniqueName from '@mongoModels/uniqueName.model';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { responseSchema } from "@types";

export const deleteUrl = async (documentClient: any, url: string):Promise<responseSchema> => {
    const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
            fromUrl: url,
        },
        ReturnValues : "ALL_OLD",
        ConditionExpression: "attribute_exists(fromUrl)",
    };
    try {
        const { Attributes } = await documentClient.send(new DeleteCommand(params));

        if (Attributes.setFromUniqueNames) {
            const url = process.env.MONGODB_URL || '';
            if (!url) return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Enviroment Variable MongoDB URL is not defined",
                }),
            }
            mongoose.connect(url);
            const name = new uniqueName({
                name: Attributes.fromUrl
            });
            name.save()
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ url: Attributes.fromUrl })
        };
    } catch (error) {

        if (error.name === "ConditionalCheckFailedException") {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Could not find resource'
                })
            }
        }
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error })
        }
    }
}
