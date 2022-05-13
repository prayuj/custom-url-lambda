const mongoose = require('mongoose');
import userAccessInfo from '../../models/userAccessInfo.model';
import { responseSchema } from '../../types';
import { getUrl } from './getUrl';

export const logUrlHit = async (documentClient, url, additional):Promise<responseSchema> => {

    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const { statusCode, body, headers } = (await getUrl(documentClient, url));

        if(statusCode !== 200) {
            return {
                statusCode,
                body,
                headers,
            };
        }
        
        const target = JSON.parse(body).url;

        const newLog = new userAccessInfo({
            additional,
            url,
            target
        });

        await newLog.save()

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'URL hit logged',
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        };   
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        }
    }

};
