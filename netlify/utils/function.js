const restrictEventByHttpMethod = (event, acceptedMethod) => {
    if (event.httpMethod !== acceptedMethod) {
        const error = new Error(`Only '${acceptedMethod}' request method is allowed`);
        error.code = '400'
        throw error;
    }
}

const throwError = (message, code) => {
    const error = new Error(message);
    error.code = code
    throw error;
}

module.exports = {
    restrictEventByHttpMethod,
    throwError
}