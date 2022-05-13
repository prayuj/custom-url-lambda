import documentClient from "./utils/dynamoDBSetup";
import { responseSchema } from "./types";
import withCookieAuthenticator from "./utils/cookieAuth";
import { getAccessLogs, logUrlHit, setUrlNames } from "./utils/urlOperations";

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

module.exports.userAccessLogs = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const sort = {};
        const sortBy = event.queryStringParameters?.sortBy;
        const limit = event.queryStringParameters?.limit;
        const skip = event.queryStringParameters?.skip;

        try {
            if (sortBy) {
                const parts = sortBy.split(':')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            }

            return await getAccessLogs(sort, parseInt(limit), parseInt(skip));
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error })
            };
        }
    }
    );
}

module.exports.setUrlNames = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const { names } = JSON.parse(event.body);
        return await setUrlNames(names);
    });
}