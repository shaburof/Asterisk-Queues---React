import React, { useEffect } from 'react';
const Highcharts = window.Highcharts;

const AnswerChart = ({ data }) => {

    useEffect(() => {

        const result = prepareForAnswersChart(data);
        chart(result);
    }, []);

    const prepareForAnswersChart = ({ data }) => {

        let isConnectInThisQueue = false;    // для проверка что у операторов есть отвеченные звонки

        let answers = [];
        let currentStartDate = null;
        let currentFinishDate = null;
        let firstCall = null;
        let stepInDataSterArray = 24;

        let dataStepArray = [];
        let hourStep = 0;
        const finishArray = [];
        for (const item in data) {


            if (!currentStartDate && data[item].connect[0].length > 0) {
                currentStartDate = new Date(data[item].connect[0][0].start);
                firstCall = new Date(currentStartDate);
                currentFinishDate = new Date(data[item].connect[0][0].start);
                currentStartDate.setHours(0, 0, 0);

                const now = new Date().setHours(0, 0, 0);
                if (firstCall.getTime() > now) {
                    currentFinishDate = new Date();
                    stepInDataSterArray = currentFinishDate.getHours();
                }
                else currentFinishDate.setHours(24, 0, 0);
                isConnectInThisQueue = true;
            } else if (isConnectInThisQueue !== true) {
                isConnectInThisQueue = false;
            }
            answers = [...answers, ...data[item].connect[0]];

        }

        // проверяем что у операторов вообще есть отвечеррые звонки и есть из чего строить график
        if (!isConnectInThisQueue) return false;

        answers.sort((a, b) => {
            const d1 = new Date(a.start);
            const d2 = new Date(b.start);
            if (d1 > d2) return 1;
            else if (d1 < d2) return -2;
            else return 0;
        });

        do {
            let increaseStep = hourStep++;
            // dataStepArray.push(currentStartDate.setHours(increaseStep, 0, 0));
            dataStepArray.push(currentStartDate.setHours(increaseStep, 0, 0));
            // dataStepArray.push(currentStartDate.setHours(increaseStep, 15, 0));
            // dataStepArray.push(currentStartDate.setHours(increaseStep, 30, 0));
            // dataStepArray.push(currentStartDate.setHours(increaseStep, 45, 0));
        } while (hourStep !== stepInDataSterArray)

        // for debuging purposes
        // dataStepArray.forEach(element => console.log(new Date(element)));

        dataStepArray.forEach(element => {
            const isLastElement = dataStepArray[dataStepArray.length - 1] === element;
            // const startCollectTime = element;
            const startCollectTime0 = new Date(element).setMinutes(0);
            // const startCollectTime15 = new Date(element).setMinutes(15);
            const startCollectTime30 = new Date(element).setMinutes(30);
            // const startCollectTime45 = new Date(element).setMinutes(45);
            // let step = new Date(startCollectTime).getHours();
            let step = new Date(element).getHours();
            // step++;
            // const finishCollectTime = new Date(element).setHours(++step, 0, 0);
            const finishCollectTime0 = new Date(element).setHours(step, 30, 0);
            // const finishCollectTime15 = new Date(element).setHours(step, 30, 0);
            // const finishCollectTime30 = new Date(element).setHours(step, 45, 0);
            const finishCollectTime30 = new Date(element).setHours(++step, 0, 0);
            // 26.03.2020 start
            const startCollectTimeAdditional = finishCollectTime30;
            // console.log('startCollectTimeAdditional: ', new Date(startCollectTimeAdditional));
            const finishCollectTimeAdditional = new Date(finishCollectTime30).setMinutes(30);
            // console.log('finishCollectTimeAdditional: ', new Date(finishCollectTimeAdditional));
            // 26.03.2020 finish
            // console.log('finishCollectTime: ', new Date(finishCollectTime));

            let answersCount0 = 0;
            let answersCount15 = 0;
            let answersCount30 = 0;
            // 26.03.2020 start
            let answersCountAdditional = 0
            // 26.03.2020 finish
            let answersCount45 = 0;
            answers.forEach(ans => {
                const answerTime = (new Date(ans.start)).getTime();
                if (startCollectTime0 <= answerTime && finishCollectTime0 >= answerTime) answersCount0++;
                // if (startCollectTime15 <= answerTime && finishCollectTime15 >= answerTime) answersCount15++;
                if (startCollectTime30 <= answerTime && finishCollectTime30 >= answerTime) answersCount30++;
                // 26.03.2020 start
                if (startCollectTimeAdditional <= answerTime && finishCollectTimeAdditional >= answerTime) answersCountAdditional++;
                // 26.03.2020 finish
                // if (startCollectTime45 <= answerTime && finishCollectTime45 >= answerTime) answersCount45++;
            })
            finishArray.push([new Date(finishCollectTime0).getTime(), answersCount0]);
            // finishArray.push([new Date(finishCollectTime15).getTime(), answersCount15]);
            finishArray.push([new Date(finishCollectTime30).getTime(), answersCount30]);

            // 26.03.2020 start
            // добавляем дополнительные пол часы к подсчету колличества звонком только для последнего элемента, т.н. если последнее вермя для подсчета 10:00, то считам еще интервал с 10:00 по 10:30
            isLastElement && finishArray.push([new Date(finishCollectTimeAdditional).getTime(), answersCountAdditional]);
            // 26.03.2020 finish
            // finishArray.push([new Date(finishCollectTime45).getTime(), answersCount45]);
        });
        // finishArray.forEach(element => {
        //     console.log(new Date(element[0]));
        //     console.log(element[1]);
        // });
        return finishArray;
    }

    return <div className="answerchart" id="answerchart"></div>
}

export default AnswerChart;

const chart = data => {
    Highcharts.chart('answerchart', {
        time: {
            timezoneOffset: -5 * 60
        },
        chart: {
            type: 'area',
            zoomType: 'x'
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Принято звонков за выбранный период'
        },
        subtitle: {
            text: 'шаг выборки 30 минут'
        },
        xAxis: [
            {
                "type": "datetime",
                "labels": {
                    "format": "{value:%H:%M}",
                },
            }
        ],
        yAxis: {
            title: {
                text: 'колличество',
            }
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return (this.y != 0) ? this.y : "";
                    }
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '',
            // color: '#3856eb',
            data: data
        }]
    });
}