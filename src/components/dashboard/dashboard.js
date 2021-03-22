import React from 'react';
import CurrentStatus from '../currentStatus/currentStatus';
import AnswerChart from '../answerChart/answerChart';
import Chart from '../chart/Chart';
import TotalInfo from '../totalInfo/totalInfo';

const Dashboard = ({ data }) => {

    return <>
        <TotalInfo data={data} />
        <div className="dashinfo">
            <CurrentStatus data={data} />
            <AnswerChart data={data} />
        </div>
        <Chart data={data} />
    </>
}

export default Dashboard;