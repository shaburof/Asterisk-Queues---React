import React, { useEffect } from 'react';
import PauseChart from './pauseChart/PauseChart';

const Chart = ({ data }) => {
    const pausedOperators = { ...data.data };
    const pauseChartData = [];
    for (const item in pausedOperators) {
        pauseChartData.push(pausedOperators[item])
    }

    return <>
        {pauseChartData.map(operator => {
            return <PauseChart data={operator}
                downloadHandler={data.downloadHandler}
                allowDownload={data.allowDownload}
                key={operator.name} />
        })}
    </>
}

export default Chart;
