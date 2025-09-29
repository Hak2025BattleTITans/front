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


const useIsMobile = () => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return isMobile;
};

const ResponsivePlot = ({ data, layout }: any) => {
    const isMobile = useIsMobile();

    const mobileLayout = {
        ...layout,
        autosize: true,
        width: undefined,
        height: undefined,
        margin: {
            l: 40,
            r: 20,
            b: 40,
            t: 40,
            pad: 2
        },
        font: {
            size: 10
        },
        legend: {
            font: { size: 10 },
            orientation: isMobile ? 'h' : 'v', // Горизонтальная легенда на мобилках
            x: 0,
            y: -0.2,
            xanchor: 'left',
            yanchor: 'top'
        }
    };

    return (
        <Plot
            data={data}
            layout={isMobile ? mobileLayout : layout}
            config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: isMobile
                    ? ['pan2d', 'lasso2d', 'select2d', 'zoomIn2d', 'zoomOut2d']
                    : ['pan2d', 'lasso2d', 'select2d'],
            }}
            style={{
                width: '100%',
                height: 'auto',//isMobile ? '250px' : 'auto',
                minHeight: '400px'
            }}
        />
    );
};

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

    console.log(p1)

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
                        <ResponsivePlot
                            data={p2.data}
                            layout={p2.layout}
                            config={{
                                responsive: true,
                                displayModeBar: true,
                                displaylogo: false,
                                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                            }}
                        />
                    )}
                </Card>
            </Col>

            <Col xs={24} sm={24} xl={12}>
                <Card title="Оптимизированный" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 10, } }}>
                    {op2 && (
                        <ResponsivePlot
                            data={op2.data}
                            layout={op2.layout}
                            config={{
                                responsive: true,
                                displayModeBar: true,
                                displaylogo: false,
                                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                            }}
                        />
                    )}
                </Card>
            </Col>


            {/* Динамика пассажиропотока по коду кабины */}
            <Col xs={24} sm={24} xl={12}>
                <Card title="Неоптимизированный" variant='borderless' styles={{ body: { padding: 5 } }}>
                    {p3 && (
                        <ResponsivePlot
                            data={p3.data}
                            layout={p3.layout}
                            config={{
                                responsive: true,
                                displayModeBar: true,
                                displaylogo: false,
                                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                            }}
                        />
                    )}
                </Card>
            </Col>

            <Col xs={24} sm={24} xl={12}>
                <Card title="Оптимизированный" variant='borderless' styles={{ body: { padding: 5 } }}>
                    {op3 && (
                        <ResponsivePlot
                            data={op3.data}
                            layout={op3.layout}
                            config={{
                                responsive: true,
                                displayModeBar: true,
                                displaylogo: false,
                                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                            }}
                        />
                    )}
                </Card>
            </Col>

            {/* средний чек по коду кабины */}
            <Col xs={24} sm={24} xl={12}>
                <Card title="Неоптимизированный" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 0, } }}>
                    {p1 && (
                        <ResponsivePlot
                            data={p1.data}
                            layout={p1.layout}
                            config={{
                                responsive: true,
                                displayModeBar: true,
                                displaylogo: false,
                                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                            }}
                        />
                    )}

                </Card>
            </Col>

            <Col xs={24} sm={24} xl={12}>
                <Card title="Оптимизированный" variant="borderless" style={{ width: `100%` }} styles={{ body: { padding: 0, } }}>
                    {op1 && (
                        <ResponsivePlot
                            data={op1.data}
                            layout={op1.layout}
                            config={{
                                responsive: true,
                                displayModeBar: true,
                                displaylogo: false,
                                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                            }}
                        />
                    )}

                </Card>
            </Col>


        </Row>
    );
};

export default Home;