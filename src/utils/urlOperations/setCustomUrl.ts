const mongoose = require("mongoose");
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import * as urlSlug from 'url-slug'
import uniqueName from "../../models/uniqueName.model";
import { responseSchema } from "../../types";

export const setCustomUrl = async (documentClient, toUrl: string, title?: string): Promise<responseSchema> => {
    let setFromUniqueNames = false, sluggifiedTitle = '';

    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    if (!title) {
        sluggifiedTitle = (await uniqueName.findOneAndDelete()).name;
        setFromUniqueNames = true;
    } else {
        sluggifiedTitle = urlSlug.convert(title);
        const titlePresentInUniqueNames = await uniqueName.findOneAndDelete({ name: sluggifiedTitle })
        setFromUniqueNames = titlePresentInUniqueNames ? true : false;
    }

    const params = {
        TableName: "URL_SHORTNER",
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
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        };
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
