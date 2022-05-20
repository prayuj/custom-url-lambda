import middy from "@middy/core";
import cors from '@middy/http-cors';
import { APIGatewayEvent } from "aws-lambda";
import { responseSchema } from "./types";
import documentClient from "./utils/dynamoDBSetup";
import { mapUrl } from "./utils/urlOperations";

module.exports.mapUrl = middy(async (event: APIGatewayEvent): Promise<responseSchema> => {
    return await mapUrl(documentClient, event.pathParameters?.url, event.queryStringParameters);
})
.use(cors({ origin: '*' }));