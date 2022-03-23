import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text, Animated, Easing } from "react-native";
import { GAME_WORD_SHOW_TIME } from "../Config";
import { CharacterStyles } from "./CharacterStyles";

export interface CharacterButtonProps {
    character?: string; // Undefined character means none
    showingCorrect?: boolean;
}


const BOUNCE = -8;
const SPEED = 100;

const GREEN = "#6CFF95FF";
// const RED = "#FF4D4DFF";
const GREEN_GONE = "#6CFF9500";
const GREY = "#D8D8D8FF";

export const CharacterResult: React.FunctionComponent<CharacterButtonProps> = ({ character, showingCorrect }) => {
    const placingAnim = React.useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            placingAnim,
            {
            toValue: 2,
            duration: GAME_WORD_SHOW_TIME,
            useNativeDriver: false,
            }
        ).start();
    }, []);

    const animStyle = {
        backgroundColor: placingAnim.interpolate({
            inputRange: [0, 0.5, 1.5, 2],
            outputRange:[GREY, showingCorrect ? GREEN : GREY, showingCorrect ? GREEN : GREY, showingCorrect ? GREEN_GONE : GREY]
        })
    };

    return (
        <View style={CharacterStyles.characterContainer}>
            <Animated.View style={{
                ...CharacterStyles.characterBlock,
                ...animStyle
            }}>
                <Text style={CharacterStyles.characterText}>{character}</Text>
            </Animated.View>  
        </View>
    );
} 
