import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Data {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}

interface Props {
    className?: string;
    data: Data[]
}

export const BarChartCard: React.FC<Props> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                //width={'100%'}
                height={200}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" stackId="a" fill="#3333ff" />
                <Bar dataKey="uv" stackId="a" fill="#ff9900" />
            </BarChart>
        </ResponsiveContainer>
    );
};