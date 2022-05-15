import { responseSchema } from "../types";

const isAuthenticatedWithCookie = (cookies: string) => {
    if (!cookies) return false;
    return cookies.includes(`key=${process.env.COOKIE_ACCESS_TOKEN}`);
};

const withCookieAuthenticator = async (request) => {
    if (!isAuthenticatedWithCookie(request.event?.headers?.Cookie)) 
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),};
};

export default withCookieAuthenticator;
