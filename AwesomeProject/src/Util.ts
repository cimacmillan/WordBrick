import AsyncStorage from "@react-native-async-storage/async-storage";

const SCORE_KEY = "BEST_SCORE_0";

export async function getBestScore(): Promise<number> {
    try {
        const item = await AsyncStorage.getItem(SCORE_KEY);
        const number = Number(await AsyncStorage.getItem(SCORE_KEY));
        return number;
    } catch (e) {
        console.log(e);
        return 0;
    }
}

export async function setBestScore(score: number) {
    await AsyncStorage.setItem(SCORE_KEY, `${score}`);
}

