import React from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';

export default function CustomText(props) {
    return (
        <Text style={[styles.defaultStyle, props.style]}>
            {props.children}
        </Text>
    );
}

const styles = StyleSheet.create({
    defaultStyle: {
        color: 'white',
        fontSize: 16,
    },
});