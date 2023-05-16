import {SelectList} from "react-native-dropdown-select-list";
import React from "react";
import {isTraceActive} from "../utils/helpers";

export default function SelectListBox({setSelected, unusedTracesDisabled, data}) {
    const choice29 = {
        key: '29',
        value: 'Trasa 29',
        disabled: unusedTracesDisabled && !isTraceActive(data, '29')
    };

    const choice30 = {
        key: '30',
        value: 'Trasa 30',
        disabled: unusedTracesDisabled && !isTraceActive(data, '30')
    };

    const selectChoices = Array.from({length: 20}, (v, i) => {
        const key = (i + 1).toString();
        return {
            key: key,
            value: `Trasa ${key}`,
            disabled: unusedTracesDisabled && !isTraceActive(data, `${key}`)
        };
    }).concat(choice29, choice30);

    selectChoices.unshift({
        key: '0',
        value: 'Bez přiřazení',
        disabled: unusedTracesDisabled && !isTraceActive(data, `0`) && !isTraceActive(data, '')
    });


    return (
        <SelectList
            setSelected={setSelected}
            data={selectChoices}
            search={false}
            boxStyles={{borderRadius: 10, backgroundColor: '#F4F3F3'}}
            dropdownStyles={{backgroundColor: '#F4F3F3'}}
            defaultOption={{key: '1', value: 'Trasa 1'}}
        />
    )
}
