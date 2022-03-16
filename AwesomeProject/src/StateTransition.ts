import { AppState, AppStateType, GameState, GameStateType, WaitingForPlacement } from "./State";
import { sampleLetter } from './constants/Scrabble';
import { GAME_HEIGHT, GAME_WIDTH } from "./Config";
import { getLineScore } from "./constants/WordAlgorithm";

export function getStartingState(width: number, height: number): AppState {
    const tiles= [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            // row[x] = sampleLetter();
            row[x] = "";
        }
        tiles.push(row);
    }
    return {
        type: AppStateType.PLAYING,
        state: {
            type: GameStateType.WAITING_FOR_PLACEMENT,
            tiles,
            score: 0,
            currentLetter: sampleLetter(),
            choiceCount: 0
        }
    }
}

export function onTilesComplete(appState: WaitingForPlacement): GameState {
    const { tiles, currentLetter, choiceCount, score } = appState;
    let newScore = score;
    const newTiles = [];
    for (let x = 0; x < GAME_WIDTH; x++) {
        const row = [];
        for (let y = 0; y < GAME_HEIGHT; y++) {
            row[y] = tiles[x][y];
        }
        newTiles.push(row);
    }

    for (let x = 0; x < GAME_WIDTH; x++) {
        const vertical = tiles[x];
        const [vertScore, vertBegin, vertEnd, vertWord] = getLineScore(vertical);

        if (vertScore) {
            newScore += vertScore;
            for (let i = vertBegin; i < vertEnd; i++) {
                newTiles[x][i] = undefined;
            }
        }

    }

    for (let y = 0; y < GAME_HEIGHT; y++) {
        const horizontal = [];
        for (let i = 0; i < GAME_WIDTH; i++) {
            horizontal.push(tiles[i][y]);
        }
        const [horizontalScore, horzBegin, horzEnd, horzWord] = getLineScore(horizontal);
        if (horizontalScore) {
            newScore += horizontalScore;
            for (let i = horzBegin; i < horzEnd; i++) {
                newTiles[i][y] = undefined;
            }
        }

    }

    for (let i = 0; i < GAME_HEIGHT; i++) {
        for (let y = GAME_HEIGHT-2; y >= 0; y--) {
            for (let x = 0; x < GAME_WIDTH; x++) {
                const upperTile = newTiles[x][y];
                const lowerTime = newTiles[x][y + 1];
                if ((lowerTime === undefined) && upperTile) {
                    newTiles[x][y + 1] = newTiles[x][y];
                    newTiles[x][y] = undefined;
                }
            }
        }
    }

    if (score === newScore) {
        return getStartingState(GAME_WIDTH, GAME_HEIGHT).state;
    } else {
        return {
                type: GameStateType.SHOWING_WORDS,
                previousState: appState,
                newTiles: newTiles,
                newScore: newScore
        };
    }
}

export function onTilePressed(appState: WaitingForPlacement, x: number, y: number): GameState {
    const { tiles, currentLetter, choiceCount, score } = appState;
    if (tiles[x][y]) {
        return appState;
    }

    tiles[x][y] = currentLetter;

    let isTileMissing = false;
    for (let x of tiles) {
        for (let tile of x) {
            isTileMissing = isTileMissing || (!tile)
        } 
    }

    if (!isTileMissing) {
        return onTilesComplete(appState);
    } else {
        return {
            type: GameStateType.WAITING_FOR_PLACEMENT,
            choiceCount: choiceCount + 1,
            tiles,
            currentLetter: sampleLetter(),
            score
        };
    }
}

