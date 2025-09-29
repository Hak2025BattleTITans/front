import { Spin } from 'antd';
import { useState, useEffect, useRef } from 'react';
import type { SpinProps, } from 'antd/es/spin';

interface Props extends SpinProps { }

export const LoadingWithTimer: React.FC<Props> = ({ spinning, ...props }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (spinning) {
            // Запускаем таймер при начале загрузки
            startTimeRef.current = Date.now();
            intervalRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
                    setElapsedTime(seconds);
                }
            }, 1000);
        } else {
            // Останавливаем таймер при окончании загрузки
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setElapsedTime(0);
            startTimeRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [spinning]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Spin
            {...props}
            spinning={spinning}
            tip={(
                <div style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 20
                }}>
                    <div>Загрузка...</div>
                    <div>{formatTime(elapsedTime)}</div>
                </div>
            )}
        />
    );
};