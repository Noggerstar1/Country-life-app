
export const isTraceActive = (orders, trace) => {
    if (!orders) {
        return false;
    }
    let result = false;
    orders.forEach(order => {
        if (order.trace === trace) {
            result = true;
        }
    });
    return result;
}


const hasIdDuplicity = (array1, array2) => {
    return array1.some((obj1) => {
        return array2.some((obj2) => obj2.id === obj1.id);
    });
};

const sameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

export const validationErrorMsg = (ordersToUpdate, currentChanges, currentTrace) => {
    if (currentChanges && currentChanges.length > 0) {
        currentChanges = JSON.parse(currentChanges);
    }
    let errorMsg = "";
    if (ordersToUpdate.some(order => order.trace === currentTrace)) {
        errorMsg = "Nelze přeřadit na trasu shodnou s trasou objednávky"
    } else if (!currentChanges || currentChanges.length === 0) {
        return errorMsg;
    } else if (ordersToUpdate.some(order => !sameDay(new Date(currentChanges[0].date), new Date(order.date)))) {
        errorMsg = "Nelze přeřadit objednávky z různých dnů. Odbavte nejprve právě probíhající změny tras"
    } else if (hasIdDuplicity(currentChanges, ordersToUpdate)) {
        errorMsg = "Některá z Vámi vybraných objednávek se již zpracovává. Odbavte nejprve právě probíhající změny tras"
    }
    return errorMsg;
}
