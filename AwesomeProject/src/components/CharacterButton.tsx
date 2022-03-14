import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text, Animated } from "react-native";

export interface CharacterButtonProps {
    character?: string; // Undefined character means none
    onPress: () => void;
}


const SIZE = 64;
const BOUNCE = -8;
const SPEED = 100;

export const CharacterButton: React.FunctionComponent<CharacterButtonProps> = ({ character, onPress }) => {
    const placingAnim = React.useRef(new Animated.Value(SIZE)).current  // Initial value for opacity: 0

    React.useEffect(() => {
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
    }, [placingAnim]);

    return (
    <TouchableWithoutFeedback onPress={onPress}>
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
                width: placingAnim,
                height: placingAnim,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Text style={{fontSize: 32}}>{character}</Text>
            </Animated.View>  
        </View>
    </TouchableWithoutFeedback>
    );
} 
