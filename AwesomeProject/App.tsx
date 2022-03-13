import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated } from 'react-native';
import { CharacterButton, CharacterDisplay } from './components/CharacterButton';
import { Grid } from './components/Grid';
import { sampleLetter } from './constants/Scrabble';
import { getLineScore } from './constants/WordAlgorithm';

const GAME_WIDTH = 4;
const GAME_HEIGHT = 4;


interface GameState {
    tiles: (string | undefined)[][];
    currentLetter: string;
    score: number;
}

const getStartingState = (width: number, height: number): GameState => {
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
        tiles,
        score: 0,
        currentLetter: sampleLetter(),
    }
}

const App = () => {
    const [gameState, setGameState] = React.useState(getStartingState(GAME_WIDTH, GAME_HEIGHT))
    const { tiles, score, currentLetter } = gameState;

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

        setGameState({
            tiles: newTiles,
            score: newScore,
            currentLetter: sampleLetter(),
        });
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
                tiles,
                currentLetter: sampleLetter(),
                score
            });
        }
    }

    return (
        <>
            <View style={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{marginBottom: 32, fontSize: 32}}>{score}</Text>
                <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={
                    (x: number, y: number) => <CharacterButton character={tiles[x][y]} onPress={() => onTilePress(x, y)}/>
                    }/>
                <View style={{ marginTop: 64 }}>
                    <CharacterDisplay character={currentLetter}/>
                </View>
            </View>
        </>
    );
}

export default App;