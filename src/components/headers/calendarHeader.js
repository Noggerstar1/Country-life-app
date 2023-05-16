import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomText from '../customText';
import {globalStyles} from '../../styles/global';

export default function CalendarHeader({navigation, date}) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentDate, setCurrentDate] = useState(date);

    useEffect(() => {
        setCurrentDate(date)
    }, [date])

    let dateString = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.';

    const onChange = (event, selectedDate) => {
        setShowCalendar(false);
        if (!selectedDate) {
            setShowCalendar(false);
        } else {
            navigation.navigate('Orderslist', {date: selectedDate.toJSON()})
        }
    }

    const isDateToday = (dateInput) => {
        const today = new Date();
        return dateInput.getFullYear() === today.getFullYear()
            && dateInput.getMonth() === today.getMonth()
            && dateInput.getDate() === today.getDate()
    }

    return (
        <View style={globalStyles.headerContainer}>
            <TouchableOpacity style={styles.headerOpacity} onPress={() => setShowCalendar(true)}>
                <AntDesign name="calendar" size={26} color="white"/>
                <CustomText style={globalStyles.headerText}>Datum
                    dodání: {dateString} {isDateToday(currentDate) ? '(dnes)' : ''}</CustomText>
                {showCalendar && (<DateTimePicker
                    value={currentDate}
                    onChange={onChange}
                />)}
            </TouchableOpacity>
        </View>

    );
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

    headerOpacity: {
        flexDirection: 'row',
    },

    //unused, but may be needed in the future
    rightIcons: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
