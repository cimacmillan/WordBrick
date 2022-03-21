import { AppState, AppStateType, GameState, GameStateType, GameTiles, WaitingForPlacement } from "./State";
import { sampleLetter } from './constants/Scrabble';
import { GAME_HEIGHT, GAME_WIDTH } from "./Config";
import { getLineScore } from "./constants/WordAlgorithm";

interface LineScore {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    value: number;
}

function getRow(tiles: GameTiles, row: number) {
    const horizontal = [];
    for (let i = 0; i < GAME_WIDTH; i++) {
        horizontal.push(tiles[i][row]);
    }
    return horizontal;
}

function getScores(tiles: GameTiles): LineScore[] {
    const scores: LineScore[] = [];
    for (let x = 0; x < GAME_WIDTH; x++) {
        const vertical = tiles[x];
        const [vertScore, vertBegin, vertEnd, vertWord] = getLineScore(vertical);
        scores.push({
            x1: x,
            x2: x,
            y1: vertBegin, 
            y2: vertEnd,
            value: vertScore
        });
    }

    for (let y = 0; y < GAME_HEIGHT; y++) {
        const horizontal = getRow(tiles, y);
        const [horizontalScore, horzBegin, horzEnd, horzWord] = getLineScore(horizontal);
        scores.push({
            x1: horzBegin,
            x2: horzEnd,
            y1: y, 
            y2: y,
            value: horizontalScore
        });
    }
    return scores;
}

// Only for straight lines
function forLine(x1: number, x2: number, y1: number, y2: number, forEach: (x: number, y: number) => void) {
    if (x1 === x2) {
        for (let y = y1; y < y2; y++) {
            forEach(x1, y);
        }
    } else {
        for (let x = x1; x < x2; x++) {
            forEach(x, y1);
        }
    }
}

function new2DArray<T>(width: number, height: number, newValue: (x: number, y: number) => T): T[][] {
    const tiles= [];
    for (let x = 0; x < GAME_WIDTH; x++) {
        const row = [];
        for (let y = 0; y < GAME_HEIGHT; y++) {
            row[y] = newValue(x, y);
        }
        tiles.push(row);
    }
    return tiles;
}

export function getStartingState(width: number, height: number): AppState {
    const tiles = new2DArray(width, height, () => "");
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

    const newTiles = new2DArray(GAME_WIDTH, GAME_HEIGHT, (x, y) => tiles[x][y]);
    const newCorrect = new2DArray(GAME_WIDTH, GAME_HEIGHT, (x, y) => false);
    const scores = getScores(tiles);

    for (const score of scores) {
        const { x1, x2, y1, y2, value } = score;
        newScore += value;
        forLine(x1, x2, y1, y2, (x, y) => {
            newTiles[x][y] = undefined;
            newCorrect[x][y] = true;
        })
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
            newScore: newScore,
            correct: newCorrect,
            newLetter: sampleLetter()
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

