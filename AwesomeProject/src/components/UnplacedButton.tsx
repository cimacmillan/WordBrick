import React from "react";
import { Touchable, TouchableHighlight, TouchableWithoutFeedback, View, Text } from "react-native";

export interface CharacterButtonProps {
    onPress: () => void;
}

/**
 * background: #D8D8D8;
border: 1px solid #979797;
border-radius: 8px;
 */

export const UnplacedButton: React.FunctionComponent<CharacterButtonProps> = ({ onPress }) => {
    return (
    <TouchableWithoutFeedback onPress={onPress}>
        <View style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#979797",
            borderRadius: 8,
            width: 64,
            height: 64,
            margin: 2,
            alignItems: "center",
            justifyContent: "center"
        }}/>
    </TouchableWithoutFeedback>
    );
} 


