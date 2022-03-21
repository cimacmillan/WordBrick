import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated } from 'react-native';
import { CharacterButton } from './src/components/CharacterButton';
import { Grid } from './src/components/Grid';
import { sampleLetter } from './src/constants/Scrabble';
import { getLineScore } from './src/constants/WordAlgorithm';
import { GAME_WIDTH, GAME_HEIGHT, GAME_WORD_SHOW_TIME } from "./src/Config";
import { getStartingState, onTilePressed } from './src/StateTransition';
import { AppState, AppStateType, GameState, GameStateType, ShowingWords, WaitingForPlacement } from './src/State';
import { UnplacedButton } from './src/components/UnplacedButton';
import { CharacterDisplay } from './src/components/CharacterDisplay';

const App = () => {
    const [appState, setAppState] = React.useState<AppState>(getStartingState(GAME_WIDTH, GAME_HEIGHT));
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
    }
}

interface WaitingForPlacementProps {
    setGameState: (state: GameState) => void;
    state: WaitingForPlacement
}

const WaitingForPlacementComponent: React.FunctionComponent<WaitingForPlacementProps> = ({ setGameState, state }) => {
    const { tiles, score, currentLetter, choiceCount } = state;

    const onTilePress = (x: number, y: number) => {
        setGameState(onTilePressed(state, x, y))
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
                    (x: number, y: number) => tiles[x][y] ? <CharacterButton character={tiles[x][y]} /> : <UnplacedButton onPress={() => onTilePress(x, y)}/>
                    }/>
                <View style={{ marginTop: 64 }}>
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
    const { newScore, newTiles, previousState, correct, newLetter } = state;
    const { currentLetter, choiceCount, tiles } = previousState;
    React.useEffect(() => {
        setTimeout(() => {
            setGameState({
                type: GameStateType.WAITING_FOR_PLACEMENT,
                tiles: newTiles,
                currentLetter: newLetter,
                choiceCount: choiceCount+1,
                score: newScore
            })
        }, GAME_WORD_SHOW_TIME);
    }, []);

    return <>
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
            }}>{newScore}</Text>
        <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={
            (x: number, y: number) => tiles[x][y] ? <CharacterButton character={tiles[x][y]} showingCorrect={correct[x][y]}/> : <UnplacedButton onPress={() => undefined}/>
            }/>
        <View style={{ marginTop: 64 }}>
            <CharacterDisplay character={currentLetter} choiceCount={choiceCount}/>
        </View>
    </View>
</>
}

export default App;