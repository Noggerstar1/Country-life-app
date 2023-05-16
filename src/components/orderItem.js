import {StyleSheet, View, TouchableOpacity, Vibration} from "react-native";
import {Octicons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import {useEffect, useState} from "react";
import CustomText from "./customText";
import {globalStyles} from "../styles/global";

export default function OrderItem({item, chooseMode, changeMode, addCount, deductCount, navigation}) {
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        setSelected(item.selected);
    }, [item])

    const getLeftIcon = () => {
        if (chooseMode) {
            if (selected) {
                return <AntDesign name="checkcircleo" size={24} color="black"/>
            } else {
                return <FontAwesome name="circle-thin" size={27} color="black"/>
            }
        }
        return <Octicons name='package' color="#38312f" size={27} onPress={onLongPressAction}/>
    }

    const onLongPressAction = () => {
        item.selected = !selected;
        setSelected(!selected);
        if (!chooseMode) {
            changeMode();
        }
        if (!selected) {
            addCount();
        } else {
            deductCount();
        }
        Vibration.vibrate(90);
    }

    const onPress = () => {
        if (chooseMode) {
            item.selected = !selected;
            setSelected(!selected)
            if (!selected) {
                addCount();
            } else {
                deductCount();
            }
        } else {
            navigation.navigate('OrderOverview', {id: item.id, QR: false})
        }
    }
    const correctStateColor = (stateId) => {
        if (stateId === '19') {
            return styles.inProgressLayout;
        } else if (stateId === '20') {
            return styles.readyLayout;
        }
        return styles.defaultLayout;
    }

    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPressAction} activeOpacity={0.8} delayLongPress={200}>
            <View style={[styles.item, correctStateColor(item.stateId)]}>
                <View style={styles.icon}>
                    {getLeftIcon()}
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.upperText}>
                        <View>
                            <CustomText style={globalStyles.black}>{item.orderName}</CustomText>
                        </View>
                        <View style={styles.city}>
                            <CustomText style={globalStyles.black}>{item.city}</CustomText>
                        </View>
                    </View>
                    <View style={styles.lowerText}>
                        <CustomText style={globalStyles.black}>{item.firmOffice_name}</CustomText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    item: {
        padding: 12,
        paddingLeft: 15,
        marginBottom: 7,
        borderWidth: 0.5,
        borderRadius: 10,
        flexDirection: 'row',
    },
    defaultLayout: {
        backgroundColor: '#F4F3F3',
    },
    readyLayout: {
        backgroundColor: '#8FB200'
    },
    inProgressLayout: {
        backgroundColor: '#F0F014'
    },


    textContainer: {
        flex: 1,
        paddingLeft: 15,
    },
    icon: {
        justifyContent: "center",
    },
    upperText: {
        flexDirection: 'row',
    },
    lowerText: {
        paddingTop: 5,
    },
    city: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 10,
    },
})