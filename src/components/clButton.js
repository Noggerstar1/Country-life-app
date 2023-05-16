import {StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from "./customText";


export default function ClButton(props) {
    const {icon, onPress, text} = props;


    return (<TouchableOpacity style={styles.button} onPress={onPress}>
        {icon}
        <CustomText style={styles.text}>{text}</CustomText>
    </TouchableOpacity>)
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: '#8FB200',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    text: {
        marginLeft: 5,
    },
});