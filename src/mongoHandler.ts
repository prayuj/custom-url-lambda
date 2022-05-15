import middy from '@middy/core'
import cors from '@middy/http-cors'
import documentClient from "./utils/dynamoDBSetup";
import { responseSchema } from "./types";
import withCookieAuthenticator from "./utils/cookieAuth";
import * as urlOperations from "./utils/urlOperations";

const baseLogUrlHit = async (event, context): Promise<responseSchema> => {
    const url = event.pathParameters?.url;
    const { additional } = JSON.parse(event.body);
    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'URL is required',
            })
        };
    }
    return await urlOperations.logUrlHit(documentClient, url, JSON.stringify(additional));
}

const baseUserAccessLogs = async (event, context): Promise<responseSchema> => {
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

            return await urlOperations.getAccessLogs(sort, parseInt(limit), parseInt(skip));
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error })
            };
        }
    }
    );
}

const baseSetUrlNames = async (event, context): Promise<responseSchema> => {
    return await withCookieAuthenticator(event, context, async (event) => {
        const { names } = JSON.parse(event.body);
        return await urlOperations.setUrlNames(names);
    });
}

const logUrlHit = middy(baseLogUrlHit)
    .use(cors({ credentials: true }));
const userAccessLogs = middy(baseUserAccessLogs)
    .use(cors({ credentials: true }));
const setUrlNames = middy(baseSetUrlNames)
    .use(cors({ credentials: true }));

module.exports = {
    logUrlHit,
    userAccessLogs,
    setUrlNames
}
