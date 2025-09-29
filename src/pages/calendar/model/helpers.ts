import type { ScheduleItem } from "@/types";

export const calculateAverageTicket = (flights: ScheduleItem[]) => {
    if (!Array.isArray(flights) || flights.length === 0) {
        return 0;
    }

    let totalIncome = 0;
    let totalPassengers = 0;

    for (const flight of flights) {
        // Проверяем, что значения существуют и являются числами
        if (flight.pass_income && flight.passengers &&
            typeof flight.pass_income === 'number' &&
            typeof flight.passengers === 'number' &&
            flight.passengers > 0) {

            totalIncome += flight.pass_income;
            totalPassengers += flight.passengers;
        }
    }

    // Избегаем деления на ноль
    if (totalPassengers === 0) {
        return 0;
    }

    return totalIncome / totalPassengers;
}

export const calculateTotalIncome = (flights: ScheduleItem[]) => {
    if (!Array.isArray(flights) || flights.length === 0) {
        return 0;
    }

    let totalIncome = 0;

    for (const flight of flights) {
        // Проверяем, что значения существуют и являются числами
        if (flight.pass_income && typeof flight.pass_income === 'number') {
            totalIncome += flight.pass_income;
        }
    }

    return totalIncome;
}

export const calculateTotalPassengers = (flights: ScheduleItem[]) => {
    if (!Array.isArray(flights) || flights.length === 0) {
        return 0;
    }

    let total = 0;

    for (const flight of flights) {
        // Проверяем, что значения существуют и являются числами
        if (flight.passengers && typeof flight.passengers === 'number' && flight.passengers > 0) {
            total += flight.passengers;
        }
    }

    return total;
}