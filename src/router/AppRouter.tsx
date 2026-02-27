import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../config/constants'
import { LoginPage } from '../views/Login/LoginPage'
import { MapPage } from '../views/Map/MapPage'
import { QuestionPage } from '../views/Question/QuestionPage'
import { WrongBookPage } from '../views/WrongBook/WrongBookPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.root} element={<Navigate to={ROUTES.login} replace />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.map} element={<MapPage />} />
        <Route path={ROUTES.question} element={<QuestionPage />} />
        <Route path={ROUTES.wrongBook} element={<WrongBookPage />} />
      </Routes>
    </BrowserRouter>
  )
}
