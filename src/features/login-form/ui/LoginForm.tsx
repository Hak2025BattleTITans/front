import { useAuth } from '@/providers';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    className?: string;
}

export const LoginForm: React.FC<Props> = ({ className }) => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            await login(values.username, values.password);
            
            setTimeout(()=>{
                navigate('/');
            }, 500)
            message.success('Вы успешно вошли!');
        } catch {
            message.error('Ошибка авторизации. Проверьте данные.');
        }
    };

    return (
        <Form className={className} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="username"
                label="Логин"
                rules={[{ required: true, message: 'Введите логин' }]}
            >
                <Input placeholder="Введите логин" size="large" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Пароль"
                rules={[{ required: true, message: 'Введите пароль' }]}
            >
                <Input.Password placeholder="Введите пароль" size="large" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isLoading}
                >
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};