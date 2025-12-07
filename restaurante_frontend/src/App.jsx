import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RestaurantProvider } from "./context/RestaurantContext";

// Importar TODAS las páginas
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Reservations from "./pages/Reservations";
import Menu from "./pages/Menu";
import Kitchen from "./pages/Kitchen";
import Orders from "./pages/Orders";
import Delivery from "./pages/Delivery";
import Billing from "./pages/Billing";
import Promotions from "./pages/Promotions"; // <--- IMPORTANTE: Importar el archivo real
import Settings from "./pages/Settings";
const Placeholder = ({ title }) => (
  <div className="flex min-h-screen bg-gray-100">
    <div className="w-64 bg-vino-800 fixed h-full"></div> 
    <div className="ml-64 p-10">
      <h1 className="text-3xl font-bold text-gray-400">🚧 {title} (En Construcción)</h1>
    </div>
  </div>
);

const App = () => (
  <RestaurantProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/delivery" element={<Delivery />} />      
        <Route path="/billing" element={<Billing />} />
        <Route path="/promotions" element={<Promotions />} /> 
        <Route path="/settings" element={<Settings />} />
        
        <Route path="*" element={<div className="p-10">404 - No encontrado</div>} />
      </Routes>
    </BrowserRouter>
  </RestaurantProvider>
);

export default App;