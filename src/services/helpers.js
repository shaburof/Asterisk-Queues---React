import { endpoint, debug, debugQueueList } from '../App';
const Axios = window.axios;

export const queueList = [
    { queue: '0908', queue_id: 20, description: 'обратные звонки VIP очереди' },
    { queue: '0909', queue_id: 19, description: 'обслуживание VIP клиентов' },
    { queue: '0990', queue_id: 21, description: 'выдача карт' },
    { queue: '0991', queue_id: 9, description: 'техподдержка по Банку' },
    { queue: '0992', queue_id: 10, description: 'техподдержка по Клиент-банку' },
    { queue: '0993', queue_id: 13, description: 'основная очередь 377-66-55' },
    { queue: '0994', queue_id: 14, description: 'обратный вызов для 377-66-55' },
    { queue: '0995', queue_id: 17, description: 'очередь консультации по кредитованию' },
    { queue: '0996', queue_id: 18, description: 'очередь техподдержки, консультация клиентов' },
]

export const checkPermissionsQueueListForCurrentUser = async () => {
    if (debugQueueList) return queueList;
    const allowQueueList = [];
    for (const item in queueList) {
        const queueNumber = `queue:${queueList[item].queue_id}`;
        let isAllow = await checkPermissions(queueNumber);
        isAllow && allowQueueList.push(queueList[item]);
    };
    return allowQueueList;
}

export const getData = async (queue, date) => {
    const data = await Axios({
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: endpoint,
        data: {
            params: {
                param: 'queue',
                values: { date: date, queue: queue }
            }
        },
        withCredentials: true
    });
    // console.log(data.data);
    return data;

}

export const getRecord = async (uniqueid) => {
    const devEndpoint2 = 'http://opinion.local/opinion/router/web.php';
    const data = await Axios({
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: endpoint,
        data: {
            params: {
                param: 'queuegetrecord',
                values: { uniqueid: uniqueid }
            }
        },
        withCredentials: true
    });

    return data;
}

export const login = () => {
    const endpoint2 = 'http://192.168.0.60/opinion/router/web2.php';
    Axios({
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: endpoint,
        data: {
            params: {
                param: 'login',
                values: { name: 'admin', password: 'rfgbnjirf' }
            }
        },
        withCredentials: true
    }).then((result) => {
        console.log('result: ', result);
        debug && console.log('login result: result: ', result.data);

    }).catch((err) => {
        console.log('login error: ', err);

    });
}

export const logout = () => {
    const Axios = window.axios;
    Axios({
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: endpoint,
        data: {
            params: {
                param: 'logout',
            }
        },
        withCredentials: true
    }).then((result) => {
        debug ? console.log('result: ', result.data) : window.location.replace("/opinion/auth.html");

    }).catch((err) => {
        console.log('err: ', err);

    });
}

export const getCurrentDateForInputFormat = () => {
    return (new Date()).toISOString().substring(0, 10);
}

export const checkPermissions = (permission) => {
    return new Promise((resolve, reject) => {
        // const endpoint = 'http://opinion.local/opinion/router/web.php';
        Axios({
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            url: endpoint,
            data: {
                params: {
                    param: 'check permissions',
                    values: { permissions: permission }
                }
            },
            withCredentials: true
        }).then((result) => {
            const status = result.data;
            resolve(status.content);

        }).catch((err) => {
            debug && console.log('err: ', err.response);
            resolve(false);
        });
    });
}

export const checkSession = () => {
    const Axios = window.axios;
    // const endpoint = 'http://opinion.local/opinion/router/web.php';
    Axios({
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: endpoint,
        data: {
            params: {
                param: 'check session',
            }
        },
        withCredentials: true
    }).then((result) => {
        const status = result.data.content;
        if (status.active === false) {
            debug
                ? console.log('session not active REDIRECT TO LOGIN PAGE')
                : window.location.replace("/opinion/auth.html");
        } else debug && console.log('check session: SESSION ACTIVE');
    }).catch((err) => {
        console.log('err: ', err);

    });

}


export const dateIntervalToString = (data1, data2) => {
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    const interval = (d2 - d1) / 1000;
    const hours = Math.floor(interval / 60 / 60);
    const minutes = Math.floor(interval / 60 - (hours * 60));
    const sec = interval - (minutes * 60 + hours * 60 * 60);
    let dataString = '';
    hours > 0 && (dataString += `${hours}ч. `);
    minutes > 0 && (dataString += `${minutes}м.`);
    sec > 0 && (dataString += `${sec}с. `);
    return dataString;
}

export const numberToStringTime = (sec_num) => {
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    let hoursString = hours ? hours + 'ч.' : '';
    let minutesString = minutes ? minutes + 'мин.' : '';
    let secondsString = seconds ? seconds + 'c.' : '';

    return hoursString + minutesString + secondsString;
}