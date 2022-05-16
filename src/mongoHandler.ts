import middy from "@middy/core";
import cors from '@middy/http-cors'
import { APIGatewayEvent } from 'aws-lambda';
import documentClient from "./utils/dynamoDBSetup";
import { responseSchema } from "./types";
import withAuthenticator from "./utils/headerAuth";
import { getAccessLogs, logUrlHit, setUrlNames } from "./utils/urlOperations";
import setResponseHeaders from "./utils/setHeaders";

module.exports.logUrlHit = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
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
    return await logUrlHit(documentClient, url, JSON.stringify(additional));
})
.use(cors({ origin: '*' }));

module.exports.userAccessLogs = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
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
})
.before(withAuthenticator)
.use(cors({ origin: '*' }));

module.exports.setUrlNames = middy(async (event: any): Promise<responseSchema> => {
    const { names } = JSON.parse(event.body);
    return await setUrlNames(names);
})
.before(withAuthenticator)
.use(cors({ origin: '*' }));