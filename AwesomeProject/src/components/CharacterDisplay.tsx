import React from "react";
import { View, Text, Animated } from "react-native";


export interface CharacterDisplayProps {
    choiceCount: number;
    character: string; // Undefined character means none
}

const SIZE = 64;
const ROTATE = 0;
const BOUNCE = 0.1;
const SPEED = 50;

export const CharacterDisplay: React.FunctionComponent<CharacterDisplayProps> = ({ character, choiceCount }) => {
    const placingAnim = React.useRef(new Animated.Value(ROTATE)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.sequence([
            Animated.timing(
                placingAnim,
                {
                toValue: ROTATE + BOUNCE,
                duration: SPEED,
                useNativeDriver: false
                }
            ),
            Animated.timing(
                placingAnim,
                {
                toValue: ROTATE,
                duration: SPEED,
                useNativeDriver: false
                }
            ),  
            Animated.timing(
                placingAnim,
                {
                toValue: ROTATE - BOUNCE,
                duration: SPEED,
                useNativeDriver: false
                }
            ),
            Animated.timing(
                placingAnim,
                {
                toValue: ROTATE,
                duration: SPEED,
                useNativeDriver: false
                }
            ),  
        ]).start();
    }, [placingAnim, choiceCount])

    return (
        <Animated.View style={{
            backgroundColor: "#D8D8D8",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#979797",
            borderRadius: 8,
            width: SIZE,
            height: SIZE,
            margin: 2,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ rotate: placingAnim }]
        }}>
            <Text style={{fontSize: 32}}>{character}</Text>
        </Animated.View>  
    );
} 



