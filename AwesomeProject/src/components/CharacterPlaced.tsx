import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text, Animated, Easing } from "react-native";
import { GAME_WORD_SHOW_TIME } from "../Config";
import { CharacterStyles, CHARACTER_SIZE } from "./CharacterStyles";

export interface CharacterButtonProps {
    character?: string; // Undefined character means none
    showingCorrect?: boolean;
}

const BOUNCE = -8;
const SPEED = 100;

export const CharacterPlaced: React.FunctionComponent<CharacterButtonProps> = ({ character, showingCorrect }) => {
    const placingAnim = React.useRef(new Animated.Value(CHARACTER_SIZE)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.sequence([
            Animated.timing(
                placingAnim,
                {
                toValue: CHARACTER_SIZE + BOUNCE,
                duration: SPEED,
                useNativeDriver: false
                }
            ),
            Animated.timing(
                placingAnim,
                {
                toValue: CHARACTER_SIZE,
                duration: SPEED,
                useNativeDriver: false
                }
            ),  
        ]).start();
    }, []);

    const animStyle = {
        width: placingAnim,
        height: placingAnim,
    }

    return (
        <View style={CharacterStyles.characterContainer}>
            <Animated.View style={{...CharacterStyles.characterBlock, ...animStyle }}>
                <Text style={CharacterStyles.characterText}>{character}</Text>
            </Animated.View>  
        </View>
    );
} 
