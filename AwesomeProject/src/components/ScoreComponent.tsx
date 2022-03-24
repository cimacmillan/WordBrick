import * as React from 'react';
import { Text } from 'react-native';


const styles = {
    scoreText: {
        marginBottom: 32, 
        fontSize: 32,
        color: "#FFFFFF"
    }
};

interface ScoreComponentProps {
    score: number;
    newScore?: number;
}

export const ScoreComponent: React.FunctionComponent<ScoreComponentProps> = ({score, newScore}) => {
    const text = newScore !== undefined ? (
        (newScore - score) < 0 ? `${score} - ${score - newScore}` : `${score} + ${newScore - score}`
     ) : `${score}`;
    return  <Text style={styles.scoreText}>{text}</Text>

}

