import React, {useEffect, useState} from "react";
import {StyleSheet, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import CustomText from "../components/customText";

export default function QrScanner({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);


    useEffect(() => {
        return navigation.addListener('focus', () => {
            setHasPermission(false);
            (async () => {
                const {status} = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === "granted");
            })();
        });
    }, [navigation]);


    const handleBarCodeScanned = ({data}) => {
        navigation.navigate('OrderOverview', {id: data, QR: true})
    };

    if (hasPermission === null) {
        return <CustomText>Requesting for camera permission</CustomText>;
    }
    if (hasPermission === false) {
        return <CustomText>No access to camera</CustomText>;
    }


    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

