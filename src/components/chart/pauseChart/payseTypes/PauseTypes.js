import React from 'react';
import { numberToStringTime } from '../../../../services/helpers';

const PauseTypes = ({ pauseTypesArchive }) => {
    // console.log(pauseTypesArchive);
    const typesArray = [];
    for (const type in pauseTypesArchive) {
        let info = pauseTypesArchive[type];
        let _type = info.type ? info.type : 'пауза';
        typesArray.push({
            type: _type, value: info.value,
            duration: info.duration,
            durationToString: numberToStringTime(info.duration)
        });
    }
    typesArray.sort((a, b) => {
        // console.log('a: ', a);
        if (a.value > b.value) return -1;
        else if (a.value < b.value) return 1;
        else return 0;
    });

    return <>
        <div className="pausetypes">
            {typesArray.length > 0
                && typesArray.map(type => {
                    return <div key={type.type} className="pausetype">
                        <p className="pausetypes__name">{type.type}:</p>
                        <div className="pausetypes__value">
                            <span className="pausetypes__duration">{type.durationToString}</span>
                            <span className="pausetypes__count">{type.value}</span>
                        </div>
                    </div>
                })}
        </div>
    </>
}

export default PauseTypes;