import React from 'react';
import './loader.scss'
import clsx from 'clsx';
import { LoadingWithTimer } from '../LoadingWithTimer';

interface Props {
    className?: string;
    isLoading?: boolean
}

export const PageLoader: React.FC<Props> = ({ className }) => {
    return (
        <div className={clsx('page-loader', className)}>
            <LoadingWithTimer size='large' tip="Загрузка..." >
               <span style={{opacity: 0}}>loading</span>
            </LoadingWithTimer>
        </div>
    );
};