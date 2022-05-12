import documentClient from "./dynamoDBSetup";
import { responseSchema } from "./types";
import withCookieAuthenticator from "./utils/cookieAuth";
import logUrlHit from "./utils/logUrlHit";

module.exports.logUrlHit = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const url = event.pathParameters?.url;
        const { additional } = JSON.parse(event.body);
        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'URL is required',
                }),
            };
        }
        return await logUrlHit(documentClient, url, JSON.stringify(additional));
    });
}