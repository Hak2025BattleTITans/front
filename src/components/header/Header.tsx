import React from 'react';
import { Button, Col, Row, Space, } from 'antd'
import { Container } from '../Container';
import './style.scss'
import logoImg from '../../assets/images/logo.svg'
import afltLogo from '../../assets/images/aflt.svg'

import { MenuBurgerButton } from '../../features/menu-burger';
import { useTheme } from '@/providers';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = () => {
    const {theme, toggleTheme} = useTheme();

    return (
        <header className='header'>
            <Container fluid>
                <Row style={{ width: '100%' }}>
                    <Col xs={8} className='header__col'>
                        <img src={afltLogo} className='header__program-logo' />
                    </Col>
                    <Col xs={8} className='header__col header__col--center'>
                        <img src={logoImg} alt="logo" className='header__logo d-none d-md-block' />
                    </Col>
                    <Col xs={8} className='header__actions header__col'>
                        <Space>
                            <MenuBurgerButton className='d-lg-none' />
                            <Button
                                shape='circle'
                                icon={theme === 'dark' ? <SunOutlined/> : <MoonOutlined />}
                                size='large'
                                type='primary'
                                onClick={toggleTheme}
                            />
                        </Space>
                    </Col>
                </Row>
            </Container>
        </header>
    );
};