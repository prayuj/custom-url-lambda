interface mapUrlSchema {
    pathParameters: {
        url: string;
    }
}

interface mapUrlResponseSchema {
    statusCode: 200 | 400 | 404;
    body: string;
}

module.exports.mapUrl = async (event: mapUrlSchema):Promise<mapUrlResponseSchema> => {
    const url = event.pathParameters?.url || '';

    if (!url) return { statusCode: 400, body: JSON.stringify({message: 'No URL provided'}) };

    return {
        statusCode: 200,
        body: JSON.stringify({ url }),
    }
}