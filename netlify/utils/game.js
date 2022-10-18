const fb = require("../../firebase");
const {throwError} = require("./function");

const getAllGames = async () => {
    try {
        const snapshot = await fb.db
            .collection('games')
            .get();
        const games = [];
        snapshot.forEach((game) => {
            games.push({...game.data(), id: game.id})
        });
        return games;
    } catch (e) {
        throw e
    }
}

const validateGameExists = async (gameId) => {
    const game = await fb.db.doc(`games/${gameId}`).get();
    if (!game.exists) {
        throwError(`A game with the id '${gameId}' does not exist`, '404')
    }
    return game
}

const getGameById = async (gameId) => {
    try {
        return validateGameExists(gameId)
    } catch (e) {
        throw e
    }
}

const createNewGame = async (gameData) => {
    try {
        let game = await fb.db
            .collection('games')
            .add({
                name: gameData.name
            });
        const ownerId = await utils.addPlayersToNewGame(game.id, gameData.ownerName)
        await fb.db
            .collection('games')
            .doc(game.id)
            .set({ownerId}, {merge: true});
        return {...(await game.get()).data(), id: game.id}
    } catch (e) {
        throw e
    }
}

const getPlayerDataForGame = async (gameId, playerId) => {
    return await fb.db
        .collection('games')
        .doc(gameId)
        .collection('players')
        .doc(playerId).get();
}

const placeTowerOnBoard = async (towerPlacementData) => {
    const gameId = towerPlacementData.gameId;
    const playerId = towerPlacementData.playerId;
    const cellIdx = towerPlacementData.cellIdx;
    const towerType = towerPlacementData.towerType;

    await utils.validateGameForTowerPlacement(gameId)

    const opponentId = await utils.getOpponentIdForPlayer(gameId, playerId)
    const opponentData = getPlayerDataForGame(gameId, opponentId).data()

    await utils.validateTowerBalance(opponentData, towerType)
    await utils.validateCellForTowerPlacement(opponentData, cellIdx)

}

const utils = {
    addPlayersToNewGame: async (gameId, ownerName) => {
        const playerTemplate = {
            name: '',
            towers: [],
            missiles: []
        }
        const player1Ref = await fb.db
            .collection(`games/${gameId}/players`)
            .add({...playerTemplate, name: ownerName})
        await fb.db
            .collection(`games/${gameId}/players`)
            .add(playerTemplate)
        return player1Ref.id
    },
    getOpponentIdForPlayer: async (gameId, playerId) => {
        let opponentId;
        const playersRef = await fb.db
            .collection('games')
            .doc(gameId)
            .collection('players')
            .get();
        playersRef.forEach(player => {
            if (player.id !== playerId) {
                opponentId = player.id
            }
        })
        return opponentId;
    },
    validateGameForTowerPlacement: async (gameId) => {
        await validateGameExists(gameId)
    },
    validateTowerBalance(opponentData, towerType) {

    },
    validateCellForTowerPlacement(opponentData, cellIdx) {

    }
}

const settings = {
    TOWERS_PER_PLAYER: {
        1: 6,
        2: 4,
        3: 3,
        4: 2,
        5: 1,
    }
}

module.exports = {
    getAllGames,
    getGameById,
    createNewGame,
    placeTowerOnBoard
}