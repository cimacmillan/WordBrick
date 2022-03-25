import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated, TextComponent, ViewStyle, Dimensions } from 'react-native';
import { Grid } from './src/components/Grid';
import { sampleLetter } from './src/constants/Scrabble';
import { getLineScore } from './src/constants/WordAlgorithm';
import { GAME_WIDTH, GAME_HEIGHT, GAME_WORD_SHOW_TIME } from "./src/Config";
import { getStartingState, onTilePressed, onTilesFell } from './src/StateTransition';
import { AppState, AppStateType, FallingTilesState, GameState, GameStateType, PlayingState, ShowingWords, WaitingForPlacement } from './src/State';
import { UnplacedButton } from './src/components/UnplacedButton';
import { CharacterDisplay } from './src/components/CharacterDisplay';
import { Character } from './src/components/Character';
import { CharacterPlaced } from './src/components/CharacterPlaced';
import { CharacterResult, CharacterResultEnum } from './src/components/CharacterResult';
import { CharacterFalling, FALL_SPEED } from './src/components/CharacterFalling';
import { ScoreComponent } from './src/components/ScoreComponent';
import { getBestScore } from './src/Util';
import GameComponent from './src/GameComponent';

const styles = {
    container: {
        flexGrow: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#000000"
    } as ViewStyle,
    characterDisplay: {
        marginTop: 64 
    }
};

const App = () => {
    const [appState, setAppState] = React.useState<AppState>({
        type: AppStateType.LOADING
    });

    React.useEffect(() => {
        getBestScore().then((score) => {
            setAppState({
                type: AppStateType.PLAYING,
                state: getStartingState(GAME_WIDTH, GAME_HEIGHT, score),
                loadedBestScore: score
            })
        });
    }, [])

    const setGameState = (state: GameState) => {
        setAppState({
            type: AppStateType.PLAYING,
            state,
            loadedBestScore: (appState as PlayingState).loadedBestScore
        })
    }

    const onScorePressed = () => {
        console.log("On previous words")
        setAppState({
            type: AppStateType.SHOW_PREVIOUS_WORDS,
            state: (appState as PlayingState).state,
            loadedBestScore: (appState as PlayingState).loadedBestScore
        })
    }


    if (appState.type === AppStateType.LOADING) {
        return <View/>;
    }



    return <View style={{
        flexDirection: "row",
    }}>
        <GameComponent setGameState={setGameState} gameState={appState.state} onScorePressed={onScorePressed}/>
        {/* <GameComponent setGameState={setGameState} gameState={appState.state} onScorePressed={onScorePressed}/> */}
    </View>
}

export default App;