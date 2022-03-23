
export type GameTiles = (string | undefined)[][];

export interface FallingTile {
    character?: string;
    height: number;
}

export type FallingTiles = FallingTile[][];

export enum GameStateType {
    WAITING_FOR_PLACEMENT,
    SHOWING_WORDS,
    DESTROYING_TILES,
    DROPPING_TILES,
    GAME_OVER
}

export interface FallingTilesState {
    type: GameStateType.DROPPING_TILES;
    tiles: FallingTiles;
}

export interface WaitingForPlacement {
    type: GameStateType.WAITING_FOR_PLACEMENT;
    tiles: GameTiles;
    currentLetter: string;
    score: number;
    choiceCount: number;
    lastPlaced?: [x: number, y: number]
}

export interface ShowingWords {
    type: GameStateType.SHOWING_WORDS;
    previousState: GameState;
    correct: boolean[][];
    newState: WaitingForPlacement | FallingTilesState;
}


export type GameState = WaitingForPlacement | ShowingWords | FallingTilesState;

export enum AppStateType {
    PLAYING
}

interface PlayingState {
    type: AppStateType.PLAYING;
    state: GameState;
}


export type AppState = PlayingState;




