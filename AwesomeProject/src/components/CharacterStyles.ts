import { ViewStyle } from "react-native";

export const CHARACTER_SIZE = 64;
const GREY = "#D8D8D8FF";

export const CharacterStyles = {
    characterContainer: {
        width: CHARACTER_SIZE,
        height: CHARACTER_SIZE,
        justifyContent: "center",
        alignItems: "center",
        margin: 2
    } as ViewStyle,
    characterBlock: {
        backgroundColor: GREY,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#979797",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        width: CHARACTER_SIZE,
        height: CHARACTER_SIZE
    } as ViewStyle,
    characterText: {
        fontSize: 32
    }
}