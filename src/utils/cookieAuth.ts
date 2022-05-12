const isAuthenticatedWithCookie = (cookies: string) => {
    return cookies.includes(`key=${process.env.COOKIE_ACCESS_TOKEN}`);
};

export const withCookieAuthenticator = (event, context, callBack) => {
    if (!isAuthenticatedWithCookie(event.headers.Cookie)) 
        return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };    

    return callBack(event, context);
    
};

export default isAuthenticatedWithCookie;
