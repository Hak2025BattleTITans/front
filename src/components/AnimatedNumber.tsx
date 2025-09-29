import clsx from "clsx";
import React from "react";

export const AnimatedNumber: React.FC<{ value: number; defaultValue: number, showOptimized?: boolean, format?: 'number' | 'currency' }> = ({
    value,
    defaultValue,
    showOptimized,
    format = 'number'
}) => {
    const [displayValue, setDisplayValue] = React.useState(defaultValue);
    const [_, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
        if (!showOptimized) {
            setDisplayValue(defaultValue);
            return;
        }

        setIsAnimating(true);
        const startTime = Date.now();
        const duration = 800; // ms
        const startValue = defaultValue;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // easing
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (value - startValue) * easeOutQuart;

            setDisplayValue(Math.round(currentValue));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [showOptimized, value, defaultValue]);

    const formatNumber = (num: number): string => {
        if (format === 'currency') {
            return new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(num) + ' ₽';
        }

        return new Intl.NumberFormat('ru-RU').format(num);
    };

    return (
        <div
            className={clsx('animated-number', {
                //'animated-number--increasing': value > displayValue,
                //'animated-number--decreasing': value < displayValue
            })}
            style={{
                fontSize: 24,
                fontWeight: 600,
                transition: 'color 0.3s ease'
            }}
        >
            <div className='animated-number__values'>
                {!showOptimized && (
                    <span className='animated-number__new-value'>
                        {formatNumber(defaultValue)}
                    </span>)
                }
                {showOptimized && (
                    <>
                        <span className='animated-number__old-value'>
                            {formatNumber(defaultValue)} </span>
                        <span className='animated-number__new-value'>
                            {formatNumber(displayValue)}
                        </span>
                    </>)}
            </div>
        </div>
    );
};