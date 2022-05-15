import { responseSchema } from "../../types";
import updateUrlCount from "./updateUrlCount";

export const mapUrl = async (documentClient, fromUrl: string): Promise<responseSchema> => {

    const { statusCode, body, headers } = (await updateUrlCount(documentClient, fromUrl));

    if (statusCode !== 200) {
        return {
            statusCode,
            body,
            headers
        };
    }

    return {
        statusCode,
        body: JSON.stringify({
            url: JSON.parse(body).item.toUrl,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }     
    }
    
};