const mongoose = require('mongoose');
import userAccessInfo from "../../models/userAccessInfo.model";
import { responseSchema } from "../../types";

export const getAccessLogs = async (sort, limit = 20, skip = 0): Promise<responseSchema> => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const userAccessArray = await userAccessInfo.find({}, null, {
            limit,
            skip,
            sort
        }).exec();

        return {
            statusCode: 200,
            body: JSON.stringify({
                logs: userAccessArray
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error})
        };
    }
};