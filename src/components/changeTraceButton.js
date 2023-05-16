import {StyleSheet} from 'react-native';
import CustomText from "./customText";
import {MaterialIcons} from '@expo/vector-icons';


export default function ChangeTraceButton(props) {
    const {disabled, onPress, text} = props;


    return (<MaterialIcons.Button
        name="autorenew"
        disabled={disabled}
        backgroundColor={disabled ? "#8FB20040" : "#8FB200"}
        color={disabled ? "#ffffff88" : "#ffffff"}
        borderRadius={10}
        padding={13}
        onPress={onPress}>
        <CustomText style={disabled ? styles.transparent : null}>
            {text}
        </CustomText>
    </MaterialIcons.Button>)
}

const styles = StyleSheet.create({
    transparent: {
        color: '#ffffff88',
    }
});