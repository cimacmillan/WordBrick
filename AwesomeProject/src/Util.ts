import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVE_KEY = "SAVE_KEY";

interface SaveData {
    bestScore: number;
    lastPlayed: string
}

const NEW_SAVE = () => {
    const now = new Date() 
    now.setDate(now.getDate() - 2)
    return {
        bestScore: 0,
        lastPlayed: now.toString()
    };
}

export async function getSave(): Promise<SaveData> {
    try {
        const save = (await AsyncStorage.getItem(SAVE_KEY))!;
        if (save === null) {
            return NEW_SAVE();
        }
        const object = JSON.parse(save);
        console.log(object)
        return object;
    } catch (e) {
        console.log(e)
        return NEW_SAVE();
    }
}

export async function setSave(save: SaveData) {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(save));
}
