import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    content: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 80,
        flex:1,
        alignItems: 'center',
    },
    headingText: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 20,
    },
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
        marginLeft: 30,
        fontSize: 17,
    },
    rightIcons: {
        flex: 1,    
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    black: {
        color: 'black',
    },
    bold: {
      fontWeight: 'bold',
    }
})