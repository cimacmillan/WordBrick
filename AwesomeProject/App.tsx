import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated } from 'react-native';
import { CharacterButton } from './src/components/CharacterButton';
import { Grid } from './src/components/Grid';
import { sampleLetter } from './src/constants/Scrabble';
import { getLineScore } from './src/constants/WordAlgorithm';
import { GAME_WIDTH, GAME_HEIGHT } from "./src/Config";
import { getStartingState } from './src/StateTransition';
import { AppState, AppStateType, GameStateType } from './src/State';
import { UnplacedButton } from './src/components/UnplacedButton';
import { CharacterDisplay } from './src/components/CharacterDisplay';

const App = () => {
    const [gameState, setGameState] = React.useState<AppState>(getStartingState(GAME_WIDTH, GAME_HEIGHT));
    const { type, state } = gameState;
    const { tiles, score, currentLetter, choiceCount } = state;

    const onTilesComplete = () => {

        let newScore = score;
        const newTiles = [];
        for (let x = 0; x < GAME_WIDTH; x++) {
            const row = [];
            for (let y = 0; y < GAME_HEIGHT; y++) {
                // row[x] = sampleLetter();
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
            setGameState(getStartingState(GAME_WIDTH, GAME_HEIGHT));
        } else {
            setGameState({
                type: AppStateType.PLAYING,
                state: {
                    type: GameStateType.WAITING_FOR_PLACEMENT,
                    choiceCount: choiceCount + 1,
                    tiles: newTiles,
                    score: newScore,
                    currentLetter: sampleLetter(),
                }
            });
        }
    }

    const onTilePress = (x: number, y: number) => {
        if (tiles[x][y]) {
            return;
        }

        tiles[x][y] = currentLetter;

        let isTileMissing = false;
        for (let x of tiles) {
            for (let tile of x) {
                isTileMissing = isTileMissing || (!tile)
            } 
        }

        if (!isTileMissing) {
            onTilesComplete();
        } else {
            setGameState({
                type: AppStateType.PLAYING,
                state: {
                    type: GameStateType.WAITING_FOR_PLACEMENT,
                    choiceCount: choiceCount + 1,
                    tiles,
                    currentLetter: sampleLetter(),
                    score
                    
                }
            });
        }
    }

    return (
        <>
            <View style={{
                flexGrow: 1, 
                justifyContent: "center", 
                alignItems: "center",
                backgroundColor: "#000000"
                }}>
                <Text style={{
                    marginBottom: 32, 
                    fontSize: 32,
                    color: "#FFFFFF"
                    }}>{score}</Text>
                <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={
                    (x: number, y: number) => tiles[x][y] ? <CharacterButton character={tiles[x][y]} onPress={() => onTilePress(x, y)}/> : <UnplacedButton onPress={() => onTilePress(x, y)}/>
                    }/>
                <View style={{ marginTop: 64 }}>
                    <CharacterDisplay character={currentLetter} choiceCount={choiceCount}/>
                </View>
            </View>
        </>
    );
}

export default App;