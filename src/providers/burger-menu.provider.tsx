import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface MenuContext {
    isMenuOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
}

const BurgerMenuContext = createContext<MenuContext | undefined>(undefined);

interface BurgerProviderProps {
    children: ReactNode;
}

export const BurgerMenuProvider: React.FC<BurgerProviderProps> = ({ children }) => {
     const [isMenuOpen, setMenuOpen] = useState(false);

    // Функция проверки ширины экрана
    const checkScreenSize = () => {
        if (window.innerWidth > 992) {
            setMenuOpen(false); // Закрываем меню на больших экранах
        }
    };

    useEffect(() => {
        // Проверяем при монтировании компонента
        checkScreenSize();

        // Добавляем слушатель изменения размера окна
        window.addEventListener('resize', checkScreenSize);

        // Убираем слушатель при размонтировании
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const openMenu = () => {
        // Не открываем меню на больших экранах
        if (window.innerWidth <= 992) {
            setMenuOpen(true);
        }
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <BurgerMenuContext.Provider value={{isMenuOpen, openMenu, closeMenu}}>
            {children}
        </BurgerMenuContext.Provider>
    )
}

export const useBurgerButton = () => {
    const context = useContext(BurgerMenuContext);

    if (context === undefined) {
        throw new Error('useUploadModal must be used within an UploadModalProvider');
    }

    return context;
};