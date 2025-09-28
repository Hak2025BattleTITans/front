import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: string;
    children?: any
    fluid?: boolean
}

export const Container: React.FC<Props> = ({ className, fluid, children}) => {
    return (
        <div className={clsx('main-layout__container', className, {
            'main-layout__container--fluid': fluid
        })}>
            {children}
        </div>
    );
};