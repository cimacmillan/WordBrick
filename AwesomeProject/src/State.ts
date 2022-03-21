
export type GameTiles = (string | undefined)[][];

export enum GameStateType {
    WAITING_FOR_PLACEMENT,
    SHOWING_WORDS,
    DESTROYING_TILES,
    DROPPING_TILES,
    GAME_OVER
}

export interface WaitingForPlacement {
    type: GameStateType.WAITING_FOR_PLACEMENT;
    tiles: GameTiles;
    currentLetter: string;
    score: number;
    choiceCount: number;
}

export interface ShowingWords {
    type: GameStateType.SHOWING_WORDS;
    previousState: WaitingForPlacement;
    newScore: number;
    newTiles: GameTiles;
    correct: boolean[][];
}


export type GameState = WaitingForPlacement | ShowingWords;

export enum AppStateType {
    PLAYING
}

interface PlayingState {
    type: AppStateType.PLAYING;
    state: GameState;
}


export type AppState = PlayingState;




