import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, StyleSheet, View} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {globalStyles} from "../styles/global";
import CustomText from "../components/customText";
import ChangeTraceButton from "../components/changeTraceButton";
import {fetchOrder, fetchOrderByQR} from "../utils/httpRequests";
import {Entypo, FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import {mapResponseToOrder} from "../utils/mappers";

export default function OrderOverview({route, navigation}) {
    const [order, setOrder] = useState();
    const [response, setResponse] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        setError(null);
        if (response && response.length > 0) {
            const obtainedOrder = mapResponseToOrder(response);
            setOrder(obtainedOrder);

            setIsLoading(false);

            if (obtainedOrder) {
                findAndSetMatchingChange(obtainedOrder);
            }

        } else {
            setError(true)
        }

    }, [response])

    useEffect(() => {
        onLoad()
    }, [route])


    const fetchOrderByIdOrQR = (fetchFunction, id) => {
        fetchFunction(id)
            .then(
                (result) => {
                    setResponse(result);
                },
                (error) => {
                    setError(error);
                    console.error(error)
                })
            .then(() => setIsLoading(false))
    }

    const onLoad = () => {
        setError(null);
        setIsLoading(true);
        if(route.params.QR) {
            fetchOrderByIdOrQR(fetchOrderByQR, route.params.id);
        } else {
            fetchOrderByIdOrQR(fetchOrder, route.params.id);
        }
    }

    const getGroceries = () => {
        return <View style={styles.flexRow}>
            <Entypo name="shopping-bag" size={15} color="#E7E0EC"/>
            <CustomText style={styles.marginLeft}>Koloniál</CustomText>
        </View>
    }

    const getChilled = () => {
        return <View style={styles.flexRow}>
            <FontAwesome name="snowflake-o" size={15} color="#1ADBC5"/>
            <CustomText style={styles.marginLeft}>Chlazené</CustomText>
        </View>
    }

    const getFruitVeg = () => {
        return <View style={styles.flexRow}>
            <FontAwesome5 name="carrot" size={15} color="#b35900"/>
            <CustomText style={styles.marginLeft}>Ovozel</CustomText>
        </View>
    }

    const getPastry = () => {
        return <View style={styles.flexRow}>
            <MaterialCommunityIcons name="food-croissant" size={15} color="#c4ab86"/>
            <CustomText style={styles.marginLeft}>Pečivo</CustomText>
        </View>
    }

    const formattedDate = (milliseconds) => {
        const date = new Date(milliseconds)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth()+1).toString().padStart(2, '0')
        const year = date.getFullYear().toString();
        return day + "." + month + "." + year;
    }

    const getContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#00ff00"/>
        } else if (error) {
            return <>
                <CustomText>Objednávku se nepodařilo získat. Zkontrolujte, zda jste připojeni.</CustomText>
                <CustomText>{route.params.QR ? "Zkontrolujte také, že QR kód obsahuje ID objednávky" : ""}</CustomText>
                <CustomText>{route.params.QR ? "Data v QR kódu: " + route.params.id : ""}</CustomText>
                <Button
                    onPress={onLoad}
                    title="Zkusit znovu"
                    color="#8FB200"
                />
            </>
        } else {
            return <>
                <CustomText style={globalStyles.headingText}>Přehled objednávky</CustomText>
                <CustomText>{order.orderName}</CustomText>


                <CustomText style={styles.productsHeading}>Provozovna</CustomText>
                <CustomText style={globalStyles.bold}>{order.firmOffice_name}</CustomText>
                <CustomText>{order.street}</CustomText>
                <CustomText>{order.city + ", " + order.postCode}</CustomText>
                <CustomText>{order.firm_name}</CustomText>

                <CustomText style={styles.marginTop}>
                    <CustomText style={globalStyles.bold}>Termín dodání: </CustomText>
                    <CustomText>{formattedDate(order.date)}</CustomText>
                </CustomText>

                <CustomText style={styles.productsHeading}>Skupiny produktů</CustomText>
                <View style={styles.group}>
                    {order.groceries && getGroceries()}
                    {order.chilled && getChilled()}
                    {order.fruitVeg && getFruitVeg()}
                    {order.pastry && getPastry()}
                </View>
                <CustomText>Hmotnost: {Math.round(order.weight/1000*10)/10} kg</CustomText>

                <CustomText style={styles.assignedTrace}>Přiřazená
                    trasa: {order.trace === 0 || order.trace === "" ? "Bez přiřazení" : "Trasa " + order.trace}</CustomText>
                <ChangeTraceButton
                    disabled={false}
                    onPress={() => navigation.navigate('ChangeTrace', [order])}
                    text="Přeřadit objednávku"/>

            </>
        }
    }

    return (
        <View style={globalStyles.content}>
            {getContent()}
        </View>
    )
}

const styles = StyleSheet.create({
    assignedTrace: {
        marginTop: 20,
        fontSize: 16,
        marginBottom: 15,
    },

    productsHeading: {
        marginTop: 20,
        marginBottom: 15,
        fontSize: 17,
        fontWeight: 'bold'
    },

    group: {
        marginBottom: 30,
    },

    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    marginLeft: {
        marginLeft: 4,
    },

    marginTop: {
        marginTop: 20,
    },
})

