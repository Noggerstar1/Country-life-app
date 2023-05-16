import React, {useEffect, useState} from "react";
import {View, Switch, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import CustomText from "../components/customText";
import {FontAwesome} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Entypo} from '@expo/vector-icons';
import {globalStyles} from "../styles/global";
import ChangeTraceButton from "../components/changeTraceButton";
import {cleanWholeStorage, reloadChanges, removeValue} from "../utils/asyncStorageFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {updateTracesInABRA} from "../utils/httpRequests";
import ClButton from "../components/clButton";


export default function HandleChangeTrace({navigation, route}) {
    const [changes, setChanges] = useState([]);
    const [changeTraceDisabled, setChangeTraceDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (allSwitchesOn()) {
            setChangeTraceDisabled(false);
        } else {
            setChangeTraceDisabled(true);
        }
    }, [changes])

    useEffect(() => {
        reloadChanges(setChanges);
    }, [route])


    const allSwitchesOn = () => {
        let result = true;
        changes.forEach(
            change => {
                if (change.groceries === false
                    || change.chilled === false
                    || change.fruitVeg === false
                    || change.pastry === false) {
                    result = false;
                }
            })
        return result;
    }

    const toggleSwitch = (orderId, switchName) => {
        const updatedChanges = changes.map((change) => {
            if (change.id === orderId) {
                change[switchName] = !change[switchName];
            }
            return change;
        });

        setChanges(updatedChanges);
        AsyncStorage.setItem('Changes', JSON.stringify(updatedChanges));
    };

    const getSwitchButton = (changeId, switchName) => {
        return (<Switch
            trackColor={{false: 'red', true: 'green'}}
            thumbColor={'#E7E0EC'}
            style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
            onValueChange={() => toggleSwitch(changeId, switchName)}
            value={changes.find((change) => change.id === changeId)[switchName]}
        />)
    }

    const getEmptyFill = () => {
        return (<View style={styles.emptyFill}></View>)
    }

    const onSubmit = () => {
        setIsLoading(true);
        const date = changes[0].date;
        try {
            updateTracesInABRA(changes)
                .then(()=>{
                    removeValue('Changes')
                })
                .then(()=>{
                    setChanges([]);
                    setIsLoading(false);
                    alert("objednávky úspěšně přesunuty");
                })
                .then(()=>{
                    navigation.navigate('Orderslist', new Date(date).toJSON())
                })
                .catch((e)=>{
                    setIsLoading(false)
                    alert("Chyba v přesouvání objednávek: " + e)
                })

        } catch (e) {
            alert("Chyba v přesouvání objednávek")
            throw new Error(e)
        }

    }


    return (
        <View style={styles.content}>
            <CustomText style={globalStyles.headingText}>Vypořádání změn tras</CustomText>

            <View style={styles.groupIcons}>
                <Entypo name="shopping-bag" size={24} color="#E7E0EC"/>
                <FontAwesome name="snowflake-o" size={24} color="#1ADBC5"/>
                <FontAwesome5 name="carrot" size={25} color="#b35900"/>
                <MaterialCommunityIcons name="food-croissant" size={26} color="#c4ab86"/>
            </View>
            {isLoading && <ActivityIndicator size="large" color="#00ff00"/>}

            {changes.length !== 0 && !isLoading &&
                <ClButton
                    text = "Zrušit vše"
                    icon = {<Entypo name="cross" size={24} color="white" />}
                    onPress = {async () => {
                        cleanWholeStorage().then(()=>setChanges([]))
                    }}
                />
            }

            {changes.length === 0 ? <CustomText>Žádné momentální změny tras</CustomText> : ""}
            <View style={styles.list}>
                <FlatList
                    data={changes}
                    renderItem={({item}) => {

                        return (<View style={styles.item}>
                            <CustomText style={globalStyles.bold}>{item.firmOffice_name}</CustomText>
                            <CustomText>{item.city}</CustomText>
                            <CustomText>
                                <CustomText>{item.orderName}, </CustomText>
                                <CustomText>{item.traceFrom === "0" ? " bez přiřazení" : "Trasa " + item.traceFrom} {'->'}
                                    {item.traceTo === "0" ? " bez přiřazení" : " Trasa " + item.traceTo}</CustomText>
                            </CustomText>

                            <View style={styles.switchGroup}>

                                {item.groceries !== null ? getSwitchButton(item.id, 'groceries') : getEmptyFill()}
                                {item.chilled !== null ? getSwitchButton(item.id, 'chilled') : getEmptyFill()}
                                {item.fruitVeg !== null ? getSwitchButton(item.id, 'fruitVeg') : getEmptyFill()}
                                {item.pastry !== null ? getSwitchButton(item.id, 'pastry') : getEmptyFill()}

                            </View>
                        </View>)
                    }}
                />
            </View>
            <View style={{marginBottom: 10}}>
                {changes.length !== 0 && !isLoading && (

                    <ChangeTraceButton
                        onPress={onSubmit}
                        disabled={changeTraceDisabled}
                        text="Přeřadit objednávky"/>

                )}
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 80,
        flex: 1,
        alignItems: 'center',
    },
    groupIcons: {
        flexDirection: 'row',
        width: '85%',
        justifyContent: 'space-between',
        margin: 20,
        marginBottom: 5,
        paddingBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'white'
    },

    switchGroup: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    list: {
        alignSelf: 'center',
        flex: 1,
    },

    emptyFill: {
        width: 49,
    },

    item: {
        marginTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },

})

