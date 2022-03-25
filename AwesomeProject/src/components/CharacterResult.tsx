import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text, Animated, Easing } from "react-native";
import { GAME_WORD_SHOW_TIME } from "../Config";
import { CharacterStyles } from "./CharacterStyles";

export enum CharacterResultEnum {
    SHOWING_CORRECT,
    SHOWING_WRONG_MID_GAME,
    SHOWING_WRONG_END_GAME,
    SHOWING_WRONG_AFTER_FALL,
    SHOWING_CORRECT_AFTER_FALL,
}

export interface CharacterButtonProps {
    character: string; // Undefined character means none
    characterResult: CharacterResultEnum;
}


const BOUNCE = -8;
const SPEED = 100;

const GREEN = "#6CFF95FF";
const RED = "#FF4D4DFF";
const GREEN_GONE = "#6CFF9500";
const RED_GONE = "#FF4D4D00";
const GOLD = "#FFEA5CFF";
const GOLD_GONE = "#FFEA5C00";
const GREY = "#D8D8D8FF";

function getAnimationRange(result: CharacterResultEnum) {
    switch(result) {
        case CharacterResultEnum.SHOWING_CORRECT:
            return [GREY, GREEN, GREEN, GREEN_GONE];
        case CharacterResultEnum.SHOWING_WRONG_MID_GAME:
            return [GREY, RED, RED, GREY];
        case CharacterResultEnum.SHOWING_WRONG_END_GAME:
            return [GREY, RED, RED, RED_GONE];
        case CharacterResultEnum.SHOWING_WRONG_AFTER_FALL:
            return [GREY, RED, RED, RED_GONE];
        case CharacterResultEnum.SHOWING_CORRECT_AFTER_FALL:
            return [GREY, GOLD, GOLD, GOLD_GONE];
    }
}

export const CharacterResult: React.FunctionComponent<CharacterButtonProps> = ({ character, characterResult }) => {
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
            outputRange: getAnimationRange(characterResult)
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
