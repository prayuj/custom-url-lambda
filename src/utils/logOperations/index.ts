import { CloudWatchLogsClient, DescribeLogStreamsCommand, GetLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { responseSchema } from "../../types";

const REGION = "us-east-1";
const client = new CloudWatchLogsClient({ region: REGION });

export const getCloudWatchLogStreams = async ():Promise<responseSchema> => {
    try {
        const command = new DescribeLogStreamsCommand({
            logGroupName: process.env.LOG_GROUP_NAME,
            descending: true,
            orderBy: 'LastEventTime',
            limit: 20,
        });
        const response = await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({
                logStreams: response.logStreams,
            }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        }
    }
};

export const getLogsFromStream = async (logStreamName: string): Promise<responseSchema> => {
    try {
        const command = new GetLogEventsCommand({
            logGroupName: process.env.LOG_GROUP_NAME,
            logStreamName: logStreamName,
        });
        const response = await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({
                events: response.events,
            }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        }
    }
};