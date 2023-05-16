export const getFetchOrdersRequestBody = (date) => {
    let year = date.getUTCFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + (date.getUTCDate())).slice(-2);

    return {
        "class": "receivedorders",
        "select": [
            "ID",
            "trace_id",
            "state_id",
            "ORDNUMBER",
            "isPastry",
            {
                "name": "FIRMOFFICE_ID",
                "value": {
                    "query": {
                        "select": [
                            "Name",
                            {
                                "name": "ADDRESS_ID",
                                "value": {
                                    "select": ["City"]
                                }
                            }
                        ]
                    }
                }
            },
            {
                "name": "DOCQUEUE_ID",
                "value": {
                    "select": ["Code"]
                }
            },
            {
                "name": "PERIOD_ID",
                "value": {
                    "select": ["Code"]
                }
            },
            {
                "name": "Rows",
                "value": {
                    "query": {
                        "select": [
                            "DELIVERYDATE$DATE",
                        ],
                        take: 1
                    }
                }
            }
        ],

        "where": "exists(Rows WHERE DELIVERYDATE$DATE=timestamp'" + year + "-" + month + "-" + day + "')"

    };
};

export const getFetchOrderRequestBody = (id) => {
    return {
        "class": "receivedorders",
        "select": [
            "ID",
            "trace_id",
            "state_id",
            "ORDNUMBER",
            "isPastry",
            "weight",
            {
                "name": "FIRM_ID",
                "value": {
                    "select": ["Name"]
                }
            },
            {
                "name": "FIRMOFFICE_ID",
                "value": {
                    "query": {
                        "select": [
                            "Name",
                            {
                                "name": "ADDRESS_ID",
                                "value": {
                                    "select": ["Street", "City", "Postcode"]
                                }
                            }
                        ]
                    }
                }
            },
            {
                "name": "DOCQUEUE_ID",
                "value": {
                    "select": ["Code"]
                }
            },
            {
                "name": "PERIOD_ID",
                "value": {
                    "select": ["Code"]
                }
            },
            {
                "name": "Rows",
                "value": {
                    "query": {
                        "select": [
                            "DELIVERYDATE$DATE",
                            "ROWTYPE",
                            "QUANTITY",
                            {
                                "name": "STORECARD_ID",
                                "value": {
                                    "select": ["Code"]
                                }
                            }
                        ]
                    }
                }
            }
        ],

        "where": "ID eq '" + id + "'"

    }
};

export const getFetchOrderQRRequestBody = (data) => {
    const [docqueue, ordNumber, period] = data.split(/-|\//);
    return {
        "class": "receivedorders",
        "select": [
            "ID",
            "trace_id",
            "state_id",
            "ORDNUMBER",
            "isPastry",
            "weight",
            {
                "name": "FIRM_ID",
                "value": {
                    "select": ["Name"]
                }
            },
            {
                "name": "FIRMOFFICE_ID",
                "value": {
                    "query": {
                        "select": [
                            "Name",
                            {
                                "name": "ADDRESS_ID",
                                "value": {
                                    "select": ["Street", "City", "Postcode"]
                                }
                            }
                        ]
                    }
                }
            },
            {
                "name": "DOCQUEUE_ID",
                "value": {
                    "select": ["Code"]
                }
            },
            {
                "name": "PERIOD_ID",
                "value": {
                    "select": ["Code"]
                }
            },
            {
                "name": "Rows",
                "value": {
                    "query": {
                        "select": [
                            "DELIVERYDATE$DATE",
                            "ROWTYPE",
                            "QUANTITY",
                            {
                                "name": "STORECARD_ID",
                                "value": {
                                    "select": ["Code"]
                                }
                            }
                        ]
                    }
                }
            }
        ],

        "where": "DOCQUEUE_ID.Code eq '" + docqueue + "' and ORDNUMBER eq '" + ordNumber +  "' and PERIOD_ID.Code eq '" + period + "'"

    }
}


export const getFetchProductGroupsBody = (ordersIds) => {
    const idsString = ordersIds.map(id => `'${id}'`).join(',');
    return {
        "class": "receivedorders",
        "select": [
            "ID",
            "isPastry",
            {
                "name": "Rows",
                "value": {
                    "query": {
                        "select": [
                            "ROWTYPE",
                            "QUANTITY",
                            {
                                "name": "STORECARD_ID",
                                "value": {
                                    "select": ["Code"]
                                }
                            }
                        ]
                    }
                }
            }
        ],

        "where": "ID in (" + idsString + ")"

    }
};


export const updateTracesInABRABody = (changes) => {
    let result = {
        "items": []
    };

    changes.forEach((change, index) => {
        let item = {
            "type": "update",
            "id": "id" + index,
            "data": {
                "class_id": "receivedorders",
                "obj_id": change.id,
                "object_data": {
                    "trace_id": change.traceTo
                },
                "query": {
                    "select": [
                        "id"
                    ]
                }
            }
        };
        result.items.push(item);
    });

    return result;
}