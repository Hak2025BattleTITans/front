import type { ScheduleItem } from '@/types';
import { Button, Card, Empty, Modal, Table, Tag, Tooltip, } from 'antd';
import type { Dayjs } from 'dayjs';
import { Fullscreen } from 'lucide-react';
import React from 'react';

interface Props {
    className?: string;
    dataSource?: ScheduleItem[]
    loading?: boolean;
    date?: Dayjs
}

const columns = [
    { dataIndex: 'date', title: 'Дата вылета' },
    {
        dataIndex: 'flight_number',
        title: 'Номер рейса',
    },
    {
        dataIndex: 'dep_airport',
        title: 'Аэропорт вылета',
        render: (value: any) => {
            return (
                <Tag color='blue'>
                    {value}
                </Tag>
            )
        }
    },
    {
        dataIndex: 'arr_airport',
        title: 'Аэропорт прилёта',
        render: (value: any) => {
            return (
                <Tag color='blue'>
                    {value}
                </Tag>
            )
        }
    },
    { dataIndex: 'dep_time', title: 'Время вылета' },
    { dataIndex: 'arr_time', title: 'Время прилёта' },
    { dataIndex: 'flight_capacity', title: 'Ёмкость кабины' },
    { dataIndex: 'lf_cabin', title: 'LF Кабина' },
    { dataIndex: 'cabins_brones', title: 'Бронирования по кабинам' },
    { dataIndex: 'flight_type', title: 'Тип ВС' },
    {
        dataIndex: 'cabin_code',
        title: 'Код кабины',
        render: (value: any) => {
            return (
                <Tag color='blue'>
                    {value}
                </Tag>
            )
        }
    },
    { dataIndex: 'pass_income', title: 'Доход пасс' },
    { dataIndex: 'passengers', title: 'Пассажиры' },
];

export const ScheduleTable: React.FC<Props> = ({ dataSource, loading, date, }) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [items, setItems] = React.useState<any[]>([])

    React.useEffect(() => {
        if (!Array.isArray(dataSource)) {
            setItems([]);
            return;
        }
        const res = dataSource.filter(i => {
            if (!date) return true;
            return i.date === date.format('YYYY-MM-DD')
        })

        setItems(res);
    }, [dataSource, date])



    const ScheduleTable = () => {
        return (
            <Table
                columns={columns}
                dataSource={items}
                size='small'
                rowKey={r => `${r?.arr_airport}:${r?.dep_airport}:${r?.flight_number}:${r?.cabin_code}`}
                scroll={{
                    x: 'max-content'
                }}
                loading={loading}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={"На этот день нет рейсов"}
                        />
                    )
                }}
            />
        )
    }

    return (
        <Card
            title="Расписание авиарейсов"
            variant='borderless'
            styles={{ body: { padding: 0 } }}
            extra={(
                <Tooltip title="На весь экран">
                    <Button
                        icon={<Fullscreen size={16} />}
                        onClick={() => setModalVisible(true)}
                    />
                </Tooltip>
            )}
        >
            <Modal
                title="Расписание авиарейсов"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width="90%"
            >
                <ScheduleTable />
            </Modal>


            <ScheduleTable />
        </Card>
    );
};