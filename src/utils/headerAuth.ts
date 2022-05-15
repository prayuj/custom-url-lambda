const isAuthenticatedWithHeader = (key: string): boolean => {
    if (!key) return false;
    return key === process.env.COOKIE_ACCESS_TOKEN;
};

const withAuthenticator = async (request) => {
    if (!isAuthenticatedWithHeader(request.event?.headers?.key))
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
};

export default withAuthenticator;
