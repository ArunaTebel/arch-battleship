const {restrictEventByHttpMethod, throwError} = require("../../utils/function");
const {placeTowerOnBoard} = require("../../utils/game");

const handler = async (event) => {
    try {
        restrictEventByHttpMethod(event, 'PATCH')

        const towerPlacementData = validateTowerPlacementData(JSON.parse(event.body));
        await placeTowerOnBoard(towerPlacementData)
        return {
            statusCode: 200,
            body: JSON.stringify(towerPlacementData),
        }
    } catch (error) {
        return {
            statusCode: error.code ?? 500,
            body: error.message
        }
    }
}

const validateTowerPlacementData = (towerPlacementData) => {
    const errors = {};
    const validTowerTypes = [1, 2, 3, 4]

    if (!towerPlacementData.gameId) {
        errors['gameId'] = `Required`;
    }
    if (!towerPlacementData.playerId) {
        errors['playerId'] = `Required`;
    }
    if (!towerPlacementData.cellIdx) {
        errors['cellIdx'] = `Required`;
    }
    if (!towerPlacementData.towerType) {
        errors['towerType'] = `Required`;
    } else if (validTowerTypes.indexOf(parseInt(towerPlacementData.towerType, 10)) === -1) {
        errors['towerType'] = `Invalid 'towerType'. Accepted values are [1, 2, 3]`;
    }

    if (Object.keys(errors).length > 0) {
        throwError(JSON.stringify({
            fieldErrors: errors
        }), '400')
    }
    return towerPlacementData;
}

module.exports = {handler}