
export type GameTiles = (string | undefined)[][];

export interface FallingTile {
    character?: string;
    height: number;
}

export type FallingTiles = FallingTile[][];

export enum GameStateType {
    WAITING_FOR_PLACEMENT = "WAITING_FOR_PLACEMENT",
    SHOWING_WORDS = "SHOWING_WORDS",
    DESTROYING_TILES = "DESTROYING_TILES",
    DROPPING_TILES = "DROPPING_TILES",
    GAME_OVER = "GAME_OVER"
}

export interface FallingTilesState {
    type: GameStateType.DROPPING_TILES;
    tiles: FallingTiles;
    currentLetter: string;
    choiceCount: number;
    score: number;
    bestScore: number;
}

export interface WaitingForPlacement {
    type: GameStateType.WAITING_FOR_PLACEMENT;
    tiles: GameTiles;
    currentLetter: string;
    score: number;
    choiceCount: number;
    lastPlaced?: [x: number, y: number];
    bestScore: number;
}

export interface ShowingWords {
    type: GameStateType.SHOWING_WORDS;
    previousState: GameState;
    correct: boolean[][];
    newState: WaitingForPlacement | FallingTilesState;
    bestScore: number;
    hasFallen: boolean;
}


export type GameState = WaitingForPlacement | ShowingWords | FallingTilesState;

export enum AppStateType {
    PLAYING,
    LOADING
}

export interface PlayingState {
    type: AppStateType.PLAYING;
    state: GameState;
    loadedBestScore: number;
}

interface LoadingState {
    type: AppStateType.LOADING;
}


export type AppState = PlayingState | LoadingState;




