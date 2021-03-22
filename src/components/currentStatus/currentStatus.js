import React, { useEffect, useState } from 'react';
import Connect from './stats/connect';
import Pause from './stats/pause';
import RemoveMember from './stats/removeMember';
import Unpause from './stats/unpause';

const CurrentStatus = ({ data }) => {
    const [status, setStatus] = useState([]);
    useEffect(() => {
        const _status = [];
        for (const item in data.data) {
            let stat = data.data[item].currentStatus;
            let statusName = data.data[item].currentStatus;

            if (stat === 'ADDMEMBER' || stat === 'COMPLETECALLER' || stat === 'COMPLETEAGENT' || stat === 'UNPAUSE') {
                stat = <Unpause />;
                statusName = 'UNPAUSE';
            }
            else if (stat === 'PAUSE') stat = <Pause />;
            else if (stat === 'REMOVEMEMBER') stat = <RemoveMember />;
            else if (stat === 'CONNECT') stat = <Connect />;
            else stat = null;


            _status.push(
                {
                    agent: item,
                    statusName: statusName,
                    status: stat,
                    ext: data.data[item].extension
                });
        }
        _status.sort((a, b) => {
            const s1 = a.statusName;
            const s2 = b.statusName;
            if (s1 > s2) return -1;
            else if (s1 < s2) return 1;
            else return 0;
        });
        setStatus(_status);
    }, []);

    return <div className="dashinfo__currentstatus">
        <p className="dashinfo__title">Текущий статус</p>
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">номер</th>
                    <th scope="col">орератор</th>
                    <th scope="col">статус</th>
                </tr>
            </thead>
            <tbody>
                {status.map(item => {
                    return <tr key={item.ext}>
                        <td>{item.ext}</td>
                        <td>{item.agent}</td>
                        <td>{item.status}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

export default CurrentStatus;