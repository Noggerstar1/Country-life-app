import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, View, ActivityIndicator, Button, RefreshControl} from 'react-native';
import CalendarHeader from "../components/headers/calendarHeader";
import OrderItem from "../components/orderItem";
import CustomText from "../components/customText";
import ActionHeader from "../components/headers/actionHeader";
import {fetchOrders} from "../utils/httpRequests";
import SelectListBox from "../components/selectListBox";
import {mapResponseToOrders} from "../utils/mappers";


export default function Orderslist({route, navigation}) {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState([]);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date());
    const [currentTrace, setCurrentTrace] = useState('1');
    const [chooseMode, setChooseMode] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [orders, setOrders] = useState([]);

    const jsonDate = route?.params?.date;


    useEffect(() => {
        if (jsonDate) {
            setDate(new Date(jsonDate))
        }
        if(route?.params?.navReset) {
            setChooseMode(false);
        }

    }, [route])

    useEffect(() => {
        setIsLoading(true);
        fetchOrders(date)
            .then(
                (result) => {
                    setIsLoading(false);
                    setError(null);
                    setChooseMode(false);
                    setResponse(result);
                },
                (error) => {
                    setIsLoading(false);
                    setError(error);
                }
            );
    }, [date])

    useEffect(() => {
        if (!chooseMode) {
            orders.forEach((item) => {
                item.selected = false
            })
            setSelectedCount(0);
        }
    }, [chooseMode])

    useEffect(() => {
        const mappedOrders = mapResponseToOrders(response, date);
        setOrders(mappedOrders);
    }, [response])


    const passOrders = () => {
        navigation.navigate('ChangeTrace', orders.filter(item => item.selected))
    }

    const addCount = () => {
        setSelectedCount(selectedCount + 1);
    }

    const deductCount = () => {
        setSelectedCount(selectedCount - 1);
        if (selectedCount <= 1) {
            setChooseMode(false);
        }
    }

    const onRefresh = () => {
        if (jsonDate) {
            navigation.navigate('Orderslist', {date: jsonDate})
        } else {
            navigation.navigate('Orderslist', {date: new Date().toJSON()})
        }
    }

    const getContent = () => {
        if (error) {
            return <View>
                <CustomText>Objednávky se nepodařilo získat. Zkontrolujte, zda jste připojeni.</CustomText>
                <View style={styles.marginTop}>
                    <Button
                        onPress={onRefresh}
                        title="Zkusit znovu"
                        color="#8FB200"
                    />
                </View>
            </View>
        }

        return <>
            <CustomText style={styles.headerText}>Objednávky na trase</CustomText>
            <View style={styles.selectList}>
                <SelectListBox
                    setSelected={setCurrentTrace}
                    unusedTracesDisabled={true}
                    data={orders}
                />
            </View>

            {isLoading && <ActivityIndicator size="large" color="#00ff00"/>}

            {(!orders || orders.length===0) && !isLoading && !error && <View style={styles.center}><CustomText>Žádné dostupné objednávky</CustomText></View>}

            <View style={styles.list}>
                <FlatList
                    data={orders.filter(item => item.trace === currentTrace || (item.trace === '' && currentTrace==='0'))}
                    renderItem={({item}) => (
                        <OrderItem
                            item={item}
                            chooseMode={chooseMode}
                            changeMode={() => setChooseMode(!chooseMode)}
                            addCount={addCount}
                            deductCount={deductCount}
                            navigation={navigation}/>
                    )}
                    //ListComponents are for purpose of swiping even when there is no item, also better UX
                    ListHeaderComponent={<View style={{ flex: 1 }} />}
                    ListFooterComponent={<View style={{ flex: 1 }} />}
                    refreshControl={<RefreshControl refreshing={false}
                                                    onRefresh={onRefresh}/>}
                />
            </View>
        </>
    }

    return (
        <View style={styles.content}>
            {chooseMode ? <ActionHeader changeMode={() => setChooseMode(false)} passOrders={passOrders}
                                        selectedCount={selectedCount}/> :
                <CalendarHeader navigation={navigation} date={date}/>}
            {getContent()}
        </View>

    )
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 80,
        flex: 1,
    },

    headerText: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        marginBottom: 30,
    },

    selectList: {
        width: '80%',
        alignSelf: 'center',
    },

    list: {
        marginTop: 30,
        flex: 1,
    },

    center: {
        marginTop: 10,
        alignSelf: "center",
    },

    marginTop: {
      marginTop: 20,
    }
})
