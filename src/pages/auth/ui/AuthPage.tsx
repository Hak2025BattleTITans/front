import { LoginForm } from '@/features/login-form';
import { Card, Typography} from 'antd';
import React from 'react';
import './style.scss'

const { Title, Paragraph } = Typography;

interface Props {
    className?: string;
}

export const AuthPage: React.FC<Props> = () => {
    return (
        <div className="auth-page">
            <Card className="auth-card" style={{background: '#fff', borderColor: '#d4d4d4'}} styles={{
                body: {
                    background: '#fff'
                }
            }}>
                <Title level={2} style={{ textAlign: 'center' }}>Вход в систему</Title>
                <Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 24 }}>
                    Авторизуйтесь, чтобы продолжить
                </Paragraph>
                <LoginForm />
            </Card>
        </div>
    );
};