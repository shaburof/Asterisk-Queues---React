import React from 'react';
import { logout } from '../../services/helpers';

const Logout = (props) => {

    const onClickHandler = () => {
        logout();
    }

    return <div className="autorization">
        <a onClick={onClickHandler} id="logout" href="#">выход</a>
    </div>
}

export default Logout;