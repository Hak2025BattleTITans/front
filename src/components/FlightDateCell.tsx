import { Badge } from "antd";
import type { Dayjs } from "dayjs";

export const FlightDateCell: React.FC<{ current: Dayjs; flightDates: Record<string, number>; originNode?: React.ReactNode }> = ({
    current,
    flightDates,
    originNode
}) => {
    const formatted = current.format("YYYY-MM-DD");
    const hasFlight = flightDates[formatted] || 0;

    return (
        <div style={{ position: "relative" }}>
            <Badge dot={hasFlight > 0}>
                {originNode || current.date()}
            </Badge>
        </div>
    );
};