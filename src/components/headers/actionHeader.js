import {StyleSheet, View, Modal, TouchableOpacity} from "react-native";
import {AntDesign} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import CustomText from "../customText";
import {useState} from "react";
import {globalStyles} from "../../styles/global";

export default function ActionHeader({changeMode, passOrders, selectedCount}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <View style={globalStyles.headerContainer}>
            <AntDesign name="close" size={26} color="white" onPress={changeMode}/>
            <CustomText style={globalStyles.headerText}>{selectedCount}</CustomText>
            <View style={globalStyles.rightIcons}>
                <MaterialIcons name="more-vert" size={26} color="white" onPress={() => setShowModal(true)}
                               style={{paddingLeft: 10,}}/>

                {showModal && <Modal animationType='fade' visible={true} transparent={true}>
                    <TouchableOpacity style={styles.modalOption} activeOpacity={1} onPress={passOrders}>
                        <CustomText style={globalStyles.black}>Přesunout</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBackDrop} activeOpacity={1}
                                      onPress={() => setShowModal(false)}></TouchableOpacity>
                </Modal>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 0.2,
        borderBottomColor: '#d3d3d3',
        marginBottom: 20,
    },
    headerText: {
        marginLeft: 20,
        fontSize: 17,
    },
    rightIcons: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalBackDrop: {
        flex: 1,
    },
    modalOption: {
        backgroundColor: '#f5f9f8',
        padding: 15,
        paddingRight: 50,
        marginRight: 10,
        marginTop: 5,
        alignSelf: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
})
