import mongoose from 'mongoose';
import uniqueName from '@mongoModels/uniqueName.model';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import * as urlSlug from 'url-slug'
import { responseSchema } from "@types";

export const setCustomUrl = async (documentClient, toUrl: string, title?: string): Promise<responseSchema> => {
    let setFromUniqueNames = false, sluggifiedTitle = '';

    const url = process.env.MONGODB_URL || '';
    if (!url) return {
        statusCode: 500,
        body: JSON.stringify({
            message: "Enviroment Variable MongoDB URL is not defined",
        }),
    }
    mongoose.connect(url);

    if (!title) {
        let result = await uniqueName.findOneAndDelete();
        console.log(result);
        if (!(result && result?.name)) return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Could not find unique name, please try again with a title!",
            }),
        }
        sluggifiedTitle = result.name;
        setFromUniqueNames = true;
    } else {
        sluggifiedTitle = urlSlug.convert(title);
        const titlePresentInUniqueNames = await uniqueName.findOneAndDelete({ name: sluggifiedTitle })
        setFromUniqueNames = titlePresentInUniqueNames ? true : false;
    }

    const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Item: {
            fromUrl: sluggifiedTitle,
            toUrl,
            setFromUniqueNames,
            hits: 0,
        },
    };
    try {
        await documentClient.send(new PutCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ url: sluggifiedTitle}),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        }
    }
};
