import React from "react";
import {StyleSheet, View} from 'react-native';
import {globalStyles} from "../styles/global";
import CustomText from "../components/customText";

// this screen was removed, but may be needed in the future
export default function OrderDetail({route}) {
    const order = route.params;

    return (
        <View style={globalStyles.content}>
            <CustomText style={globalStyles.headingText}>Detail objednávky</CustomText>
            <CustomText>{order.orderName}</CustomText>
            <CustomText style={styles.secondHeading}>Místo doručení</CustomText>
            <View style={styles.commonText}>
                <CustomText>{order.city}</CustomText>
                <CustomText>{order.street}</CustomText>
                <CustomText>{order.postCode}</CustomText>
            </View>

            {/*
            <CustomText style={styles.secondHeading}>Seznam položek</CustomText>
                <View style={styles.orderItems}>
            <FlatList
                data={order.orderItems}
                renderItem={({ item, index }) => (
                    <CustomText style={styles.smallText}>
                        {index + 1}. {item}
                    </CustomText>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
            */}
        </View>
    )
}

const styles = StyleSheet.create({

    secondHeading: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 21,
    },

    commonText: {
        width: '80%',
        alignItems: 'center',
    },

    orderItems: {
        flex: 1,
        marginBottom: 5
    },

    smallText: {
        fontSize: 14,
    }

})

