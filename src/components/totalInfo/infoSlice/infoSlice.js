import React from 'react';

const InfoSlice = ({ title, value, download, downloadHandler, agent }) => {

    return <div className="totalInfo__stat">
        {(download && value) ? <img onClick={() => downloadHandler(download.uniqueid, download.ext)} src="/opinion/images/download_white.png" className="totalInfo__download" alt="" /> : ''}
        <p className="totalInfo__stat__title">{title}</p>
        <p className="totalInfo__stat__value">{value}</p>
        {agent && <div className="totalInfo__operator">{agent}</div>}
    </div>
}

export default InfoSlice;