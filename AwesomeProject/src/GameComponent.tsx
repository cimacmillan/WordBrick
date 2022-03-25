import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated, TextComponent, ViewStyle, Dimensions } from 'react-native';
import { Grid } from './components/Grid';
import { GAME_WIDTH, GAME_HEIGHT, GAME_WORD_SHOW_TIME } from "./Config";
import { getStartingState, onTilePressed, onTilesFell } from './StateTransition';
import { AppState, AppStateType, FallingTilesState, GameState, GameStateType, PlayingState, ShowingWords, WaitingForPlacement } from './State';
import { UnplacedButton } from './components/UnplacedButton';
import { CharacterDisplay } from './components/CharacterDisplay';
import { Character } from './components/Character';
import { CharacterPlaced } from './components/CharacterPlaced';
import { CharacterResult, CharacterResultEnum } from './components/CharacterResult';
import { CharacterFalling, FALL_SPEED } from './components/CharacterFalling';
import { ScoreComponent } from './components/ScoreComponent';
import { getBestScore } from './Util';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = {
    container: {
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#000000",
        width: windowWidth,
        height: windowHeight
    } as ViewStyle,
    characterDisplay: {
        marginTop: 64 
    }
};

interface GameComponentProps {
    setGameState: (gameState: GameState) => void
    gameState: GameState;
    onScorePressed: () => void;
}

export const GameComponent: React.FunctionComponent<GameComponentProps> = ({ gameState, setGameState, onScorePressed }) => {
    switch(gameState.type) {
        case GameStateType.WAITING_FOR_PLACEMENT:
            return <WaitingForPlacementComponent setGameState={setGameState} state={gameState} onScorePressed={onScorePressed}/>
        case GameStateType.SHOWING_WORDS:
            return <ShowingTilesComponent setGameState={setGameState} state={gameState} onScorePressed={onScorePressed}/>
        case GameStateType.DROPPING_TILES:
            return <FallingTilesComponent setGameState={setGameState} state={gameState} onScorePressed={onScorePressed}/>
    }

}

interface WaitingForPlacementProps {
    setGameState: (state: GameState) => void;
    state: WaitingForPlacement;
    onScorePressed: () => void;
}

const WaitingForPlacementComponent: React.FunctionComponent<WaitingForPlacementProps> = ({ setGameState, state, onScorePressed }) => {
    const { tiles, score, currentLetter, choiceCount, lastPlaced, bestScore } = state;

    const onTilePress = (x: number, y: number) => {
        setGameState(onTilePressed(state, x, y))
    }

    const [lastX, lastY] = lastPlaced || [-1, -1];

    return (
        <>
            <View style={styles.container}>
                <ScoreComponent score={score} bestScore={bestScore} onPress={onScorePressed}/>
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
    state: ShowingWords;
    onScorePressed: () => void;
}

const ShowingTilesComponent: React.FunctionComponent<ShowingTilesProps> = ({ setGameState, state, onScorePressed}) => {
    const { previousState, correct, newState, bestScore, hasFallen } = state;
    const { tiles, score } = previousState as WaitingForPlacement;
    const { currentLetter, choiceCount } = newState;
    const newScore = (newState as WaitingForPlacement).score;
    React.useEffect(() => {
        setTimeout(() => {
            setGameState(newState)
        }, GAME_WORD_SHOW_TIME);
    }, []);

    const isEndGame = newScore === 0;

    const getCharacterResultEnum = (isCorrect: boolean): CharacterResultEnum => {
        if (isEndGame) {
            return CharacterResultEnum.SHOWING_WRONG_END_GAME;
        }

        if (hasFallen) {
            if (isCorrect) {
                return CharacterResultEnum.SHOWING_CORRECT_AFTER_FALL;
            } else {
                return CharacterResultEnum.SHOWING_WRONG_AFTER_FALL;
            }
        }

        if (isCorrect) {
            return CharacterResultEnum.SHOWING_CORRECT;
        } else {
            return CharacterResultEnum.SHOWING_WRONG_MID_GAME;
        }
    }

    return <>
        <View style={styles.container}>
        <ScoreComponent score={score} newScore={newScore} bestScore={bestScore} onPress={onScorePressed}/>
        <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={
            (x: number, y: number) => tiles[x][y] ? <CharacterResult character={tiles[x][y]!} characterResult={getCharacterResultEnum(correct[x][y])}/> : <UnplacedButton onPress={() => undefined}/>
            }/>
        <View style={styles.characterDisplay}>
            <CharacterDisplay character={currentLetter} choiceCount={choiceCount}/>
        </View>
    </View>
</>
}

interface FallingTilesProps {
    setGameState: (state: GameState) => void;
    state: FallingTilesState;
    onScorePressed: () => void;
}

const FallingTilesComponent: React.FunctionComponent<FallingTilesProps> = ({ setGameState, state, onScorePressed}) => {
    const { tiles, score, currentLetter, choiceCount, bestScore } = state;

    React.useEffect(() => {
        setTimeout(() => {
            setGameState(onTilesFell(state));
        }, FALL_SPEED * GAME_HEIGHT);
    }, [])

    return (<>
        <View style={styles.container}>
            <ScoreComponent score={score} bestScore={bestScore} onPress={onScorePressed}/>
            <Grid width={GAME_WIDTH} height={GAME_HEIGHT} renderChild={
                (x: number, y: number) => tiles[x][y].character ? <CharacterFalling character={tiles[x][y].character!} height={tiles[x][y].height} /> : <UnplacedButton onPress={() => undefined}/>
                }/>
            <View style={styles.characterDisplay}>
                <CharacterDisplay character={currentLetter} choiceCount={choiceCount}/>
            </View>
        </View>
    </>)
}

export default GameComponent;