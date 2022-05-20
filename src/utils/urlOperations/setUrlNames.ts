const mongoose = require('mongoose');
import * as urlSlug from 'url-slug';
import uniqueName from "../../models/uniqueName.model";
import { responseSchema } from '../../types';

export const setUrlNames = async (names: string[]):Promise<responseSchema> => {
    try {
        const slugsNotSet = [];
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        for (let index = 0; index < names.length; index++) {
            const sluggifiedTitle = urlSlug.convert(names[index]);
            const name = new uniqueName({
                name: sluggifiedTitle
            });
            try {
                await name.save();
            } catch (error) {
                slugsNotSet.push(sluggifiedTitle)
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: 'Successfully Set New Unique Names',
                slugsNotSet
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        };
    }
};