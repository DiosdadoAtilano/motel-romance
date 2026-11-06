import { Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import PublicLayout from './components/PublicLayout'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import Reserve from './pages/Reserve'
import Track from './pages/Track'
import Extras from './pages/Extras'
import ConsoleLayout from './pages/console/ConsoleLayout'
import Dashboard from './pages/console/Dashboard'
import RoomsRequests from './pages/console/RoomsRequests'
import CheckIn from './pages/console/CheckIn'
import Cleaning from './pages/console/Cleaning'
import CashClose from './pages/console/CashClose'
import RoomService from './pages/console/RoomService'
import Login from './pages/console/Login'
import Users from './pages/console/Users'
import { RequireAuth, RequirePermission as P } from './pages/console/Guards'
import { AuthProvider } from './lib/auth'

export default function App() {
  return (
    <AuthProvider><StoreProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="habitaciones" element={<Rooms />} />
          <Route path="habitaciones/:slug" element={<RoomDetail />} />
          <Route path="reservar" element={<Reserve />} />
          <Route path="rastreo" element={<Track />} />
          <Route path="extras" element={<Extras />} />
        </Route>
        <Route path="consola/login" element={<Login />} />
        <Route path="consola" element={<RequireAuth />}>
          <Route element={<ConsoleLayout />}>
            <Route index element={<P perm="dashboard"><Dashboard /></P>} />
            <Route path="habitaciones" element={<P perm="rooms"><RoomsRequests /></P>} />
            <Route path="entradas" element={<P perm="checkin"><CheckIn /></P>} />
            <Route path="servicio" element={<P perm="roomservice"><RoomService /></P>} />
            <Route path="limpieza" element={<P perm="cleaning"><Cleaning /></P>} />
            <Route path="caja" element={<P perm="cash"><CashClose /></P>} />
            <Route path="usuarios" element={<P perm="users"><Users /></P>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreProvider></AuthProvider>
  )
}
