import { responseSchema } from "../types";

const isAuthenticatedWithCookie = (cookies: string) => {
    if (!cookies) return false;
    return cookies.includes(`key=${process.env.COOKIE_ACCESS_TOKEN}`);
};

const withCookieAuthenticator = async (event, context, callBack): Promise<responseSchema> => {
    if (!isAuthenticatedWithCookie(event.headers?.Cookie)) 
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' })};    

    return await callBack(event, context);
    
};

export default withCookieAuthenticator;
