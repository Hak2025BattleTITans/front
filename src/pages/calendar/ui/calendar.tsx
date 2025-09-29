import { Alert, Button, Calendar, Card, Col, DatePicker, Form, message, Row, Space, Spin, Switch, Tooltip } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { ScheduleTable } from '../../../features/schedule-table';
import './style.scss'
import { TrendingUp, Tickets, Users, TicketsPlane, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { OptimizationPicker } from '../../../components/optimization-picker';
import type { OptimizationAlgorithm } from '../../../components/optimization-picker/types';
import { useSession } from '@/providers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AnimatedNumber } from '@/components';
import { FlightDateCell } from '@/components/FlightDateCell';
import { calculateAverageTicket, calculateTotalIncome, calculateTotalPassengers } from '../model';
import { debounce } from 'lodash'
import { ALGORITHM_STORAGE_KEY } from '@/types';
import axiosBase from '@/config/axios';
import { useSearchParams } from 'react-router-dom';
import { useSessionLoader } from '@/features/session/session-loader'

interface Props {
    className?: string;
}

export const CalendarPage: React.FC<Props> = () => {
    // Хранит значение выбранной даты в календаре
    const [date, setDate] = React.useState<Dayjs | undefined>(undefined);
    const [pendingDate, setPendingDate] = React.useState<Dayjs | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);

    const [isOptimized, setIsOptimized] = React.useState(false);
    const [selectedAlgorithms, setSelectedAlgorithms] = React.useState<OptimizationAlgorithm[]>([]);
    const { session, } = useSession();

    const [searchParams, setSearchParams] = useSearchParams();

    const { refetch, loading: sessionLoading } = useSessionLoader();

    // --- 1. Инициализация даты из query ---
    React.useEffect(() => {
        const dateParam = searchParams.get("date");
        if (dateParam && dayjs(dateParam, "YYYY-MM-DD", true).isValid()) {
            setDate(dayjs(dateParam));
        }
    }, [searchParams]);

    // --- 2. Обновление query при смене даты ---
    const handleSetDate = (newDate?: Dayjs) => {
        setDate(newDate);
        if (newDate) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set("date", newDate.format("YYYY-MM-DD"));
                return params;
            });
        } else {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.delete("date");
                return params;
            });
        }
    };

    const filteredSchedule = React.useMemo(() => {
        const dataSource = session?.unoptimized_schedule || [];
        const optimizedDataSource = session?.optimized_schedule || [];

        const defaultSchedule = dataSource.filter(i => {
            if (!date) return true;
            return i.date === date.format('YYYY-MM-DD')
        });

        const optimizedSchedule = optimizedDataSource.filter(i => {
            if (!date) return true;
            return i.date === date.format('YYYY-MM-DD')
        });

        return {
            optimized: optimizedSchedule,
            unoptimized: defaultSchedule,
        };
    }, [session?.unoptimized_schedule, session?.optimized_schedule, date]);

    const flightDates = React.useMemo(() => {
        const flights = session?.unoptimized_schedule || [];

        return flights.reduce<Record<string, number>>((acc, f) => {
            const date = dayjs(f.date).format("YYYY-MM-DD");
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    }, [session?.optimized_schedule, session?.unoptimized_schedule]);

    const flightsMetrics = React.useMemo(() => {
        const unoptimizedPassengers = calculateTotalPassengers(filteredSchedule.unoptimized || []);
        const unoptimizedIncome = calculateTotalIncome(filteredSchedule.unoptimized || []);
        const unoptimizedAvgTicket = calculateAverageTicket(filteredSchedule.unoptimized || []);

        const optimizedPassengers = calculateTotalPassengers(filteredSchedule.optimized || []);
        const optimizedIncome = calculateTotalIncome(filteredSchedule.optimized || []);
        const optimizedAvgTicket = calculateAverageTicket(filteredSchedule.optimized || []);

        const getChange = (unoptimized: number, optimized: number) => {
            if (unoptimized === 0 && optimized === 0) return 0;
            if (unoptimized === 0) return optimized > 0 ? 100 : -100;

            const change = ((optimized - unoptimized) / unoptimized) * 100;

            return Math.round(change * 100) / 100;
        }

        return {
            passengers: {
                default: unoptimizedPassengers,
                optimized: optimizedPassengers,
                change: getChange(unoptimizedPassengers, optimizedPassengers),
            },
            income: {
                default: unoptimizedIncome,
                optimized: optimizedIncome,
                change: getChange(unoptimizedIncome, optimizedIncome),
            },
            avg_check: {
                default: unoptimizedAvgTicket,
                optimized: optimizedAvgTicket,
                change: getChange(unoptimizedAvgTicket, optimizedAvgTicket),
            },
        }
    }, [filteredSchedule.optimized, filteredSchedule.unoptimized]);

    const handleChange = useCallback(async (checked: boolean, algorithms: OptimizationAlgorithm[]) => {
        if (!checked) return;

        const saved = window.localStorage.getItem(ALGORITHM_STORAGE_KEY);
        const currentAlgorithms = algorithms.map(a => a.id);

        let params = algorithms.reduce((total, curr) => {
            return {
                ...total,
                [curr.id]: true,
            }
        }, {});

        const optimizeCallback = async () => {
            try {
                setLoading(true);
                await axiosBase.post('/api/v1/optimize', params);
                await refetch();
            } catch (err) {
                message.warning('Не удалось оптимизировать расписание');
            } finally {
                setLoading(false);
            }
        }

        if (saved) {
            try {
                const savedAlgorithms = JSON.parse(saved);

                // Сравниваем массивы (порядок может не иметь значения)
                const arraysEqual =
                    savedAlgorithms.length === currentAlgorithms.length &&
                    savedAlgorithms.every((alg: string) => currentAlgorithms.includes(alg)) &&
                    currentAlgorithms.every((alg: string) => savedAlgorithms.includes(alg));

                if (arraysEqual) {
                    // Алгоритмы одинаковые - ничего не делаем
                    return;
                } else {
                    // Алгоритмы изменились - перезаписываем
                    window.localStorage.setItem(ALGORITHM_STORAGE_KEY, JSON.stringify(currentAlgorithms));

                    await optimizeCallback();
                }
            } catch (error) {
                // Если ошибка парсинга - перезаписываем
                window.localStorage.setItem(ALGORITHM_STORAGE_KEY, JSON.stringify(currentAlgorithms));
                console.log("Ошибка парсинга, алгоритм сохранен:", currentAlgorithms);


            }
        } else {
            // Нет сохраненного значения - сохраняем впервые
            window.localStorage.setItem(ALGORITHM_STORAGE_KEY, JSON.stringify(currentAlgorithms));
            console.log("Алгоритм сохранен впервые:", currentAlgorithms);
            await optimizeCallback();
        }
    }, []);

    const debouncedChange = useMemo(
        () => debounce(handleChange, 500), // 500ms задержка
        [handleChange]
    );

    const handleSwitchChange = (checked: boolean, _: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        setIsOptimized(checked);

        debouncedChange(checked, selectedAlgorithms);
    }

    React.useEffect(() => {
        return () => {
            debouncedChange.cancel();
        };
    }, [debouncedChange]);

    return (
        <Row gutter={[32, 32]}>
            <Spin spinning={loading || sessionLoading}>
                <Col xs={24}>
                    {date && (
                        <div style={{ marginBottom: 20 }}>
                            <div className={clsx('calendar-rate', { 'calendar-rate--opened': isOptimized })}>
                                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                                    {/* 1. Пассажиропоток */}
                                    <Col xs={24} lg={8}>
                                        <Card
                                            loading={loading}
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
                                                            {flightsMetrics.passengers.change}%
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <Users size={28} color="#1677ff" />
                                                <div style={{ flex: 1 }}>
                                                    <AnimatedNumber
                                                        value={flightsMetrics.passengers.optimized}
                                                        defaultValue={flightsMetrics.passengers.default}
                                                        showOptimized={isOptimized}
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
                                                                {flightsMetrics.passengers.change < 0
                                                                    ? <TrendingDown size={16} />
                                                                    : <TrendingUp size={16} />
                                                                }
                                                                {flightsMetrics.passengers.change}%
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
                                            loading={loading}
                                            size='small'
                                            variant='borderless'
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    Доход
                                                    {isOptimized && (
                                                        <span
                                                            style={{
                                                                fontSize: 12,
                                                                background: flightsMetrics.income.change < 0 ? "#ffb4aaff" : "#f6ffed",
                                                                border: '1px solid #b7eb8f',
                                                                borderColor: flightsMetrics.income.change < 0 ? "#f02409ff" : "#52c41a",
                                                                padding: '2px 6px',
                                                                borderRadius: 4,
                                                                color: flightsMetrics.income.change < 0 ? "#f02409ff" : "#52c41a"
                                                            }}
                                                        >
                                                            {flightsMetrics.income.change}%
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <TicketsPlane size={28} color="#1677ff" />
                                                <div style={{ flex: 1 }}>
                                                    <AnimatedNumber
                                                        value={flightsMetrics.income.optimized}
                                                        defaultValue={flightsMetrics.income.default}
                                                        showOptimized={isOptimized}
                                                        format="currency"
                                                    />
                                                    <div style={{
                                                        color: flightsMetrics.income.change < 0 ? "#df3d28ff" : "#52c41a",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 4,
                                                        height: 20
                                                    }}>
                                                        {isOptimized && (
                                                            <>
                                                                {flightsMetrics.income.change < 0
                                                                    ? <TrendingDown size={16} />
                                                                    : <TrendingUp size={16} />
                                                                }
                                                                {flightsMetrics.income.change}%
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
                                            loading={loading}
                                            size='small'
                                            variant='borderless'
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    Средний чек
                                                    {isOptimized && (
                                                        <span
                                                            style={{
                                                                fontSize: 12,
                                                                background: flightsMetrics.avg_check.change < 0 ? "#ffb4aaff" : "#f6ffed",
                                                                border: '1px solid #b7eb8f',
                                                                borderColor: flightsMetrics.avg_check.change < 0 ? "#f02409ff" : "#52c41a",
                                                                padding: '2px 6px',
                                                                borderRadius: 4,
                                                                color: flightsMetrics.avg_check.change < 0 ? "#f02409ff" : "#52c41a"
                                                            }}
                                                        >
                                                            {flightsMetrics.avg_check.change}%
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <Tickets size={28} color="#1677ff" />
                                                <div style={{ flex: 1 }}>
                                                    <AnimatedNumber
                                                        value={flightsMetrics.avg_check.optimized}
                                                        defaultValue={flightsMetrics.avg_check.default}
                                                        showOptimized={isOptimized}
                                                        format="currency"
                                                    />
                                                    <div style={{
                                                        color: flightsMetrics.income.change < 0 ? "#df3d28ff" : "#52c41a",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 4,
                                                        height: 20
                                                    }}>
                                                        {isOptimized && (
                                                            <>
                                                                {flightsMetrics.avg_check.change < 0
                                                                    ? <TrendingDown size={16} />
                                                                    : <TrendingUp size={16} />
                                                                }
                                                                {flightsMetrics.avg_check.change}%
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
                                        onChange={handleSetDate}
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
                                                            onChange={handleSwitchChange}
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
                        ? (
                            <ScheduleTable
                                dataSource={filteredSchedule.unoptimized}
                                optimizedDataSource={filteredSchedule.optimized}
                                showOptimized={isOptimized}
                            />
                        )
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
                                                onClick={() => handleSetDate(pendingDate)}
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
            </Spin>
        </Row>
    );
};