import React from 'react';
import Info from '../info/Info';

const Infos = ({ data, downloadHandler, allowDownload }) => {

    return <section className="operator__infos">
        <div className="operator__answerarea">
            <Info classN="operator__answerarea" title="отвечено" value={data.answeredCalls} />
        </div>
        <div className="operator__pausearea">
            <Info classN="operator__answerarea" title="на паузе" value={data.pausedCount} />
            <Info classN="operator__answerarea" title="время на паузе" value={data.totalTimeInPause} />
        </div>
        <div className="operator__connectarea">
            <Info classN="operator__answerarea" title="общее время общения" value={data.totalTimeInConnect} />
            <Info classN="operator__answerarea" title="среднее время на звонок" value={data.avgTotalTimeInConnect} />
        </div>
        <div className="operator__mostarea">
            <Info classN="operator__answerarea" title="самый долгий"
                value={data.mostLongConversation}
                download={allowDownload && { uniqueid: data.mostLongConversationWith, ext: data.extension }}
                downloadHandler={allowDownload && downloadHandler} />
            <Info classN="operator__answerarea" title="самый короткий"
                value={data.mostShortConversation}
                download={allowDownload && { uniqueid: data.mostShortConversationWith, ext: data.extension }}
                downloadHandler={allowDownload && downloadHandler} />
        </div>
    </section>
}

export default Infos;