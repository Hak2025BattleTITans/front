import { Alert, Button, Calendar, Card, Col, DatePicker, Form, Row, Space, Switch, Tooltip } from 'antd';
import React from 'react';
import { ScheduleTable } from '../../../features/schedule-table';
import './style.scss'
import { TrendingUp, Tickets, Users, TicketsPlane } from 'lucide-react';
import clsx from 'clsx';
import { OptimizationPicker } from '../../../components/optimization-picker';
import type { OptimizationAlgorithm } from '../../../components/optimization-picker/types';
import { useSession } from '@/providers';
import type { Dayjs } from 'dayjs';
import type { MainMetrics, } from '@/types';
import dayjs from 'dayjs';
import { AnimatedNumber } from '@/components';
import { FlightDateCell } from '@/components/FlightDateCell';

interface Props {
    className?: string;
}

export const CalendarPage: React.FC<Props> = () => {
    // Хранит значение выбранной даты в календаре
    const [date, setDate] = React.useState<Dayjs | undefined>(undefined);
    const [pendingDate, setPendingDate] = React.useState<Dayjs | undefined>(undefined);

    const [isOptimized, setIsOptimized] = React.useState(false);
    const [selectedAlgorithms, setSelectedAlgorithms] = React.useState<OptimizationAlgorithm[]>([]);
    const { session, } = useSession();

    const getCurrentMetricValue = (metricKey: keyof MainMetrics) => {
        if (!session) return undefined;
        const metricsData = session.main_metrics;
        return isOptimized ? session.main_metrics[metricKey].optimized_value : metricsData[metricKey].value;
    };

    const getOldMetricValue = (metricKey: keyof MainMetrics) => {
        const metricsData = session?.main_metrics;
        if (!metricsData) return undefined;

        return metricsData[metricKey].optimized_value;
    };

    const getChangePercentage = (metricKey: keyof MainMetrics) => {
        const metric = session?.main_metrics?.[metricKey];
        if (!metric) return undefined;

        const { value, optimized_value } = metric;
        if (value === 0) return undefined;

        return ((optimized_value - value) / value) * 100;
    };

    const flightDates = React.useMemo(() => {
        const flights = session?.unoptimized_schedule || [];

        return flights.reduce<Record<string, number>>((acc, f) => {
            const date = dayjs(f.date).format("YYYY-MM-DD");
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    }, [session?.optimized_schedule, session?.unoptimized_schedule]);

    return (
        <Row gutter={[32, 32]}>
            <Col xs={24}>
                {date && (
                    <div style={{ marginBottom: 20 }}>
                        <div className={clsx('calendar-rate', { 'calendar-rate--opened': isOptimized })}>
                            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                                {/* 1. Пассажиропоток */}
                                <Col xs={24} lg={8}>
                                    <Card
                                        size='small'
                                        variant='borderless'
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                Пассажиропоток
                                                {isOptimized && (
                                                    <span
                                                        style={{
                                                            fontSize: 12,
                                                            background: '#f6ffed',
                                                            border: '1px solid #b7eb8f',
                                                            padding: '2px 6px',
                                                            borderRadius: 4,
                                                            color: '#52c41a'
                                                        }}
                                                    >
                                                        +{getChangePercentage('passengers')}%
                                                    </span>
                                                )}
                                            </div>
                                        }
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <Users size={28} color="#1677ff" />
                                            <div style={{ flex: 1 }}>
                                                <AnimatedNumber
                                                    value={getCurrentMetricValue('passengers') || 0}
                                                    oldValue={getOldMetricValue('passengers')}
                                                />
                                                <div style={{
                                                    color: "#52c41a",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    height: 20
                                                }}>
                                                    {isOptimized && (
                                                        <>
                                                            <TrendingUp size={16} />
                                                            +{getChangePercentage('passengers')}%
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                {/* 2. Доход */}
                                <Col xs={24} lg={8}>
                                    <Card
                                        size='small'
                                        variant='borderless'
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                Доход
                                                {isOptimized && (
                                                    <span
                                                        style={{
                                                            fontSize: 12,
                                                            background: '#f6ffed',
                                                            border: '1px solid #b7eb8f',
                                                            padding: '2px 6px',
                                                            borderRadius: 4,
                                                            color: '#52c41a'
                                                        }}
                                                    >
                                                        +{getChangePercentage('income')}%
                                                    </span>
                                                )}
                                            </div>
                                        }
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <TicketsPlane size={28} color="#1677ff" />
                                            <div style={{ flex: 1 }}>
                                                <AnimatedNumber
                                                    value={getCurrentMetricValue('income') || 0}
                                                    oldValue={getOldMetricValue('income')}
                                                    format="currency"
                                                />
                                                <div style={{
                                                    color: "#52c41a",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    height: 20
                                                }}>
                                                    {isOptimized && (
                                                        <>
                                                            <TrendingUp size={16} />
                                                            +{getChangePercentage('income')}%
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                {/* 3. Средний чек */}
                                <Col xs={24} lg={8}>
                                    <Card
                                        size='small'
                                        variant='borderless'
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                Средний чек
                                                {isOptimized && (
                                                    <span
                                                        style={{
                                                            fontSize: 12,
                                                            background: '#f6ffed',
                                                            border: '1px solid #b7eb8f',
                                                            padding: '2px 6px',
                                                            borderRadius: 4,
                                                            color: '#52c41a'
                                                        }}
                                                    >
                                                        +{getChangePercentage('avg_check')}%
                                                    </span>
                                                )}
                                            </div>
                                        }
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <Tickets size={28} color="#1677ff" />
                                            <div style={{ flex: 1 }}>
                                                <AnimatedNumber
                                                    value={getCurrentMetricValue('avg_check') || 0}
                                                    oldValue={getOldMetricValue('avg_check')}
                                                    format="currency"
                                                />
                                                <div style={{
                                                    color: "#52c41a",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    height: 20
                                                }}>
                                                    {isOptimized && (
                                                        <>
                                                            <TrendingUp size={16} />
                                                            +{getChangePercentage('avg_check')}%
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                        <Row
                            gutter={[16, 16]}
                            align="middle"
                            className="responsive-space-row"
                        >
                            <Col xs={12} lg={12}>
                                <DatePicker
                                    value={date}
                                    onChange={setDate}
                                    format={{
                                        format: 'DD.MM.YYYY'
                                    }}
                                    cellRender={(current) => (
                                        <FlightDateCell current={current as any} flightDates={flightDates} />
                                    )}
                                />
                            </Col>
                            <Col xs={12} lg={12}>
                                <Form className='calendar__filter-form'>
                                    <Space size='large'>
                                        <OptimizationPicker
                                            selected={selectedAlgorithms}
                                            onChange={setSelectedAlgorithms}
                                        />

                                        <div className='calendar__filter-form-item'>
                                            <Tooltip title={selectedAlgorithms.length === 0 ? 'Выберите алгоритмы для оптимизации' : ''}>
                                                <label className='calendar__filter-form-label'>
                                                    <span className='calendar__filter-form-text'>Оптимизировать</span>
                                                    <Switch
                                                        disabled={selectedAlgorithms.length === 0}
                                                        size='small'
                                                        value={isOptimized}
                                                        onChange={setIsOptimized}
                                                    />
                                                </label>
                                            </Tooltip>
                                        </div>
                                    </Space>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                )}

                {date
                    ? <ScheduleTable dataSource={session?.unoptimized_schedule || []} date={date} />
                    : (
                        <Space direction='vertical' style={{ width: '100%' }} size={[8, 16]}>
                            <Alert
                                type='warning'
                                message="Укажите дату рейса"
                                style={{
                                    borderColor: 'orange',
                                    background: 'orange',
                                    fontWeight: 500
                                }}
                            />
                            <Row>
                                <Col lg={{ span: 16, offset: 4 }}>
                                    <Calendar
                                        onSelect={(newDate) => setPendingDate(newDate)}
                                        onPanelChange={(panelDate) => setPendingDate(panelDate)}
                                        fullscreen={false}
                                        fullCellRender={(current, info) => (
                                            <FlightDateCell current={current} flightDates={flightDates} originNode={info.originNode} />
                                        )}
                                        
                                    />
                                    <hr />
                                    {pendingDate && (
                                        <Button
                                            size='large'
                                            type='primary'
                                            onClick={() => setDate(pendingDate)}
                                            style={{ width: '100%' }}
                                        >
                                            Выбрать дату
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Space>
                    )
                }
            </Col>
        </Row>
    );
};