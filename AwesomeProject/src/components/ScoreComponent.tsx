import * as React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { GAME_WIDTH } from '../Config';
import { CharacterStyles, CHARACTER_SIZE } from './CharacterStyles';


const styles = {
    scoreContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: GAME_WIDTH * CHARACTER_SIZE
    } as ViewStyle,
    scoreText: {
        marginBottom: 32, 
        fontSize: 32,
        color: "#FFFFFF"
    } as TextStyle
};

interface ScoreComponentProps {
    score: number;
    newScore?: number;
    bestScore: number;
}

export const ScoreComponent: React.FunctionComponent<ScoreComponentProps> = ({score, newScore, bestScore}) => {
    let text = newScore !== undefined ? (
        (newScore - score) < 0 ? `${score} - ${score - newScore}` : `${score} + ${newScore - score}`
     ) : `${score}`;
    return <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{text}</Text>
        <Text style={styles.scoreText}>{bestScore}</Text>
    </View>
}

