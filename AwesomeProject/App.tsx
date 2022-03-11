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
    lastWord: [string, number];
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
        lastWord: ["", 0]
    }
}

const App = () => {
    const [gameState, setGameState] = React.useState(getStartingState(GAME_WIDTH, GAME_HEIGHT))
    const { tiles, score, currentLetter, lastWord } = gameState;

    const onTilePress = (x: number, y: number) => {
        if (tiles[x][y]) {
            return;
        }

        tiles[x][y] = currentLetter;

        const vertical = tiles[x];
        const horizontal = [];

        for (let i = 0; i < GAME_WIDTH; i++) {
            horizontal.push(tiles[i][y]);
        }
        
        const [vertScore, vertBegin, vertEnd, vertWord] = getLineScore(vertical);
        const [horizontalScore, horzBegin, horzEnd, horzWord] = getLineScore(horizontal);
        let newScore = score;

        if (vertScore) {
            newScore += vertScore;
            for (let i = vertBegin; i < vertEnd; i++) {
                tiles[x][i] = undefined;
            }
        }

        if (horizontalScore) {
            newScore += horizontalScore;
            for (let i = horzBegin; i < horzEnd; i++) {
                tiles[i][y] = undefined;
            }
        }

        let newLastWord = lastWord;
        if (vertWord) {
            newLastWord = [vertWord, vertScore];
        }
        if (horzWord) {
            newLastWord = [horzWord, horizontalScore];
        }

        setGameState({
            tiles,
            score: newScore,
            currentLetter: sampleLetter(),
            lastWord: newLastWord
        });
    }

    return (
        <>
            <View style={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{marginBottom: 32, fontSize: 32}}>{score}</Text>
                { lastWord && (<Text>{lastWord[0]} +{lastWord[1]}</Text>)}
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