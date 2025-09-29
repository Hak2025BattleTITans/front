import { Card } from 'antd';
import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';
import { TrendingDown, TrendingUp } from 'lucide-react';


interface MetricCardProps {
    title: string;
    icon: React.ReactNode;
    defaultValue: number;
    optimizedValue: number;
    change: number;
    showOptimized: boolean;
    format?: "number" | "currency";
    lessThenBetter?: boolean
}


export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    icon,
    defaultValue,
    optimizedValue,
    change,
    showOptimized,
    format = "number",
    lessThenBetter = false,
}) => {
    const isPositive = lessThenBetter ? change < 0 : change > 0;

    const badgeStyle = {
        fontSize: 12,
        background: isPositive ? "#f6ffed" : "#ffb4aaff",
        border: "1px solid",
        borderColor: isPositive ? "#52c41a" : "#f02409ff",
        padding: "2px 6px",
        borderRadius: 4,
        color: isPositive ? "#52c41a" : "#f02409ff",
    };

    const trendColor = isPositive ? "#52c41a" : "#df3d28ff";

    return (
        <Card
            size="small"
            variant="borderless"
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {title}
                    {showOptimized && (
                        <span style={badgeStyle}>
                            {change}%
                        </span>
                    )}
                </div>
            }
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {icon}
                <div style={{ flex: 1 }}>
                    <AnimatedNumber
                        value={optimizedValue || defaultValue}
                        defaultValue={defaultValue}
                        showOptimized={showOptimized}
                        format={format}
                    />
                    <div
                        style={{
                            color: trendColor,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            height: 20,
                        }}
                    >
                        {showOptimized && (
                            <>
                                {isPositive ? (
                                    <TrendingUp size={16} />
                                ) : (
                                    <TrendingDown size={16} />
                                )}
                                {change}%
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};