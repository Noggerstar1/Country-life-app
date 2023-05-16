import React, {useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import CustomText from "../components/customText";
import {globalStyles} from "../styles/global";
import ChangeTraceButton from "../components/changeTraceButton";
import {validationErrorMsg} from "../utils/helpers";
import {addTracesChangesInStorage, getChangesFromStorage} from "../utils/asyncStorageFunctions";
import SelectListBox from "../components/selectListBox";
import { FontAwesome } from '@expo/vector-icons';
import {addProductGroupsToOrders, mapOrderToTraceChange} from "../utils/mappers";

export default function ChangeTrace({route, navigation}) {
    const [currentTrace, setCurrentTrace] = useState("");
    let ordersToUpdate = route?.params || [];
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const addProductGroups = async () => {
            setError(null);
            setIsLoading(true);
            try {
                await addProductGroupsToOrders(ordersToUpdate);
            } catch (e) {
                setError(e);
            }
        };

        addProductGroups().then(()=>setIsLoading(false));
    }, [route]);

    const onSubmit = () => {
        getChangesFromStorage().then(currentChanges => {
            let errorMsg = validationErrorMsg(ordersToUpdate, currentChanges, currentTrace)
            if (errorMsg) {
                alert(errorMsg)
            } else {
                const changes = ordersToUpdate.map(order => mapOrderToTraceChange(order, currentTrace));

                addTracesChangesInStorage(changes).then(() => {
                    navigation.navigate('Orderslist', {navReset: true})
                }).then(() => {
                    navigation.navigate('HandleChangeTrace', {change: true});
                })
            }
        })
    }

    const getContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#00ff00"/>
        } else if (error) {
            return <>
                <CustomText>Chyba při načítání, opakujte prosím znovu</CustomText>
            </>
        } else {
            return (
                <>
                    <CustomText style={globalStyles.headingText}>Přesunout objednávku</CustomText>


                    <View style={styles.selectListsContainer}>
                        <View style={styles.fromTrace}>
                            <CustomText style={styles.black}>{ordersToUpdate[0].trace === '0' || ordersToUpdate[0].trace === '' ? "Bez přiřazení"
                                : "Trasa " + ordersToUpdate[0].trace}</CustomText>
                        </View>
                        <View style={styles.center}>
                            <FontAwesome name="exchange" size={24} color="white" />
                        </View>

                        <View style={styles.selectList}>
                            <SelectListBox
                                setSelected={setCurrentTrace}
                                unusedTracesDisabled={false}
                            />
                        </View>
                    </View>
                    <CustomText style={styles.assignedTrace}>Počet objednávek: {ordersToUpdate.length}</CustomText>

                    <ChangeTraceButton
                        onPress={onSubmit}
                        disabled={!currentTrace}
                        text="Přeřadit"/>

                </>
            )
        }
    }

    return (<View style={globalStyles.content}>{getContent()}</View>)
}

const styles = StyleSheet.create({
    assignedTrace: {
        marginBottom: 15,
        fontSize: 17,
    },
    changeTo: {
        fontSize: 16,
        marginBottom: 20,
    },
    selectListsContainer: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 50,
    },
    selectList: {
        width: '40%'
    },
    fromTrace: {
        backgroundColor: '#F4F3F380',
        borderRadius: 10,
        padding: 12,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: 'flex-start',

    },
    black: {
        color: '#00000080',
    },
    center: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    }
})

