const {restrictEventByHttpMethod, throwError} = require("../../utils/function");

const handler = async (event) => {
    try {
        restrictEventByHttpMethod(event, 'PATCH')

        const moveData = validateMoveData(JSON.parse(event.body));
        return {
            statusCode: 200,
            body: JSON.stringify(moveData),
        }
    } catch (error) {
        return {
            statusCode: error.code ?? 500,
            body: error.message
        }
    }
}

const validateMoveData = (moveData) => {
    const errors = {};

    if (!moveData.gameId) {
        errors['gameId'] = `Required`;
    }
    if (!moveData.playerId) {
        errors['playerId'] = `Required`;
    }

    if (Object.keys(errors).length > 0) {
        throwError(JSON.stringify({
            fieldErrors: errors
        }), '400')
    }
    return moveData;
}

module.exports = {handler}