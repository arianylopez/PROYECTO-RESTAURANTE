import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-vino-800 h-screen text-white flex flex-col fixed left-0 top-0 border-r border-vino-900 shadow-xl z-50">
      <div className="p-6 text-2xl font-bold flex items-center gap-2 border-b border-vino-900 bg-vino-900/50">
        <span>🍽️ La Mesa</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <MenuItem to="/dashboard" icon="📊" label="Dashboard" active={isActive("/dashboard")} />
        <MenuItem to="/tables" icon="🪑" label="Mesas" active={isActive("/tables")} />
        
        {}
        <MenuItem to="/reservations" icon="📅" label="Reservas" active={isActive("/reservations")} />
        
        <MenuItem to="/menu" icon="📜" label="Menú" active={isActive("/menu")} />
        <MenuItem to="/orders" icon="📝" label="Pedidos" active={isActive("/orders")} />
        <MenuItem to="/kitchen" icon="👨‍🍳" label="Cocina" active={isActive("/kitchen")} />
        <MenuItem to="/delivery" icon="🛵" label="Delivery" active={isActive("/delivery")} />
        <MenuItem to="/billing" icon="🧾" label="Facturación" active={isActive("/billing")} />
        <MenuItem to="/promotions" icon="🏷️" label="Promociones" active={isActive("/promotions")} />
        <MenuItem to="/settings" icon="⚙️" label="Configuración" active={isActive("/settings")} />
      </nav>
      
      <div className="p-4 bg-vino-900 text-xs text-center text-gray-400">
        Sistema Restaurante v1.0
      </div>
    </div>
  );
};

const MenuItem = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
      active 
        ? "bg-white text-vino-800 font-bold shadow-md translate-x-1" 
        : "text-gray-200 hover:bg-vino-700 hover:text-white"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Sidebar;