export interface Metric {
    value: number;
    optimized_value: number;
}

export interface MainMetrics {
    passengers: Metric;
    income: Metric;
    avg_check: Metric;
}

export interface ScheduleItem {
    date: string;
    flight_number: string;
    dep_airport: string;
    arr_airport: string;
    dep_time: string;
    arr_time: string;
    flight_capacity: number;
    lf_cabin: number;
    cabins_brones: number;
    flight_type: string;
    cabin_code: string;
    pass_income: number;
    passengers: number;
}

export interface ReportItem {
    id: string;
    title: string;
    src: string;
}

export interface SessionData {
    session_id: string;
    expires_at: string;
    main_metrics: MainMetrics;
    unoptimized_schedule: ScheduleItem[];
    optimized_schedule: ScheduleItem[];
    iframes: ReportItem[];
    plots: {
        optimized_plots: PlotItem[],
        plots: PlotItem[],
    }
}

export interface PlotItem {
    data: any,
    layout: any
}

export const ALGORITHM_STORAGE_KEY = 'opt_algorithms'