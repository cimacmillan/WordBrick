import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated, TextComponent } from 'react-native';
import { Grid } from './src/components/Grid';
import { sampleLetter } from './src/constants/Scrabble';
import { getLineScore } from './src/constants/WordAlgorithm';
import { GAME_WIDTH, GAME_HEIGHT, GAME_WORD_SHOW_TIME } from "./src/Config";
import { getStartingState, onTilePressed } from './src/StateTransition';
import { AppState, AppStateType, GameState, GameStateType, ShowingWords, WaitingForPlacement } from './src/State';
import { UnplacedButton } from './src/components/UnplacedButton';
import { CharacterDisplay } from './src/components/CharacterDisplay';
import { Character } from './src/components/Character';
import { CharacterPlaced } from './src/components/CharacterPlaced';
import { CharacterResult } from './src/components/CharacterResult';

const styles = {
    container: {
        flexGrow: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#000000"
    },
    scoreText: {
        marginBottom: 32, 
        fontSize: 32,
        color: "#FFFFFF"
    },
    characterDisplay: {
        marginTop: 64 
    }
} as any;

const App = () => {
    const [appState, setAppState] = React.useState<AppState>({
        type: AppStateType.PLAYING,
        state: getStartingState(GAME_WIDTH, GAME_HEIGHT)
    });
    const setGameState = (state: GameState) => {
        setAppState({
            type: AppStateType.PLAYING,
            state
        })
    }
    switch(appState.state.type) {
        case GameStateType.WAITING_FOR_PLACEMENT:
            return <WaitingForPlacementComponent setGameState={setGameState} state={appState.state}/>
        case GameStateType.SHOWING_WORDS:
            return <ShowingTilesComponent setGameState={setGameState} state={appState.state}/>
        case GameStateType.DROPPING_TILES:
            return <Text>Hello World</Text>
    }
}

interface WaitingForPlacementProps {
    setGameState: (state: GameState) => void;
    state: WaitingForPlacement
}

const WaitingForPlacementComponent: React.FunctionComponent<WaitingForPlacementProps> = ({ setGameState, state }) => {
    const { tiles, score, currentLetter, choiceCount, lastPlaced} = state;

    const onTilePress = (x: number, y: number) => {
        setGameState(onTilePressed(state, x, y))
    }

    const [lastX, lastY] = lastPlaced || [-1, -1];

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.scoreText}>{score}</Text>
                <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={
                    (x: number, y: number) => {
                        const wasLastPlaced = x === lastX && y === lastY;
                        const isPlaced = !!tiles[x][y];
                        if (isPlaced) {
                            return wasLastPlaced ? <CharacterPlaced character={tiles[x][y]}/> : <Character character={tiles[x][y]}/>
                        } else {
                            return <UnplacedButton onPress={() => onTilePress(x, y)}/>
                        }
                    }
                    }/>
                <View style={styles.characterDisplay}>
                    <CharacterDisplay character={currentLetter} choiceCount={choiceCount}/>
                </View>
            </View>
        </>
    );
}

interface ShowingTilesProps {
    setGameState: (state: GameState) => void;
    state: ShowingWords
}

const ShowingTilesComponent: React.FunctionComponent<ShowingTilesProps> = ({ setGameState, state }) => {
    const { previousState, correct, newState } = state;
    const { currentLetter, choiceCount, tiles, score } = previousState as WaitingForPlacement;
    const newScore = (newState as WaitingForPlacement).score;
    React.useEffect(() => {
        setTimeout(() => {
            setGameState(newState)
        }, GAME_WORD_SHOW_TIME);
    }, []);

    return <>
        <View style={styles.container}>
        <Text style={styles.scoreText}>{score} + {newScore}</Text>
        <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={
            (x: number, y: number) => tiles[x][y] ? <CharacterResult character={tiles[x][y]} showingCorrect={correct[x][y]}/> : <UnplacedButton onPress={() => undefined}/>
            }/>
        <View style={styles.characterDisplay}>
            <CharacterDisplay character={currentLetter} choiceCount={choiceCount}/>
        </View>
    </View>
</>
}

export default App;