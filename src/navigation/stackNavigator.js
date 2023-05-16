import {createStackNavigator} from '@react-navigation/stack';
import ChangeTrace from '../screens/changeTrace';
import OrderDetail from '../screens/orderDetail';
import OrderOverview from '../screens/orderOverview';
import Orderslist from '../screens/orderslist';

export default function StackNavigator() {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Orderslist"
                          component={Orderslist}
                          options={{headerShown: false}}/>
            <Stack.Screen name="OrderOverview"
                          component={OrderOverview}
                          options={{title: 'Zpět',}}/>
            <Stack.Screen name="ChangeTrace"
                          component={ChangeTrace}
                          options={{title: 'Zpět',}}/>
            <Stack.Screen name="OrderDetail"
                          component={OrderDetail}
                          options={{title: 'Zpět',}}/>
        </Stack.Navigator>
    );
}
