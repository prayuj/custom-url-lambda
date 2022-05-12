const mongoose = require('mongoose');
import userAccessInfo from '../../models/userAccessInfo.model';
import updateUrlCount from "./updateUrlCount";

export const logUrlHit = async (documentClient, url, additional) => {

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const { statusCode, body } = (await updateUrlCount(documentClient, url));

        if(statusCode !== 200) {
            return {
                statusCode,
                body
            };
        }
        
        const target = JSON.parse(body).target;

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
        };   
    } catch (error) {
        
    }

};
