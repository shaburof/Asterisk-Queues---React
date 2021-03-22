import React, { useEffect, useState } from 'react';
import Spinner from '../spinner/spinner';
import { queueList, checkPermissionsQueueListForCurrentUser } from '../../services/helpers';

const Form = (props) => {
    const [queueListUpdated, setQueueListUpdated] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const list = [...(await checkPermissionsQueueListForCurrentUser())];
            list.unshift({ queue: null, description: '' });
            setQueueListUpdated(list);
            setLoading(false);
        })()
    }, []);

    const spinnerInCenter = <div className="row"><div className="col-sm-12 centered"><Spinner /></div></div>;

    return <div className="container">
        {loading
            ? spinnerInCenter
            : <form>
                <div className="row">
                    <div className="col-sm-9">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">выбор номера очереди</label>
                            <select className="form-control" onChange={e => props.setQueueForm(e.target.value)}>
                                {queueListUpdated && queueListUpdated.map(list => {
                                    if (list.queue === null) return <option key={list.queue} value={list.queue_id}>{list.description}</option>
                                    else return <option key={list.queue} value={list.queue_id}>{`(${list.queue}) ${list.description}`}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label htmlFor="inputDate">дата</label>
                            <input type="date" value={props.date} onChange={e => props.setDate_withCheck(e.target.value)} className="form-control text-center" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 centered">
                        <input onClick={props.onClickSearchHandler}
                            type="submit"
                            className={'btn btn-sm ' + (props.loading || !props.ready ? 'btn-secondary' : 'btn-primary')} value="ПОИСК" />
                    </div>
                </div>
            </form>}
    </div>
}

export default Form;