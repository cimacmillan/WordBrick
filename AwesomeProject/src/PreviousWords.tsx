import React from "react"
import { Dimensions, TextStyle, View, ViewStyle, Text, ScrollView, Animated } from "react-native"
import { LineScore } from "./StateTransition";

interface PreviousWordsProps {
    scores: LineScore[],
    onPress: () => void
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = {
    container: {
        position: "absolute",
        backgroundColor: "#000000",
        width: windowWidth,
        height: windowHeight,
        flexDirection: "column",
        // alignItems: "center",
    } as ViewStyle,
    scrollContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
    } as ViewStyle,
    characterDisplay: {
        color: "#FFFFFF",
        fontSize: 32,
        margin: 32,
    } as TextStyle,
    wordDisplay: {
        color: "#FFFFFF",
        fontSize: 32,
        marginRight: 32,
        marginBottom: 4
    } as TextStyle,
    scoreDisplay: {
        color: "#6CFF95",
        fontSize: 32
    } as TextStyle
};

const GREEN = "#6CFF95FF";
const GOLD = "#FFEA5CFF";


export const PreviousWords: React.FunctionComponent<PreviousWordsProps> = ({ scores, onPress }) => {
    const placingAnim = React.useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(placingAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start();
    }, []);
        
    return <Animated.View style={{...styles.container, opacity: placingAnim}}>
        <View style={{
            width: windowWidth,
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <Text style={styles.characterDisplay}>Previous words</Text>
            <Text style={styles.characterDisplay} onPress={onPress}>X</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            { scores.reverse().map(score => (
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.wordDisplay}>{score.word}</Text>
                    <Text style={{...styles.scoreDisplay, color: score.value > 5 ? GOLD : GREEN }}>{score.value}</Text>
                </View>
            ))}
        </ScrollView>
    </Animated.View>
}
