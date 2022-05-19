import mongoose from 'mongoose';
import uniqueName from '@mongoModels/uniqueName.model';
import * as urlSlug from 'url-slug';
import { responseSchema } from '@types';

export const setUrlNames = async (names: string[]):Promise<responseSchema> => {
    try {
        const slugsNotSet: string[] = [];

        const url = process.env.MONGODB_URL || '';
        if (!url) return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Enviroment Variable MongoDB URL is not defined",
            }),
        }
        mongoose.connect(url);

        for (let index = 0; index < names.length; index++) {
            const sluggifiedTitle = urlSlug.convert(names[index]);
            const name = new uniqueName({
                name: sluggifiedTitle
            });
            try {
                await name.save();
            } catch (error) {
                slugsNotSet.push()
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