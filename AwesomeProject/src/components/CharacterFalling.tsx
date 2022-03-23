import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text, Animated, Easing, ViewStyle } from "react-native";
import { GAME_WORD_SHOW_TIME } from "../Config";
import { CharacterStyles, CHARACTER_SIZE } from "./CharacterStyles";
import { ViewProps } from "./Themed";

export interface CharacterFallingProps {
    character: string; // Undefined character means none
    height: number;
}

const SPEED = 200;

export const CharacterFalling: React.FunctionComponent<CharacterFallingProps> = ({ character, height }) => {
    const placingAnim = React.useRef(new Animated.Value(-height * CHARACTER_SIZE)).current  // Initial value for opacity: 0
    React.useEffect(() => {
        Animated.timing(
            placingAnim,
            {
            toValue: 0,
            duration: SPEED,
            useNativeDriver: false
            }
        ).start();
    }, []);

    const animStyle = {
        transform: [{ translateY: placingAnim }]
    }

    return (
        <View style={CharacterStyles.characterContainer}>
            <Animated.View style={{...CharacterStyles.characterBlock, ...animStyle }}>
                <Text style={CharacterStyles.characterText}>{character}</Text>
            </Animated.View>  
        </View>
    );
} 
