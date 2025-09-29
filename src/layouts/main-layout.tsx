import React, { useEffect } from 'react';
import './style.scss'
import { Header, LoadingWithTimer } from '../components';
import { Alert, Col, Divider, Menu, Row, Spin, type MenuProps } from 'antd';
import { DashboardOutlined, CalendarOutlined, UploadOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, } from 'react-router-dom';
import { useAuth, useBurgerButton, useTheme, useUploadModal } from '../providers';
import { MenuBurgerButton } from '../features/menu-burger';
import clsx from 'clsx';
import { Footer } from '../components/footer';
import { useSessionLoader } from '@/features/session/session-loader';
import { FileUpload } from '@/features/files/file-upload';

interface Props {
    className?: string;
    children?: any
}

type MenuItem = Required<MenuProps>['items'][number];

interface MenuItemConfig {
    key: string;
    label: string;
    icon: React.ReactNode;
    path?: string;
    danger?: boolean
    onClick?: () => void
}
export const MainLayout: React.FC<Props> = ({ }) => {
    const { openUploadModal } = useUploadModal();
    const { isMenuOpen, closeMenu } = useBurgerButton();
    const { logout } = useAuth();
    const { loading: sessionLoading, sessionEmpty } = useSessionLoader();
    const { theme } = useTheme();

    const location = useLocation();

    useEffect(() => {
        closeMenu();
    }, [location])

    const menuConfig: MenuItemConfig[] = [
        {
            key: 'dashboard',
            label: 'Дашборд',
            icon: <DashboardOutlined />,
            path: '/'
        },
        {
            key: 'calendar',
            label: 'Расписание',
            icon: <CalendarOutlined />,
            path: '/calendar'
        },
        {
            key: 'upload',
            label: 'Загрузить файл',
            icon: <UploadOutlined />,
            onClick: openUploadModal,
        },
        {
            key: 'logout',
            label: 'Выйти',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: logout
        }
    ];

    const createMenuItems = (config: MenuItemConfig[]): MenuItem[] => {
        return config.map(item => ({
            key: item.path ?? item.key,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
            icon: item.icon,
            onClick: item.onClick,
            danger: item.danger,
        })) as any[];
    };

    const menuItems = createMenuItems(menuConfig);

    const activeItem = menuConfig
        .filter(item => item.path && location.pathname.startsWith(item.path))
        .sort((a, b) => (b.path!.length - a.path!.length))[0];

    return (
        <div className="main-layout">
            <LoadingWithTimer spinning={sessionLoading}>
                <Header />
                <div className='main-layout__content'>
                    {sessionEmpty
                        ? (
                            <>
                                {sessionLoading
                                    ? <div><Spin /></div>
                                    : (
                                        <div className='main-layout__body'>
                                            <Row>
                                                <Col xs={24} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                                    <div className='main-layout__upload'>
                                                        <Alert
                                                            message="Для работы необходимо загрузить .csv файл с данными о рейсах"
                                                            type='warning'
                                                            style={{
                                                                borderColor: 'orange',
                                                                background: 'orange',
                                                                fontWeight: 500,
                                                                textAlign: 'center'
                                                            }}
                                                        />
                                                        <Divider />
                                                        <FileUpload 
                                                            onFileUploaded={() => {
                                                                setTimeout(()=>{
                                                                    window.location.reload();
                                                                }, 200)
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                }
                            </>
                        )
                        : (
                            <>
                                <aside className={clsx('main-sidebar', { 'main-sidebar--opened': isMenuOpen })}>
                                    <div className={clsx('main-sidebar__btn-wrap d-lg-none')}>
                                        <MenuBurgerButton className={clsx('main-sidebar__button')} />
                                    </div>
                                    <Menu
                                        mode="inline"
                                        theme={theme}
                                        items={menuItems}
                                        selectedKeys={activeItem?.path ? [activeItem.path] : []}
                                    />
                                </aside>

                                <div className='main-layout__body'>
                                    <Outlet />
                                </div>
                            </>
                        )
                    }
                </div>

                <Footer />
            </LoadingWithTimer>
        </div>
    );
};

export default MainLayout;
// 9224FF