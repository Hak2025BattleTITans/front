import axiosBase from "@/config/axios";
import { useAuth, useSession } from "@/providers"
import { message } from "antd";
import { AxiosError } from "axios";
import React from "react";

export const useSessionLoader = () => {
    const { isAuthenticated } = useAuth();
    const { session, setSession } = useSession();
    const [loading, setLoading] = React.useState(false);
    const [sessionId, setSessionId] = React.useState<string | null>(null);
    const [sessionEmpty, setSessionEmpty] = React.useState(false);
    const [sessionInited, setSessionInited] = React.useState(false);

    React.useEffect(() => {
        if (!isAuthenticated) return;
        initSession();

        return () => {
            setSession(null);
        }
    }, [isAuthenticated])

    React.useEffect(() => {
        if (!isAuthenticated || !sessionId || !sessionInited) return;

        if (!session) {
            fetchSession();
        }
    }, [session, isAuthenticated, sessionId, sessionInited]);

    const fetchSession = async () => {
        try {
            setLoading(true);
            const { data } = await axiosBase.get('/session/data');

            setSession(data);
            setSessionEmpty(false);
        } catch (err) {
            if (err instanceof AxiosError) {
                setSessionEmpty(true);
                return;
            }
            console.log(err);
            message.warning('При загрузке сессии произошла ошибка')
        } finally {
            setLoading(false);
        }
    }

    const initSession = async () => {
        try {
            setLoading(true);
            const token = window.localStorage.getItem('session');

            const { data } = await axiosBase.get('/session', {
                headers: {
                    'x-session-id': token,
                }
            });

            const id = data?.session_id || null;

            if(id !== token){
                window.localStorage.setItem('session', id);
            }

            setSessionId(data?.session_id || null);
            setSessionInited(true);

            axiosBase.defaults.headers.common['x-session-id'] = id;
        } catch (err) {
            message.warning('Не удалось получить данные сессии');
        } finally {
            setLoading(false);
        }
    }

    return {
        session,
        loading,
        sessionEmpty,
        refetch: fetchSession,
    }
}