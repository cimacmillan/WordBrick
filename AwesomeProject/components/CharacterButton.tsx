import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text } from "react-native";

export interface CharacterButtonProps {
    character?: string; // Undefined character means none
}

/**
 * background: #D8D8D8;
border: 1px solid #979797;
border-radius: 8px;
 */

export const CharacterButton: React.FunctionComponent<CharacterButtonProps> = ({ character }) => {
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


