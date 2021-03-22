import React from 'react';

const Message = ({ message }) => {

    const messageText = message ? message : 'default message';

    return <section className="message">
        <p className="message__text--title">{messageText}</p>
        <p className="message__text--paragraph">обновите страницу и попробуйте еще раз</p>
    </section>
}

export default Message;