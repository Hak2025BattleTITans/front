import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useBurgerButton } from '../../../providers';

interface Props {
    className?: string;
}

export const MenuBurgerButton: React.FC<Props> = ({ className }) => {
    const { isMenuOpen, closeMenu, openMenu } = useBurgerButton();

    const handleClick = () => {
        if(isMenuOpen){
            closeMenu();
        }else {
            openMenu();
        }
    }

    return (
        <Button
            className={clsx('burger-button', className)}
            icon={isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={handleClick}
        />
    );
};