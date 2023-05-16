import AsyncStorage from "@react-native-async-storage/async-storage";


export const getChangesFromStorage = async () => {
    try {
        const changes = await AsyncStorage.getItem("Changes");
        if (changes !== null) {
            return changes;
        }
    } catch (e) {
        console.error("error in getting changes from storage: " + e);
        alert("Nepodařilo se získat změny tras")
    }
    return [];
}


export const addTracesChangesInStorage = async (changesToAdd) => {
    let currentChanges = await (getChangesFromStorage());
    if (!currentChanges || currentChanges.length === 0) {
        currentChanges = [];
    } else {
        currentChanges = JSON.parse(currentChanges);
    }

    const allChanges = currentChanges.concat(changesToAdd);
    try {
        await AsyncStorage.setItem("Changes", JSON.stringify(allChanges));
    } catch (err) {
        alert(err)
    }

}

export const cleanWholeStorage = async () => {
    await AsyncStorage.clear();
}

export const removeValue = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (exception) {
        console.error("error removing: " + key + " from AsyncStorage")
    }
}

export const reloadChanges = async (setChanges) => {
    let changes = await getChangesFromStorage();
    if (!changes || changes.length === 0) {
        changes = [];
    } else {
        changes = JSON.parse(changes)
    }
    setChanges(changes);
}
