import React, { useEffect } from 'react';

const TotalPauseChart = ({ data }) => {
    const operators = data.data;
    let pausesList = [];
    useEffect(() => {

        let startDay = new Date();
        startDay.setHours(0, 0, 0);
        const finishDay = new Date();
        finishDay.setHours(1, 59, 0);


        const totalPause = [];
        // do {

        //     for (const item in operators) {
        //         let t1 = '';
        //         let t2 = '';
        //         let statusOperation = '';
        //         if (operators[item].currentstatus !== 'REMOVEMEMBER') {
        //             const pauses = operators[item].pause[0];
        //             for (const item of pauses) {
        //                 const operatorStartPause = new Date(item.start);
        //                 const operatorFinishPause = new Date(item.finish);
        //                 if (operatorStartPause > startDay) {
        //                     if (operatorStartPause < t1 || t1 === '') {
        //                         t1 = operatorStartPause;
        //                         statusOperation = 'pause';
        //                     };
        //                 }
        //                 if (operatorFinishPause > startDay) {
        //                     if (operatorFinishPause < t2 || t2 === '') {
        //                         t1 = operatorFinishPause;
        //                         statusOperation = '';
        //                     };
        //                 }
        //             }
        //             totalPause.push({ start: t1, finish: t2 });
        //         }
        //         console.log('totalPause: ', totalPause);
        //     }



        //     startDay.setMinutes(startDay.getMinutes() + 1);
        // } while (startDay <= finishDay);



    }, []);

    return <h1>totalPauseChart</h1>
}

export default TotalPauseChart;