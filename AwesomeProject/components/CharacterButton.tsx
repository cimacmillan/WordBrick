import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text } from "react-native";

export interface CharacterButtonProps {
    character?: string; // Undefined character means none
    onPress: () => void;
}

/**
 * background: #D8D8D8;
border: 1px solid #979797;
border-radius: 8px;
 */

export const CharacterButton: React.FunctionComponent<CharacterButtonProps> = ({ character, onPress }) => {
    return (
    <TouchableWithoutFeedback onPress={onPress}>
        <View style={{
            backgroundColor: "#D8D8D8",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#979797",
            borderRadius: 8,
            width: 64,
            height: 64,
            margin: 2,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Text style={{fontSize: 32}}>{character}</Text>
        </View>  
    </TouchableWithoutFeedback>
    );
} 

export interface CharacterDisplayProps {
    character?: string; // Undefined character means none
}

export const CharacterDisplay: React.FunctionComponent<CharacterDisplayProps> = ({ character }) => {
    return (
    <TouchableWithoutFeedback onPress={() => alert("Pressed T")}>
        <View style={{
            backgroundColor: "#D8D8D8",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#979797",
            borderRadius: 8,
            width: 64,
            height: 64,
            margin: 2,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Text style={{fontSize: 32}}>{character}</Text>
        </View>  
    </TouchableWithoutFeedback>
    );
} 



