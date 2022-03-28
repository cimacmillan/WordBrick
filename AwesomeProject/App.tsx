import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated, TextComponent, ViewStyle, Dimensions, TextStyle } from 'react-native';
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
import { getSave } from './src/Util';
import GameComponent from './src/GameComponent';
import { PreviousWords } from './src/PreviousWords';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = {
    container: {
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "#000000"
    } as ViewStyle
};

const App = () => {
    const [appState, setAppState] = React.useState<AppState>({
        type: AppStateType.LOADING
    });

    const [previousWordsModalShowing, setPreviousWordsModalShowing] = React.useState(false);

    React.useEffect(() => {
        getSave().then(({ bestScore, lastPlayed }) => {
            const lastPlayedDate = new Date(lastPlayed);
            const now = new Date();
            
            console.log(now.toDateString(), lastPlayedDate.toDateString())
            if (now.toDateString() === lastPlayedDate.toDateString()) {
                setAppState({
                    type: AppStateType.PLAYING,
                    state: {
                        type: GameStateType.WAITING_FOR_PLAY,
                        scores: [],
                        bestScore,
                        lastPlayed: lastPlayedDate,
                        currentLetter: sampleLetter(),
                        choiceCount: 0,
                        score: 0
                    },
                    loadedBestScore: bestScore
                })
            } else {
                setAppState({
                    type: AppStateType.PLAYING,
                    state: getStartingState(GAME_WIDTH, GAME_HEIGHT, bestScore),
                    loadedBestScore: bestScore
                })
            }
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
        setPreviousWordsModalShowing(true);
    }

    if (appState.type === AppStateType.LOADING) {
        return <View style={styles.container}/>;
    }

    return <View>
            <GameComponent setGameState={setGameState} gameState={appState.state} onScorePressed={onScorePressed}/>
            {previousWordsModalShowing ? <PreviousWords scores={appState.state.scores} onPress={() => setPreviousWordsModalShowing(false)}/> : undefined}
    </View>
}

export default App;