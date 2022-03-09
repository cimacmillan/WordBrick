import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated } from 'react-native';
import { CharacterButton } from './components/CharacterButton';
import { Grid } from './components/Grid';
import { sampleLetter } from './constants/Scrabble';

const GAME_WIDTH = 5;
const GAME_HEIGHT = 5;


interface GameState {
    tiles: (string | undefined)[][]

}

const getStartingState = (width: number, height: number): GameState => {
    const tiles = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row[x] = sampleLetter();
        }
        tiles.push(row);
    }
    return {
        tiles
    }
}

const App = () => {
    const [gameState, setGameState] = React.useState(getStartingState(GAME_WIDTH, GAME_HEIGHT))

    return (
        <>
            <View style={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
                <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={(x: number, y: number) => <CharacterButton character={gameState.tiles[x][y]}/>}/>
            </View>
        </>
    );
}

export default App;