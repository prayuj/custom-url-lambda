module.exports.mapUrl = async (event) => {
    const url = event.pathParameters?.url || '';

    if (!url) return { statusCode: 400, body: 'No URL provided' };
    
    return {
        statusCode: 200,
        body: JSON.stringify({url}),
    }
}