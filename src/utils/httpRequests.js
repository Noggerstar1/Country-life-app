import base64 from "base-64";
import {
    getFetchOrderQRRequestBody,
    getFetchOrderRequestBody,
    getFetchOrdersRequestBody, getFetchProductGroupsBody, updateTracesInABRABody
} from "./requestsJSONBodies";


const encodedCredentials = base64.encode("username" + ':' + "heslo123");


export const fetchOrders = (date) => {
    const url = 'https://192.168.0.100:5860/cltest/query';
    return fetchAPI(url, getFetchOrdersRequestBody(date));
};

export const fetchOrder = (id) => {
    const url = 'https://192.168.0.100:5860/cltest/query';
    return fetchAPI(url, getFetchOrderRequestBody(id));
};

export const fetchOrderByQR = (data) => {
    const url = 'https://192.168.0.100:5860/cltest/query';
    return fetchAPI(url, getFetchOrderQRRequestBody(data))
};

export const fetchProductGroups = (orderIds) => {
    const url = 'https://192.168.0.100:5860/cltest/query';
    return fetchAPI(url, getFetchProductGroupsBody(orderIds));
};

export const updateTracesInABRA = (changes) => {
    const url = 'https://192.168.0.100:5860/cltest/batch';
    return fetchAPI(url, updateTracesInABRABody(changes))
};


export const fetchAPI = (url, body) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + encodedCredentials,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            timeout: 30000,
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Nepodařilo se spojit s ABRou');
                }
                return res.json();
            })
            .then(
                (result) => {
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
    });
};
