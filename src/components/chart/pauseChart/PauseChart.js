import React, { useEffect } from 'react';
import Infos from '../infos/Infos';
import PauseTypes from './payseTypes/PauseTypes';
const Highcharts = window.Highcharts;

const PauseChart = ({ data, downloadHandler, allowDownload }) => {
    const startWorkingDay = 8;
    const pauseData = data.pause[0];

    const style = {
        width: '100%',
        height: '300px',
    };

    useEffect(() => {
        const prepared = prepareData(pauseData, data);
        chart1(prepared, { name: data.name, ext: data.extension });
    }, []);

    const prepareData = (data, originalData) => {
        const currentPauseStatus = originalData.currentStatus === 'PAUSE';
        const lastEnterInPause = originalData.lastEnterInPause;

        const login = originalData.queue.login;
        const logout = originalData.queue.logout;

        if (data.length === 0) {
            const startTime = login ? new Date(login).getTime() : new Date().setHours(startWorkingDay, 0, 0);
            const finishTime = logout ? new Date(logout).getTime() : new Date().getTime();

            if (currentPauseStatus) {

                return [
                    //разобраться с этим, чтоб последняя пауза отображалась корректно
                    { x: startTime, y: 1, interval: null },
                    { x: (new Date(lastEnterInPause)).getTime(), y: 1, interval: 'pauseStart' },
                    { x: (new Date(lastEnterInPause)).getTime(), y: -1, interval: 'pauseStart' },
                    { x: (new Date()).getTime(), y: -1, interval: 'pauseStart' }
                    // { x: startTime, y: 1, interval: null },
                    // { x: finishTime, y: 1, interval: null },
                ]
            } else {
                return [
                    { x: startTime, y: 1, interval: null },
                    { x: finishTime, y: 1, interval: null },
                ];
            }
            // return [
            //     { x: new Date().setHours(startWorkingDay, 0, 0), y: 1, interval: null },
            //     // { x: new Date().setHours(24, 0, 0), y: 1, interval: null }
            //     { x: new Date().getTime(), y: 1, interval: null }
            // ];
        }

        const now = new Date().setHours(0, 0, 0);
        const temp = [];
        const initialDate = new Date(data[0].start);

        const workDay = new Date(data[0].start);
        workDay.setHours(startWorkingDay, 0, 0);

        const morning = new Date(data[0].start);

        if (initialDate > workDay) {
            morning.setHours(startWorkingDay, 0, 0);
        } else {
            morning.setHours(0, 0, 0);
        }
        if (login) temp.push({ x: new Date(login).getTime(), y: 1, interval: null });
        else temp.push({ x: morning.getTime(), y: 1, interval: null });

        // temp.push({ x: morning.getTime(), y: 1, interval: null });

        for (const item of data) {
            temp.push({ x: new Date(item.start).getTime(), y: 1, interval: item.interval, pauseType: item.pauseType });
            temp.push({ x: new Date(item.start).getTime(), y: -1, interval: item.interval, pauseType: item.pauseType });
            temp.push({ x: new Date(item.finish).getTime(), y: -1, interval: item.interval, pauseType: item.pauseType });
            temp.push({ x: new Date(item.finish).getTime(), y: 1, interval: item.interval, pauseType: item.pauseType });
        }
        if (new Date(data[0].start).getTime() < now) {
            // temp.push({ x: new Date(data[0].start).setHours(24, 0, 0), y: 1, interval: null });
            if (logout) temp.push({ x: new Date(logout).getTime(), y: 1, interval: null });
            else if (currentPauseStatus) {
                const evening = new Date(data[0].start);
                evening.setHours(24, 0);
                temp.push({ x: (new Date(lastEnterInPause)).getTime(), y: 1, interval: 'pauseStart' });
                temp.push({ x: (new Date(lastEnterInPause)).getTime(), y: -1, interval: 'pauseStart' });
                temp.push({ x: evening, y: -1, interval: 'pauseStart' });
            }
            else {
                const evening = new Date(data[0].start);
                evening.setHours(24, 0);
                temp.push({ x: evening, y: 1, interval: null });
            }
        } else {
            if (logout) {
                temp.push({ x: (new Date(logout)).getTime(), y: 1, interval: null });
            }
            else if (currentPauseStatus) {
                temp.push({ x: (new Date(lastEnterInPause)).getTime(), y: 1, interval: 'pauseStart' });
                temp.push({ x: (new Date(lastEnterInPause)).getTime(), y: -1, interval: 'pauseStart' });
                temp.push({ x: (new Date()).getTime(), y: -1, interval: 'pauseStart' });
            }
            else temp.push({ x: (new Date()).getTime(), y: 1, interval: null });
        }
        // if (initialDate > morning) temp.push({ x: (new Date()).getTime(), y: 1, interval: null });
        // if (morning.getTime() < now) {
        //     temp.push({ x: (new Date()).getTime(), y: 1, interval: null });
        // }
        // else {
        //     const evening = new Date(data[0].start);
        //     evening.setHours(24, 0);
        //     temp.push({ x: evening.getTime(), y: 1, interval: null });
        // }
        // temp.forEach(el => {
        //     console.log(new Date(el.x));
        //     console.log(el.y);
        //     console.log('---------------------------------');
        // });
        return temp;
    };

    return <>
        <div className="operator__dashboard">
            <div className="operator__titlearea">
                <p className="operator__titlearea__login">{data.queue.login && `вход:  ${data.queue.login.split(' ')[1].substr(0, 5)}`}</p>
                <p className="operator__titlearea__agent">{`${data.name} (${data.extension})`}</p>
                <p className="operator__titlearea__logout">{data.queue.logout && `выход:  ${data.queue.logout.split(' ')[1].substr(0, 5)}`}</p>
            </div>
            <div className="operator">
                <section className="operator__pause_area">
                    <div id={data.name} style={style}></div>
                    <PauseTypes pauseTypesArchive={data.pauseTypesArchive} />
                </section>
                <Infos data={data} downloadHandler={downloadHandler} allowDownload={allowDownload} />
                <hr />
            </div>
        </div>
    </>
}

export default PauseChart;

const chart1 = (chartData, operator) => {
    Highcharts.chart(operator.name, {
        time: {
            timezoneOffset: -5 * 60
        },
        chart: {
            type: 'area',
            zoomType: 'x',
        },
        credits: { enabled: false },
        exporting: {
            enabled: false
        },
        title: {
            text: '',
        },
        subtitle: {
            text: `${operator.name} (${operator.ext})`,
            style: {
                color: 'white',
            }
        },
        yAxis: {
            title: {
                text: ' '
            },
            labels: {
                step: 3,
                formatter: function () {
                    let operatorStatus = this.axis.defaultLabelFormatter.call(this);
                    if (operatorStatus == 0) return '';
                    else if (operatorStatus > 0) return 'в очереди';
                    else if (operatorStatus < 0) return 'на паузе';
                }
            }
        },
        tooltip: {
            useHTML: true,
            formatter: function (tooltip) {
                const hour = new Date(this.x).getHours();
                const _minutes = new Date(this.x).getMinutes();
                const minutes = _minutes > 9 ? _minutes : '0' + _minutes;
                let interval = '';
                let pauseType = this.point.pauseType ? '<span style="color:#f64242;font-weight:bold;">' + this.point.pauseType + '</span><br>' : '';
                if (this.point.interval === 'pauseStart') interval = '';
                else interval = this.point.interval !== null ? ('пауза: ' + this.point.interval + '<br>') : '';
                return interval + pauseType + '<b>' + hour + '</b>:<b>' + minutes + '</b>';
            }
        },
        xAxis: [
            {
                "type": "datetime",
                "labels": {
                    "format": "{value:%H:%M}",
                },
            },
        ],
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                lineWidth: 0,
                color: '#FF0000',
            },
        },
        legend: {
            symbolHeight: .001,
            symbolWidth: .001,
            symbolRadius: .001,
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 35,
            floating: true,
            borderWidth: 0,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
        },
        series: [
            {
                name: '',
                color: {
                    linearGradient: [100, 0, 100, 200],
                    stops: [
                        [0, 'rgb(62,135,246)'],
                        [1, '#ffffff']
                    ]
                },
                negativeColor: {
                    linearGradient: [0, 100, 0, 300],
                    stops: [
                        [0, '#ffffff'],
                        [1, '#ff0000']
                    ]
                },
                data: chartData,
            },
        ]
    });
}