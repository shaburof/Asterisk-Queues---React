import React, { useEffect, useState } from 'react';
import Dashboard from './components/dashboard/dashboard';
import Form from './components/form/form';
import Spinner from './components/spinner/spinner';
import Message from './components/message/message';
import Logout from './components/logout/logout';
import { getData, getCurrentDateForInputFormat, getRecord, checkPermissions, checkSession } from './services/helpers';

function App() {
    const [queue, setQueue] = useState();
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);
    const [busy, setBusy] = useState(false);
    const [queueNumber, setQueueNumber] = useState(); // for debug
    const [date, setDate] = useState(getCurrentDateForInputFormat());
    const [allowDownload, setDownload] = useState(false);

    useEffect(() => {
        (async () => {
            checkSession();
            const queuePermission = await checkPermissions('queue');
            if (!queuePermission) {
                debug
                    ? console.log('section dcalls not allow for current user: REDIRECT TO LOGIN PAGE')
                    : window.location.replace("/opinion/auth.html");
            }
            const downloadPermission = await checkPermissions('download');
            setDownload(downloadPermission);
        })()
    }, []);

    useEffect(() => {
        if (date && queueNumber) {
            setReady(true);
        } else setReady(false);
    }, [date, queueNumber]);

    const onClickSearchHandler = async (e) => {
        e.preventDefault();
        if (!ready || loading) return false;
        setError(false);
        try {
            setLoading(true);
            const result = await getData(queueNumber, date);
            debug && console.log('result: ', result);

            setQueue(result.data);
            setLoading(false);
        } catch (e) {
            console.log(e);
            console.log(e.response);
            setLoading(false);
            setError(true);
        }
    }

    const downloadHandler = async (uniqueid, ext) => {
        console.log('ext: ', ext);
        if (busy) return false;
        try {
            setBusy(true);
            const result = await getRecord(uniqueid);
            console.log('result: ', result);
            const file = result.data.file;
            debug
                ? console.log('ext: ' + ext + ',uniqueid: ' + uniqueid + ', address: /opinion/helpers/downloadRecord.php?file=' + file + '&extension=' + ext)
                : window.location = '/opinion/helpers/downloadRecord.php?file=' + file + '&extension=' + ext;
            setBusy(false);
        } catch (e) {
            console.log(e);
            setBusy(false);
        }
    }

    const setDate_withCheck = (date) => {
        if (new Date(date) > (new Date())) setDate(getCurrentDateForInputFormat());
        else setDate(date);
    }

    const setQueueForm = queue => {
        setQueueNumber(queue);
    }


    return (<>
        <Logout />
        <div className="container">
            <div className="row">
                <div className="col-sm-12 centered" style={{ marginTop: '35px' }}>
                    <h2>Информация по телефонным очередям</h2>
                    <hr />
                </div>
            </div>
        </div>
        <div className="App">
            <Form setQueueForm={setQueueForm} date={date}
                setDate_withCheck={setDate_withCheck} loading={loading} ready={ready} onClickSearchHandler={onClickSearchHandler} />
            {loading
                ? <div className="col-sm-12 centered"><Spinner /></div>
                : queue && !error
                    ? <Dashboard data={{ downloadHandler: downloadHandler, allowDownload: allowDownload, ...queue }} />
                    : ''}
            {error && <div className="col-sm-12 centered"><Message message="что-то пошло не так" /></div>}
        </div>
    </>
    );
}

export const debug = true;
export const debugQueueList = true;
const devEndpoint = 'http://localhost:8080/opinion/test.php';
const devEndpoint2 = 'http://ipAddress/opinion/router/web.php';
const productionEndpoint = 'http://ipAddress/opinion/router/web.php';
const productionEndpoint2 = '/opinion/router/web.php';

export const endpoint = debug ? devEndpoint2 : productionEndpoint;

export default App;
