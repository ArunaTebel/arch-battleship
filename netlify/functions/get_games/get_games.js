const {restrictEventByHttpMethod} = require("../../utils/function");
const {getAllGames} = require("../../utils/game");

const handler = async (event) => {
    try {
        restrictEventByHttpMethod(event, 'GET')
        return {
            statusCode: 200,
            body: JSON.stringify(await getAllGames()),
        }
    } catch (error) {
        return {statusCode: 500, body: error.toString()}
    }
}

module.exports = {handler}