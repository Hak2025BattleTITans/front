import type { MainMetrics, Metric, ReportItem, ScheduleItem, SessionData } from "@/types";
import { createContext, useContext, useState, type ReactNode } from "react";

interface SessionContextType {
    session: SessionData | null;
    setSession: (session: SessionData | null) => void;
    setMetrics: (metrics: Partial<MainMetrics>) => void;
    setMetricById: (key: keyof MainMetrics, metric: Metric) => void;
    setUnoptimizedSchedule: (schedule: ScheduleItem[]) => void;
    setOptimizedSchedule: (schedule: ScheduleItem[]) => void;
    setIframes: (iframes: ReportItem[]) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, updateSession] = useState<SessionData | null>(null);

    // 1. Установить всю сессию
    const setSession = (newSession: SessionData | null) => {
        updateSession(newSession);
    };

    // 2. Установить метрики
    const setMetrics = (metrics: Partial<MainMetrics>) => {
        if (!session) return;
        updateSession({
            ...session,
            main_metrics: {
                ...session.main_metrics,
                ...metrics,
            },
        });
    };

    // 2.1 Установить конкретную метрику по ключу 
    const setMetricById = (key: keyof MainMetrics, metric: Metric) => {
        if (!session) return;
        updateSession({
            ...session,
            main_metrics: {
                ...session.main_metrics,
                [key]: metric,
            },
        });
    }

    // 3. Установить неоптимизированное расписание
    const setUnoptimizedSchedule = (schedule: ScheduleItem[]) => {
        if (!session) return;
        updateSession({
            ...session,
            unoptimized_schedule: schedule,
        });
    };


    // 4. Установить оптимизированное расписание
    const setOptimizedSchedule = (schedule: ScheduleItem[]) => {
        if (!session) return;
        updateSession({
            ...session,
            optimized_schedule: schedule,
        });
    };

    // 5. Установить фреймы
    const setIframes = (iframes: ReportItem[]) => {
        if (!session) return;
        updateSession({
            ...session,
            iframes,
        });
    };

    return (
        <SessionContext.Provider
            value={{
                session,
                setSession,
                setMetrics,
                setMetricById,
                setUnoptimizedSchedule,
                setOptimizedSchedule,
                setIframes,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};