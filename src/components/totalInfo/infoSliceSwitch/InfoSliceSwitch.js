import React, { useState, useRef } from 'react';
import classes from './card.module.css';

const InfoSliceSwitch = ({ title, value, download, downloadHandler, agent, switchHandler }) => {

    const cardRef = useRef(null);
    const dataRef = useRef(null);

    const switchCard = () => {
        let element = cardRef.current;
        let angine = element.style.transform.match(/\d+/);

        let elementData = dataRef.current;
        elementData.style.opacity = 0;
        setTimeout(() => {
            elementData.style.opacity = 1;
        }, 200);

        if (angine === null) {
            element.style.transform = "rotateY(180deg)"
        } else {
            element.style.transform = "rotateY(" + (Number.parseInt(angine[0]) + 180) + "deg)"
        }

        switchHandler();
    }


    return <div className={classes.card}>
        <div ref={cardRef} className={classes.card__inner}></div>
        <div ref={dataRef} className={classes.cardData}>
            <div onClick={() => switchCard()} className="circularbutton">
                <img className="circularbutton__image" src="/opinion/images/circular.png" />
            </div>
            {(download && value) ? <img onClick={() => downloadHandler(download.uniqueid, download.ext)} src="/opinion/images/download_white.png" className="totalInfo__download" alt="" /> : ''}
            <p className="totalInfo__stat__title">{title}</p>
            <p className="totalInfo__stat__value">{value}</p>
            {agent && <div className="totalInfo__operator">{agent}</div>}
        </div>
    </div>
}

export default InfoSliceSwitch;