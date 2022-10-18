const {restrictEventByHttpMethod, throwError} = require("../../utils/function");
const {createNewGame} = require("../../utils/game");

const handler = async (event) => {
    try {
        restrictEventByHttpMethod(event, 'POST')

        const gameData = validateGameData(JSON.parse(event.body));
        const game = await createNewGame(gameData)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successfully created a new game',
                game: game
            }),
        }
    } catch (error) {
        return {
            statusCode: error.code ?? 500,
            body: error.message
        }
    }
}

const validateGameData = (gameData) => {
    const errors = {};

    if (!gameData.name) {
        errors['name'] = `Required`;
    }
    if (!gameData.ownerName) {
        errors['ownerName'] = `ownerName`;
    }

    if (Object.keys(errors).length > 0) {
        throwError(JSON.stringify({
            fieldErrors: errors
        }), '400')
    }
    return gameData;
}

module.exports = {handler}