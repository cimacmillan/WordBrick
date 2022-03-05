import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated } from 'react-native';
import { CharacterButton } from './components/CharacterButton';

const App = () => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
        fadeAnim,
        {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true
        }
        ).start();
    }, [fadeAnim]);
    
    return (
        <ScrollView>
            <Animated.View
                style={{
                    opacity: fadeAnim,
                }}
            >
                <CharacterButton/>
                <Text>Some text</Text>
                <View>
                    <Text>Some more text</Text>
                    <Image
                        source={{
                            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
                        }}
                        style={{ width: 200, height: 200 }}
                    />
                </View>
                <TextInput
                    style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1
                    }}
                    defaultValue="You can type in me"
                />
                <Button
                    onPress={() => {
                        alert('You tapped the button!');
                    }}
                    title="Press Me"
                    />
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
                <Text style={{fontSize: 40}}>Hello, I am your cat!</Text>
            </Animated.View>
        </ScrollView>
    );
}

export default App;