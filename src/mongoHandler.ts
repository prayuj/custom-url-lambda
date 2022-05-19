import middy from "@middy/core";
import cors from '@middy/http-cors'
import { APIGatewayEvent } from 'aws-lambda';
import { responseSchema } from "@types";
import withAuthenticator from "@utils/headerAuth";
import * as urlOperations from "@utils/urlOperations";

export const setUrlNames = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
    const { names } = JSON.parse(event.body || '{}');
    return await urlOperations.setUrlNames(names);
})
.use(cors({ origin: '*' }))
.before(withAuthenticator);