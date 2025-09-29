import React from 'react';
import { Card, Col, Row, } from 'antd';
import { RussianRuble, Tickets, Users, } from 'lucide-react';
import { useSession } from '@/providers';
import Plot from 'react-plotly.js';
import { MetricCard } from '@/components';

interface Props {
    className?: string;
}

/* const formatNumber = (num: number, format: "number" | "currency" = 'number'): string => {
    if (format === 'currency') {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num) + ' ₽';
    }

    return new Intl.NumberFormat('ru-RU').format(num);
}; */

export const Home: React.FC<Props> = () => {
    const { session, } = useSession();
    const metrics = React.useMemo(() => session?.main_metrics, [session?.main_metrics]);

    const [p1, p2, p3] = session?.plots?.plots || [];
    const [op1, op2, op3] = session?.plots?.optimized_plots || [];

    const getChange = (unoptimized: number, optimized: number) => {
        if (unoptimized === 0 && optimized === 0) return 0;
        if (unoptimized === 0) return optimized > 0 ? 100 : -100;

        const change = ((optimized - unoptimized) / unoptimized) * 100;

        return Math.round(change * 100) / 100;
    }

    return (
        <Row gutter={[32, 32]}>
            {metrics && (
                <Col xs={24}>
                    <Row gutter={[16, 16]}>
                        {/* 1. Общий доход за представленный период */}
                        <Col xs={24} lg={8}>
                            <MetricCard
                                title='Общий доход'
                                defaultValue={metrics.income.value}
                                optimizedValue={metrics.income.optimized_value}
                                format='currency'
                                icon={<RussianRuble size={28} color="#1677ff" />}
                                showOptimized={metrics.income.optimized_value !== 0 && metrics.income.value !== metrics.income.optimized_value}
                                change={getChange(metrics.income.value, metrics.income.optimized_value)}

                            />
                        </Col>

                        {/* 2. Средний чек */}
                        <Col xs={24} lg={8}>
                            <MetricCard
                                title='Средний чек'
                                defaultValue={metrics.avg_check.value}
                                optimizedValue={metrics.avg_check.optimized_value}
                                format='currency'
                                icon={<Tickets size={28} color="#1677ff" />}
                                showOptimized={metrics.avg_check.optimized_value !== 0 && metrics.avg_check.value !== metrics.avg_check.optimized_value}
                                change={getChange(metrics.avg_check.value, metrics.avg_check.optimized_value)}

                            />
                        </Col>

                        {/* 3. Пассажиропоток */}
                        <Col xs={24} lg={8}>
                            <MetricCard
                                title='Пассажиропоток'
                                defaultValue={metrics.passengers.value}
                                optimizedValue={metrics.passengers.optimized_value}
                                format='number'
                                icon={<Users size={28} color="#1677ff" />}
                                showOptimized={metrics.passengers.optimized_value !== 0 && metrics.passengers.value !== metrics.passengers.optimized_value}
                                change={getChange(metrics.passengers.value, metrics.passengers.optimized_value)}
                                lessThenBetter
                            />
                        </Col>
                    </Row>
                </Col>
            )}


            {/* Динамика дохода по коду кабины */}
            <Col xs={24} md={24} xl={12}>
                <Card title="Неоптимизированный" variant='borderless' styles={{ body: { padding: 5 } }}>
                    {p2 && (
                        <Plot
                            data={p2.data}
                            layout={p2.layout}
                        />
                    )}
                </Card>
            </Col>

            <Col xs={24} sm={12} xl={12}>
                <Card title="Оптимизированный" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 10, } }}>
                    {op2 && (
                        <Plot
                            data={op2.data}
                            layout={op2.layout}
                        />
                    )}
                </Card>
            </Col>


            {/* Динамика пассажиропотока по коду кабины */}
            <Col xs={24} sm={12} xl={12}>
                <Card title="Неоптимизированный" variant='borderless' styles={{ body: { padding: 5 } }}>
                    {p3 && (
                        <Plot
                            data={p3.data}
                            layout={p3.layout}
                        />
                    )}
                </Card>
            </Col>

            <Col xs={24} sm={12} xl={12}>
                <Card title="Оптимизированный" variant='borderless' styles={{ body: { padding: 5 } }}>
                    {op3 && (
                        <Plot
                            data={op3.data}
                            layout={op3.layout}
                        />
                    )}
                </Card>
            </Col>

            {/* средний чек по коду кабины */}
            <Col xs={24} sm={12} xl={12}>
                <Card title="Неоптимизированный" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 0, } }}>
                    {p1 && (
                        <Plot
                            data={p1.data}
                            layout={p1.layout}
                        />
                    )}

                </Card>
            </Col>

            <Col xs={24} sm={12} xl={12}>
                <Card title="Оптимизированный" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 0, } }}>
                    {op1 && (
                        <Plot
                            data={op1.data}
                            layout={op1.layout}
                        />
                    )}

                </Card>
            </Col>


        </Row>
    );
};

export default Home;