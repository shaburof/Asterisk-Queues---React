import React, { useState, useEffect } from 'react';
import InfoSlice from './infoSlice/infoSlice';
import InfoSliceSwitch from './infoSliceSwitch/InfoSliceSwitch';

const TotalInfo = ({ data }) => {

    const downloadHandler = data.downloadHandler;
    const allowDownload = data.allowDownload;

    const countsClientTimesInQueueMoreThanOne = () => {
        return data.countClientTimeInQueueLargeThenThreeMinute > 0 || data.countClientTimeInQueueLargeThenFiveMinute;
    }
    const [countClientTimeInQueue, setCountClientTimeInQueue] = useState({
        value: data.countClientTimeInQueueLargeThenOneMinute,
        state: 'ONE',
        description: 'колличество ожидавших в очереди более одной минуты'
    });

    const countClientTimeInQueueSwitchHandler = () => {
        if (countClientTimeInQueue.state === 'ONE') {
            setCountClientTimeInQueue({ value: data.countClientTimeInQueueLargeThenThreeMinute, state: 'THREE', description: 'колличество ожидавших в очереди более трех минут' });
        } else if (countClientTimeInQueue.state === 'THREE') {
            setCountClientTimeInQueue({ value: data.countClientTimeInQueueLargeThenFiveMinute, state: 'FIVE', description: 'колличество ожидавших в очереди более пяти минут' });
        } else if (countClientTimeInQueue.state === 'FIVE') {
            setCountClientTimeInQueue({ value: data.countClientTimeInQueueLargeThenOneMinute, state: 'ONE', description: 'колличество ожидавших в очереди более одной минуты' });
        }
    }

    useEffect(() => {
        if (countClientTimeInQueue.value === 0 && countClientTimeInQueue.state !== 'ONE') countClientTimeInQueueSwitchHandler();
    }, [countClientTimeInQueue]);


    return <>
        <section className="totalinfo">
            <InfoSlice title="принято вызовов" value={data.totalAnswerCalls} />
            <InfoSlice title="не дождавшиеся ответа" value={data.countAbandonCalls} />
            <InfoSlice title="общее время" value={data.totalTimeInConversation} />
            <InfoSlice title="в среднем на один вызов" value={data.avgTimeInConversation} />
            <InfoSlice title="среднее время в очереди до ответа оператора" value={data.avgClientTimeInQueue} />
            {countsClientTimesInQueueMoreThanOne()
                ? <InfoSliceSwitch title={countClientTimeInQueue.description}
                    value={countClientTimeInQueue.value} switchHandler={countClientTimeInQueueSwitchHandler} />
                : <InfoSlice title="колличество ожидавших в очереди более одной минуты"
                    value={data.countClientTimeInQueueLargeThenOneMinute} />}

            <InfoSlice title="дольше всех на паузе"
                value={data.mostLongOnPause.datetime}
                agent={data.mostLongOnPause.agent} />
            <InfoSlice title="самый длинный вызов"
                value={data.totalMostLongConversation.value}
                download={allowDownload && { uniqueid: data.totalMostLongConversation.uniqueid, ext: data.totalMostLongConversation.ext }}
                downloadHandler={allowDownload && downloadHandler}
                agent={data.totalMostLongConversation.agent} />
            <InfoSlice title="самый короткий вызов"
                value={data.totalMostShortConversation.value}
                download={allowDownload && { uniqueid: data.totalMostShortConversation.uniqueid, ext: data.totalMostShortConversation.ext }}
                downloadHandler={allowDownload && downloadHandler}
                agent={data.totalMostShortConversation.agent} />
        </section>
    </>
}

export default TotalInfo;