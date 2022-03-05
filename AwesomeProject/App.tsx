import * as React from 'react';
import { ScrollView, Text, View, Image, TextInput, Button, Animated } from 'react-native';

import { CompositeScreenProps, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

type RootStackParamList = {
    "Home": {},
    "Profile": {}
    "Settings": {}
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Profile = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Profile">) => {
    return (
        <ScrollView>
            <Text>Some text</Text>

        </ScrollView>
    );
}

const Settings = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Settings">) => {
    return (
        <ScrollView>
            <Text>Some text</Text>

        </ScrollView>
    );
}

const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">) => {
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
                <Button title="Profile" onPress={() => navigation.navigate("Profile", {})}/>
                <Button title="Settings" onPress={() => navigation.navigate("Settings", {})}/>
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