import { AppState, AppStateType, GameStateType } from "./State";
import { sampleLetter } from './constants/Scrabble';

export const getStartingState = (width: number, height: number): AppState => {
    const tiles = [];
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

