import React from 'react';
import { Card, Col, Row, } from 'antd';
import { BigChart } from '../../../features/big-chart';
import { BarChartCard } from '../../../features/bar-chart';
import { PieChartCard } from '../../../features/pie-chart';
import { RussianRuble, Tickets, Users, } from 'lucide-react';
import { useSession } from '@/providers';

interface Props {
    className?: string;
}

const dataBar = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const formatNumber = (num: number, format: "number" | "currency" = 'number'): string => {
        if (format === 'currency') {
            return new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(num) + ' ₽';
        }

        return new Intl.NumberFormat('ru-RU').format(num);
    };

export const Home: React.FC<Props> = () => {
    const { session, } = useSession();
    const metrics = React.useMemo(() => session?.main_metrics, [session?.main_metrics])

    return (
        <Row gutter={[32, 32]}>
            {metrics && (
                <Col xs={24}>
                    <Row gutter={[16, 16]}>
                        {/* 1. Общий доход за представленный период */}
                        <Col xs={24} lg={8}>
                            <Card variant='borderless' title="Общий доход">
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <RussianRuble size={28} color="#1677ff" />
                                    <div>
                                        <div style={{ fontSize: 24, fontWeight: 600 }}>{formatNumber(metrics.income.value, 'currency')}</div>
                                        {/* <div style={{ color: "#52c41a", display: "flex", alignItems: "center", gap: 4 }}>
                                            <TrendingUp size={16} />
                                            +8.3%
                                        </div> */}
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* 2. Средний чек */}
                        <Col xs={24} lg={8}>
                            <Card variant='borderless' title="Средний чек">
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Tickets size={28} color="#1677ff" />
                                    <div>
                                        <div style={{ fontSize: 24, fontWeight: 600 }}>{formatNumber(metrics.avg_check.value, 'currency')}</div>
                                        {/* <div style={{ color: "#52c41a", display: "flex", alignItems: "center", gap: 4 }}>
                                            <TrendingUp size={16} />
                                            +2.1%
                                        </div> */}
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* 3. Количество упущенных продаж */}
                        <Col xs={24} lg={8}>
                            <Card variant='borderless' title="Пассажиропоток">
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    {/* <XCircle size={28} color="#ff4d4f" /> */}
                                    <Users size={28} color="#1677ff"/>
                                    <div>
                                        <div style={{ fontSize: 24, fontWeight: 600 }}>{formatNumber(metrics.passengers.value)}</div>
                                        {/* <div style={{ color: "#ff4d4f", display: "flex", alignItems: "center", gap: 4 }}>
                                            <TrendingDown size={16} />
                                            -5.2%
                                        </div> */}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            )}


            <Col xs={24} md={24} xl={12}>
                <BigChart />
            </Col>

            <Col xs={24} sm={12} xl={6}>
                <Card title="График 1" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 10, height: 200 } }}>
                    <BarChartCard data={dataBar} />
                </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
                <Card title="График 2" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 0, height: 200, } }}>
                    <PieChartCard data={pieData} />
                </Card>
            </Col>


        </Row>
    );
};

export default Home;