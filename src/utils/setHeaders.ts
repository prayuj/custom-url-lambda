import { ALLOWED_ORIGINS } from "./const";

const setAuthResponseHeaders = response => {
    const { Origin } = response.event.headers;
    if (ALLOWED_ORIGINS.includes(Origin)) {
        response.response.headers = {
            'Access-Control-Allow-Origin': Origin,
            'Access-Control-Allow-Credentials': true,
        };
    } else {
        response.response.headers = {
            'Access-Control-Allow-Origin': '*',
        };
    }
}

export default setAuthResponseHeaders;