import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text, Animated, Easing } from "react-native";

export interface CharacterButtonProps {
    character?: string; // Undefined character means none
    showingCorrect?: boolean;
}


const SIZE = 64;
const BOUNCE = -8;
const SPEED = 100;

const GREEN = "#6CFF95FF";
const RED = "#FF4D4DFF";
const GREEN_GONE = "#6CFF9500";
const GREY = "#D8D8D8FF";

export const CharacterButton: React.FunctionComponent<CharacterButtonProps> = ({ character, showingCorrect }) => {
    const placingAnim = React.useRef(new Animated.Value(SIZE)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        if (showingCorrect === undefined) {
            Animated.sequence([
                Animated.timing(
                    placingAnim,
                    {
                    toValue: SIZE + BOUNCE,
                    duration: SPEED,
                    useNativeDriver: false
                    }
                ),
                Animated.timing(
                    placingAnim,
                    {
                    toValue: SIZE,
                    duration: SPEED,
                    useNativeDriver: false
                    }
                ),  
            ]).start();
        } else {
            placingAnim.setValue(0);
            Animated.timing(
                placingAnim,
                {
                toValue: 2,
                duration: 2000,
                useNativeDriver: false,
                easing: Easing.sin
                }
            ).start();
        }
    }, [placingAnim]);

    let animStyle = {};

    if (showingCorrect === undefined) {
        animStyle = {
            width: placingAnim,
            height: placingAnim,
        }
    } else {
        animStyle = {
            backgroundColor: placingAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange:[GREY, showingCorrect ? GREEN : RED, showingCorrect ? GREEN_GONE : GREY]
            }),
            width: SIZE,
            height: SIZE,
        }
    }

    return (
        <View style={{
            width: SIZE,
            height: SIZE,
            justifyContent: "center",
            alignItems: "center",
            margin: 2
        }}>
            <Animated.View style={{
                backgroundColor: "#D8D8D8",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#979797",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                ...animStyle
            }}>
                <Text style={{fontSize: 32}}>{character}</Text>
            </Animated.View>  
        </View>
    );
} 
