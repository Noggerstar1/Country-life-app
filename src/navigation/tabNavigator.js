import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StackNavigator from './stackNavigator';
import {Octicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import QrScanner from '../screens/qrScanner';
import HandleChangeTrace from '../screens/handleChangeTrace';

export default function TabNavigator() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                height: 60,
                position: 'absolute',
                marginBottom: 10,
                marginLeft: 12,
                marginRight: 12,
                borderRadius: 20,
                paddingBottom: 5,
                backgroundColor: 'white',
            },
            headerShown: false,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'rgb(100, 100, 100)'
        }}>
            <Tab.Screen name="OrderslistTab" component={StackNavigator} options={{
                tabBarLabel: 'Objednávky',
                tabBarIcon: ({color, size}) => (
                    <Octicons name='package' color={color} size={size}/>
                ),
            }}/>
            <Tab.Screen name="QrScanner" component={QrScanner} options={{
                tabBarLabel: 'QR skener',
                tabBarIcon: ({color, size}) => (
                    <MaterialIcons name="qr-code-scanner" color={color} size={size}/>
                ),
            }}/>
            <Tab.Screen name="HandleChangeTrace" component={HandleChangeTrace} options={{
                tabBarLabel: 'Změny tras',
                tabBarIcon: ({color, size}) => (
                    <MaterialIcons name="autorenew" color={color} size={size}/>
                ),
            }}/>

        </Tab.Navigator>
    )
}