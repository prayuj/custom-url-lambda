import { PutCommand } from "@aws-sdk/lib-dynamodb";
import * as urlSlug from 'url-slug'
import { responseSchema } from "../../types";

export const setCustomUrl = async (documentClient, title: string, toUrl: string): Promise<responseSchema> => {
    
    const sluggifiedTitle = urlSlug.convert(title);

    const params = {
        TableName: "URL_SHORTNER",
        Item: {
            fromUrl: sluggifiedTitle,
            toUrl,
            setFromUniqueNames: false,
            hits: 0,
        },
    };
    try {
        await documentClient.send(new PutCommand(params));
        return { statusCode: 200, body: JSON.stringify({ url: sluggifiedTitle}) };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        }
    }
};
