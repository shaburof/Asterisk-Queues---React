import React from 'react';

const Info = ({ title, value, download, downloadHandler }) => {

    return <div className="operator__info">
        <div className="operator__title">
            {(value && download) ? <img onClick={() => downloadHandler(download.uniqueid, download.ext)} className="operator__info--title-download" src="/opinion/images/download.png" alt="" /> : ''}
            {title}
        </div>
        <div className="operator__value">
            {value}
        </div>
    </div>
}

export default Info;