import {fetchProductGroups} from "./httpRequests";


export const mapResponseToOrders = (receivedOrders, date) => {
    return receivedOrders
        // orders with code: ROP, RVO, ROPE are the only that company wants to show
        .filter((ro) => {
            return ro.DOCQUEUE_ID.Code === "ROP"
                || ro.DOCQUEUE_ID.Code === "RVO"
                || ro.DOCQUEUE_ID.Code === "ROPE"
        })
        .map(ro => {
            return {
                id: ro.ID,
                orderName: ro.DOCQUEUE_ID.Code + "-" + ro.ORDNUMBER + "/" + ro.PERIOD_ID.Code,
                firmOffice_name: ro.FIRMOFFICE_ID.Name,
                city: ro.FIRMOFFICE_ID.ADDRESS_ID.City ? ro.FIRMOFFICE_ID.ADDRESS_ID.City : "Město neuvedeno",
                trace: ro.X_GUID,
                stateId: ro.PMSTATE_ID,
                selected: false,
                date: +date
            };
        })
        .sort((a, b) => a.firmOffice_name.localeCompare(b.firmOffice_name));
};


export const mapOrderToTraceChange = (order, targetTrace) => {

    return {
        id: order.id,
        orderName: order.orderName,
        city: order.city,
        firmOffice_name: order.firmOffice_name,
        date: order.date,
        traceFrom: order.trace,
        traceTo: targetTrace,
        groceries: order.groceries ? false : null,
        chilled: order.chilled ? false : null,
        fruitVeg: order.fruitVeg ? false : null,
        pastry: order.pastry ? false : null,
    }
};


const hasROGroceries = (receivedOrder) => {
    //row is like an item of the order, but in ABRA Gen, it is called row
    return receivedOrder.Rows.some((row) => {
        return row.ROWTYPE === 8
            && row.QUANTITY > 0
            && row.STORECARD_ID.Code.toString().substring(0, 3) !== "180"
            && row.STORECARD_ID.Code.toString().substring(0, 3) !== "185"
    })
};

const hasROChilled = (receivedOrder) => {
    return receivedOrder.Rows.some((row) => {
        return row.ROWTYPE === 8
            && row.QUANTITY > 0
            && row.STORECARD_ID.Code.toString().substring(0, 1) === "5"
    })
};

const hasROFruitVeg = (receivedOrder) => {
    return receivedOrder.Rows.some((row) => {
        return row.ROWTYPE === 8
            && row.QUANTITY > 0
            && (row.STORECARD_ID.Code.toString().substring(0, 3) === "180"
                || row.STORECARD_ID.Code.toString().substring(0, 3) === "185")
    })
};

const hasROPastry = (receivedOrder) => {
    return !!receivedOrder.isPastry;
};


export const mapResponseToOrder = (response) => {
    if (!response || response.length === 0) {
        return null;
    }
    const ro = response[0];
    return {
        id: ro.ID,
        orderName: ro.DOCQUEUE_ID.Code + "-" + ro.ORDNUMBER + "/" + ro.PERIOD_ID.Code,
        firm_name: ro.FIRM_ID.Name,
        firmOffice_name: ro.FIRMOFFICE_ID.Name,
        weight: ro.weight,
        city: ro.FIRMOFFICE_ID.ADDRESS_ID.City ? ro.FIRMOFFICE_ID.ADDRESS_ID.City : "Město neuvedeno",
        street: ro.FIRMOFFICE_ID.ADDRESS_ID.Street ? ro.FIRMOFFICE_ID.ADDRESS_ID.Street : "Ulice neuvedena",
        postCode: ro.FIRMOFFICE_ID.ADDRESS_ID.Postcode ? ro.FIRMOFFICE_ID.ADDRESS_ID.Postcode : "Poštovní číslo neuvedeno",
        trace: ro.X_GUID,
        stateId: ro.PMSTATE_ID,
        groceries: hasROGroceries(ro),
        chilled: hasROChilled(ro),
        fruitVeg: hasROFruitVeg(ro),
        pastry: hasROPastry(ro),
        date: Date.parse(ro.Rows[0].DELIVERYDATE$DATE) + 60 * 60 * 1000, //adding 1 hour to the original date, because it is 23:00, but it should be the next day
        selected: false
    };
};


export const addProductGroupsToOrders = async (orders) => {
    const responseOrders = await fetchProductGroups(orders.map(ord => ord.id));

    return orders.map(order => {
        const responseOrder = responseOrders.find(respOrd => respOrd.ID === order.id);

        order.groceries = hasROGroceries(responseOrder);
        order.chilled = hasROChilled(responseOrder);
        order.fruitVeg = hasROFruitVeg(responseOrder)
        order.pastry = hasROPastry(responseOrder)

        return order;
    });
};