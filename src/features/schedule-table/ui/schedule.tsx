import type { ScheduleItem } from '@/types';
import { Button, Card, Empty, Modal, Table, Tag, Tooltip } from 'antd';
import { Fullscreen } from 'lucide-react';
import React from 'react';

interface Props {
    className?: string;
    dataSource?: ScheduleItem[];
    optimizedDataSource?: ScheduleItem[];
    showOptimized?: boolean;
    loading?: boolean;
}

const renderDiff = (
    value: any,
    optimizedValue: any,
    showOptimized?: boolean
) => {
    if (!showOptimized || value === optimizedValue) {
        return value;
    }

    const increased = optimizedValue > value;

    return (
        <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
            <span style={{ textDecoration: 'line-through', color: '#999' }}>
                {value}
            </span>
            <span style={{ color: increased ? '#52c41a' : '#df3d28ff' }}>
                {optimizedValue}
            </span>
        </span>
    );
};

export const ScheduleTable: React.FC<Props> = ({
    dataSource,
    optimizedDataSource,
    showOptimized,
    loading,
}) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const columns = [
        { dataIndex: 'date', title: 'Дата вылета' },
        { dataIndex: 'flight_number', title: 'Номер рейса' },
        {
            dataIndex: 'dep_airport',
            title: 'Аэропорт вылета',
            render: (value: any) => <Tag color="blue">{value}</Tag>,
        },
        {
            dataIndex: 'arr_airport',
            title: 'Аэропорт прилёта',
            render: (value: any) => <Tag color="blue">{value}</Tag>,
        },
        { dataIndex: 'dep_time', title: 'Время вылета' },
        { dataIndex: 'arr_time', title: 'Время прилёта' },
        {
            dataIndex: 'flight_capacity',
            title: 'Ёмкость кабины',
            render: (_: any, record: ScheduleItem, index: number) =>
                renderDiff(
                    record.flight_capacity,
                    optimizedDataSource?.[index]?.flight_capacity,
                    showOptimized
                ),
        },
        {
            dataIndex: 'lf_cabin',
            title: 'LF Кабина',
            render: (_: any, record: ScheduleItem, index: number) =>
                renderDiff(
                    record.lf_cabin,
                    optimizedDataSource?.[index]?.lf_cabin,
                    showOptimized
                ),
        },
        {
            dataIndex: 'cabins_brones',
            title: 'Бронирования по кабинам',
            render: (_: any, record: ScheduleItem, index: number) =>
                renderDiff(
                    record.cabins_brones,
                    optimizedDataSource?.[index]?.cabins_brones,
                    showOptimized
                ),
        },
        { dataIndex: 'flight_type', title: 'Тип ВС' },
        {
            dataIndex: 'cabin_code',
            title: 'Код кабины',
            render: (value: any) => <Tag color="blue">{value}</Tag>,
        },
        {
            dataIndex: 'pass_income',
            title: 'Доход пасс',
            render: (_: any, record: ScheduleItem, index: number) =>
                renderDiff(
                    record.pass_income,
                    optimizedDataSource?.[index]?.pass_income,
                    showOptimized
                ),
        },
        {
            dataIndex: 'passengers',
            title: 'Пассажиры',
            render: (_: any, record: ScheduleItem, index: number) =>
                renderDiff(
                    record.passengers,
                    optimizedDataSource?.[index]?.passengers,
                    showOptimized
                ),
        },
    ];

    const InnerTable = () => (
        <Table
            columns={columns}
            dataSource={dataSource}
            size="small"
            rowKey={(r) =>
                `${r?.arr_airport}:${r?.dep_airport}:${r?.flight_number}:${r?.cabin_code}`
            }
            scroll={{
                x: 'max-content',
            }}
            loading={loading}
            locale={{
                emptyText: (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={'На этот день нет рейсов'}
                    />
                ),
            }}
        />
    );

    return (
        <Card
            title="Расписание авиарейсов"
            variant="borderless"
            styles={{ body: { padding: 0 } }}
            extra={
                <Tooltip title="На весь экран">
                    <Button
                        icon={<Fullscreen size={16} />}
                        onClick={() => setModalVisible(true)}
                    />
                </Tooltip>
            }
        >
            <Modal
                title="Расписание авиарейсов"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width="90%"
            >
                <InnerTable />
            </Modal>

            <InnerTable />
        </Card>
    );
};
