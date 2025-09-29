import React from 'react';
import { Home } from './pages';
import { ConfigProvider } from 'antd';
import ruRu from 'antd/locale/ru_RU';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts';
import { CalendarPage } from './pages/calendar';
import { AuthProvider, BurgerMenuProvider, SessionProvider, ThemeProvider, UploadModalProvider } from './providers';
import { AuthPage } from './pages/auth';
import { PrivateRoute, PublicRoute } from './components/guard';

interface Props {
  className?: string;
}

const App: React.FC<Props> = () => {
  return (
    <ConfigProvider locale={ruRu}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SessionProvider>
              <BurgerMenuProvider>
                <UploadModalProvider>
                  <div className="main-app">
                    <Routes>
                      {/* --------- Роуты без лейаута --------- */}
                      <Route
                        path="/auth"
                        element={
                          <PublicRoute>
                            <AuthPage />
                          </PublicRoute>
                        }
                      />

                      {/* --------- Роуты с лейаутом --------- */}
                      <Route element={<MainLayout />}>
                        <Route
                          path="/"
                          element={
                            <PrivateRoute>
                              <Home />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/calendar"
                          element={
                            <PrivateRoute>
                              <CalendarPage />
                            </PrivateRoute>
                          }
                        />
                      </Route>
                    </Routes>
                  </div>
                </UploadModalProvider>
              </BurgerMenuProvider>
            </SessionProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;