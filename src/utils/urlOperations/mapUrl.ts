import { responseSchema } from "../../types";
import updateUrlCount from "./updateUrlCount";

export const mapUrl = async (documentClient, fromUrl: string, additional: string): Promise<responseSchema> => {
    const { statusCode, body } = (await updateUrlCount(documentClient, fromUrl));

    if (statusCode !== 200) {
        return {
            statusCode,
            body,
        };
    }

    const url = JSON.parse(body).item.toUrl;

    console.log('Log Hit for: ', fromUrl);
    console.log('Additional: ', JSON.parse(additional));
    console.log('Mapped Url: ', url);

    return {
        statusCode,
        body: JSON.stringify({ url }),    
    }
    
};