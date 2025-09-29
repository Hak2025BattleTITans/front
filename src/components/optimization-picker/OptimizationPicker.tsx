import React, { useEffect, useState } from 'react';
import type { OptimizationAlgorithm } from './types';
import { Badge, Button, Checkbox, Col, Form, message, Modal, Row, Space } from 'antd';
import './style.scss'

interface Props {
    selected?: OptimizationAlgorithm[]
    onChange?: (items: OptimizationAlgorithm[]) => void;
}

const ALGORITHMS: OptimizationAlgorithm[] = [
    { id: 'ranking', name: 'Оптимизация перемещением временных слотов' },
    { id: 'overbooking', name: 'Оптимизация овербукинга', disabled: true },
];

export const OptimizationPicker: React.FC<Props> = ({ onChange, selected = [] }) => {
    const [opened, setOpened] = useState(false);
    const [form] = Form.useForm();
    const [selectedAlgorithms, setSelectedAlgorithms] = useState<OptimizationAlgorithm[]>(selected);
    const [checkedValues, setCheckedValues] = useState<string[]>(selected.map(item => item.id));

    // Инициализация формы
    useEffect(() => {
        if (opened) {
            setCheckedValues(selectedAlgorithms.map(item => item.id));
            form.setFieldsValue({ algorithms: selectedAlgorithms.map(item => item.id) });
        }
    }, [opened, selectedAlgorithms, form]);

    // Проверка что выбран минимум 1 алгоритм
    const validateAlgorithms = (_: any, value: any[]) => {
        if (!value || value.length === 0) {
            return Promise.reject(new Error('Выберите минимум один алгоритм'));
        }
        return Promise.resolve();
    };

    const handleSubmit = (values: { algorithms: string[] }) => {
        const selectedItems = ALGORITHMS.filter(alg => values.algorithms.includes(alg.id));

        setSelectedAlgorithms(selectedItems);
        onChange?.(selectedItems);

        message.success(`Выбрано алгоритмов: ${selectedItems.length}`);
        setOpened(false);
    };

    const handleCheckboxChange = (checkedValues: any[]) => {
        setCheckedValues(checkedValues as string[]);
    };

    const handleCancel = () => {
        // Восстанавливаем предыдущее состояние при отмене
        setCheckedValues(selectedAlgorithms.map(item => item.id));
        form.setFieldsValue({ algorithms: selectedAlgorithms.map(item => item.id) });
        setOpened(false);
    };

    // Разделяем алгоритмы на две колонки
    const midIndex = Math.ceil(ALGORITHMS.length / 2);
    const firstColumnAlgorithms = ALGORITHMS.slice(0, midIndex);
    const secondColumnAlgorithms = ALGORITHMS.slice(midIndex);

    return (
        <>
            <Badge count={selectedAlgorithms.length} showZero={false}>
                <Button
                    type="primary"
                    onClick={() => setOpened(true)}
                    style={{
                        background: '#1890ff',
                        borderColor: '#1890ff',
                        borderRadius: '6px',
                        fontWeight: 500
                    }}
                >
                    Алгоритмы оптимизации
                </Button>
            </Badge>

            <Modal
                title={
                    <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 600 }}>
                        Выберите алгоритмы оптимизации
                    </div>
                }
                open={opened}
                onCancel={handleCancel}
                footer={null}
                width={600}
                style={{ top: 20 }}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ marginTop: '24px' }}
                >
                    <Form.Item
                        name="algorithms"
                        rules={[{ validator: validateAlgorithms }]}
                        validateTrigger="onSubmit"
                    >
                        <Checkbox.Group
                            style={{ width: '100%' }}
                            value={checkedValues}
                            onChange={handleCheckboxChange}
                        >
                            <Row gutter={[24, 16]}>
                                <Col span={12}>
                                   <Space
                                        direction="vertical"
                                        className='optimized-picker__space'
                                        classNames={{
                                            item: 'optimized-picker__space-item'
                                        }}
                                    >
                                        {firstColumnAlgorithms.map(algorithm => (
                                            <Checkbox
                                                key={algorithm.id}
                                                value={algorithm.id}
                                                disabled={algorithm.disabled}
                                                className="optimized-picker__checkbox"
                                            >
                                                {algorithm.name}
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Col>
                                <Col span={12}>
                                    <Space
                                        direction="vertical"
                                        className='optimized-picker__space'
                                        classNames={{
                                            item: 'optimized-picker__space-item'
                                        }}
                                    >
                                        {secondColumnAlgorithms.map(algorithm => (
                                            <Checkbox
                                                key={algorithm.id}
                                                value={algorithm.id}
                                                disabled={algorithm.disabled}
                                                className="optimized-picker__checkbox"
                                            >
                                                {algorithm.name}
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    <div style={{
                        marginTop: '32px',
                        padding: '16px',
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: '6px'
                    }}>
                        <div style={{ color: '#52c41a', fontSize: '14px' }}>
                            Выбрано алгоритмов: <strong>{checkedValues.length}</strong>
                            {checkedValues.length === 0 && ' (необходимо выбрать минимум один)'}
                        </div>
                    </div>

                    <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel} size="large">
                                Отмена
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={checkedValues.length === 0}
                                style={{
                                    background: checkedValues.length === 0 ? '#f5f5f5' : '#1890ff',
                                    borderColor: checkedValues.length === 0 ? '#d9d9d9' : '#1890ff',
                                    borderRadius: '6px'
                                }}
                            >
                                Применить ({checkedValues.length})
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            <style>{`
                :global(.custom-checkbox:hover) {
                    border-color: #1890ff !important;
                    background: #f0f8ff;
                }
                
                :global(.ant-checkbox-wrapper-checked) {
                    border-color: #1890ff !important;
                    background: #e6f7ff;
                }
                
                :global(.ant-checkbox-inner) {
                    border-radius: 4px;
                }
            `}</style>
        </>
    );
};