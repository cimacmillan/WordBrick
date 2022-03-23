import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text, Animated, Easing } from "react-native";
import { GAME_WORD_SHOW_TIME } from "../Config";
import { CharacterStyles } from "./CharacterStyles";

export interface Character {
    character?: string; // Undefined character means none
}

export const Character: React.FunctionComponent<Character> = ({ character }) => {
    return (
        <View style={CharacterStyles.characterContainer}>
            <Animated.View style={CharacterStyles.characterBlock}>
                <Text style={CharacterStyles.characterText}>{character}</Text>
            </Animated.View>  
        </View>
    );
} 
