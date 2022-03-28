import { AppState, AppStateType, FallingTile, FallingTiles, FallingTilesState, GameState, GameStateType, GameTiles, WaitingForPlacement } from "./State";
import { sampleLetter } from './constants/Scrabble';
import { GAME_HEIGHT, GAME_WIDTH } from "./Config";
import { getLineScore } from "./constants/WordAlgorithm";
import { setSave } from "./Util";

export interface LineScore {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    value: number;
    word: string;
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
        if (vertScore === 0) {
            continue;
        }
        scores.push({
            x1: x,
            x2: x,
            y1: vertBegin, 
            y2: vertEnd,
            value: vertScore,
            word: vertWord
        });
    }

    for (let y = 0; y < GAME_HEIGHT; y++) {
        const horizontal = getRow(tiles, y);
        const [horizontalScore, horzBegin, horzEnd, horzWord] = getLineScore(horizontal);
        if (horizontalScore === 0) {
            continue;
        }
        scores.push({
            x1: horzBegin,
            x2: horzEnd,
            y1: y, 
            y2: y,
            value: horizontalScore,
            word: horzWord
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

function forEach2DArray(width: number, height: number, forEach: (x: number, y: number) => any) {
    for (let x = 0; x < GAME_WIDTH; x++) {
        for (let y = 0; y < GAME_HEIGHT; y++) {
            forEach(x, y);
        }
    }
}

function map2DArray<A, B>(array: A[][], width: number, height: number, map: (value: A, x: number, y: number) => B): B[][] {
    const newArray: (B | undefined)[][] = new2DArray(width, height, () => undefined);
    for (let x = 0; x < GAME_WIDTH; x++) {
        for (let y = 0; y < GAME_HEIGHT; y++) {
            newArray[x][y] = map(array[x][y], x, y);
        }
    }
    return newArray as B[][];
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

export function getStartingState(width: number, height: number, bestScore: number): WaitingForPlacement {
    const tiles = new2DArray(width, height, () => "");
    return {
        type: GameStateType.WAITING_FOR_PLACEMENT,
        tiles,
        score: 0,
        currentLetter: sampleLetter(),
        choiceCount: 0,
        bestScore,
        scores: []
    }
}

export function canTilesFall(tiles: GameTiles): boolean {
    let canFall = false;
    forEach2DArray(GAME_WIDTH, GAME_HEIGHT, (x, y) => {
        if (y < GAME_HEIGHT - 1) {
            if (tiles[x][y] && !tiles[x][y + 1]) {
                canFall = true;
            }
        }
    });
    return canFall;
}

export function getDropLine(tiles: FallingTiles, x: number, y: number): number {
    let drop = 0;
    for(let yDiff = 1; yDiff < GAME_HEIGHT; yDiff++) {
        if (y + yDiff >= GAME_HEIGHT) {
            return drop;
        }
        if (tiles[x][y + yDiff].character) {
            break;
        }
        drop++;
    }
    return drop;
}

export function getFallingTiles(tiles: GameTiles): FallingTiles {
    const newTiles: (FallingTile)[][] = new2DArray(GAME_WIDTH, GAME_HEIGHT, (x, y) => ({ character: tiles[x][y], height: 0 }))
    for (let x = 0; x < GAME_WIDTH; x++) {
        for (let y = GAME_HEIGHT - 1; y >= 0; y--) {
            if (y === GAME_HEIGHT - 1) {
                newTiles[x][y] = {
                    character: tiles[x][y],
                    height: 0
                };
                continue;
            }

            const dropLine = getDropLine(newTiles, x, y);
            if (dropLine) {
                newTiles[x][y + dropLine] = {
                    character: newTiles[x][y].character,
                    height: dropLine
                }
                newTiles[x][y] = {
                    character: undefined,
                    height: 0
                };
            }
        }
    }
    return newTiles as FallingTiles;
}

export function onTilesComplete(appState: WaitingForPlacement, hasFallen: boolean): GameState {
    const { tiles, currentLetter, choiceCount, score, bestScore } = appState;
    let newScore = score;

    const newTiles = new2DArray(GAME_WIDTH, GAME_HEIGHT, (x, y) => tiles[x][y]);
    const newCorrect = new2DArray(GAME_WIDTH, GAME_HEIGHT, (x, y) => false);
    const scores = getScores(tiles);

    for (const score of scores) {
        const { x1, x2, y1, y2, value } = score;
        const newValue =  hasFallen ? value * value : value;
        newScore += newValue;
        score.value = newValue;
        forLine(x1, x2, y1, y2, (x, y) => {
            newTiles[x][y] = undefined;
            newCorrect[x][y] = true;
        })
    }

    const newGameState: WaitingForPlacement | FallingTilesState = hasFallen ? {
        type: GameStateType.WAITING_FOR_PLACEMENT,
        tiles: new2DArray(GAME_WIDTH, GAME_HEIGHT, () => undefined),
        choiceCount: choiceCount + 1,
        currentLetter: sampleLetter(),
        score: newScore,
        bestScore,
        scores: [...appState.scores, ...scores]
    } : (canTilesFall(newTiles) ?  {
        type: GameStateType.DROPPING_TILES,
        tiles: getFallingTiles(newTiles),
        choiceCount: choiceCount + 1,
        currentLetter: sampleLetter(),
        score: newScore,
        bestScore,
        scores: [...appState.scores, ...scores]
    } : {
        type: GameStateType.WAITING_FOR_PLACEMENT,
        tiles: newTiles,
        choiceCount: choiceCount + 1,
        currentLetter: sampleLetter(),
        score: newScore,
        bestScore,
        scores: [...appState.scores, ...scores]
    });

    if (score === newScore) {
        const newBestScore = score > bestScore ? score : bestScore;
        const lastPlayedDate = new Date();
        setSave({
            bestScore: newBestScore,
            lastPlayed: (lastPlayedDate).toString()
        });
        return {
            type: GameStateType.SHOWING_WORDS,
            previousState: appState,
            newState: {
                type: GameStateType.WAITING_FOR_PLAY,
                currentLetter: sampleLetter(),
                scores: [],
                lastPlayed: lastPlayedDate,
                bestScore: newBestScore,
                choiceCount: 0,
                score: 0
            },
            correct: newCorrect,
            bestScore: newBestScore,
            hasFallen: false,
            scores: [...appState.scores, ...scores]
        }
    } else {
        return {
            type: GameStateType.SHOWING_WORDS,
            previousState: appState,
            newState: newGameState,
            correct: newCorrect,
            bestScore,
            hasFallen,
            scores: [...appState.scores, ...scores]
        };
    }
}

export function onTilePressed(appState: WaitingForPlacement, x: number, y: number): GameState {
    const { tiles, currentLetter, choiceCount, score, bestScore, scores } = appState;
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
        return onTilesComplete(appState, false);
    } else {
        return {
            type: GameStateType.WAITING_FOR_PLACEMENT,
            choiceCount: choiceCount + 1,
            tiles,
            currentLetter: sampleLetter(),
            score,
            lastPlaced: [x, y],
            bestScore,
            scores
        };
    }
}

export function onTilesFell(appState: FallingTilesState): GameState {
    const { tiles, currentLetter, choiceCount, score, bestScore} = appState;
    const gameTiles: GameTiles = map2DArray(tiles, GAME_WIDTH, GAME_HEIGHT, (tile) => tile.character)
    const scores = getScores(gameTiles).reduce((prev, val) => prev + val.value, 0);

    if (scores > 0) {
        return onTilesComplete({
            type: GameStateType.WAITING_FOR_PLACEMENT,
            tiles: gameTiles,
            currentLetter,
            choiceCount, 
            score,
            bestScore,
            scores: appState.scores
        }, true);
    }

    return {
        type: GameStateType.WAITING_FOR_PLACEMENT,
        tiles: gameTiles,
        currentLetter,
        choiceCount, 
        score,
        bestScore,
        scores: appState.scores
    };
}

