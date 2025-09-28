import axios from "../../../config/axios";
import React from "react"

/**
 * Хук-функция для отправки запроса на API для получения графиков
 * @returns 
 */
export const usePieChart = () => {
    // Хранит и устанавливает состояние загрузки (true | false)
    const [loading, setLoading] = React.useState(false);

    // Хранит URL ссылку картинки с графиком
    const [chartImage, setChartImage] = React.useState<string | null>(null)

    // При открытии страницы делаем запрос
    React.useEffect(() => {
        fetchChart();
    }, []);

    // Функция для запроса на REST API для получения изображения графика
    const fetchChart = async () => {
        try {
            // устанавливаем статус "Загрузки" при запросе
            setLoading(true)

            // делаем запрос на сервер
            const { data } = await axios.get(`/charts/pie?ext=png`);

            // При успешном выполнении запроса сохраняем url картинки в стейт
            setChartImage(data?.url);
        } catch (err) {
            //message.warning("Не удалось загрузить график");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        chartImage
    }
}