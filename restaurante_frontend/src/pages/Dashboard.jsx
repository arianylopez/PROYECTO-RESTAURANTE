import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom"; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    pedidosActivos: 0,
    mesasOcupadas: 0,
    reservasHoy: 0, 
    totalMesas: 10
  });
  const [mesas, setMesas] = useState([]);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);

  const cargarDatos = async () => {
    try {
      const resPedidos = await fetch("http://localhost:8080/api/pedidos");
      const pedidos = await resPedidos.json();

      const resMesas = await fetch("http://localhost:8080/api/mesas");
      const dataMesas = await resMesas.json();
      setMesas(dataMesas);

      
      const ventas = pedidos
        .filter(p => p.estadoNombre !== 'Cancelado')
        .reduce((total, p) => {
           const subtotal = p.items ? p.items.reduce((s, i) => s + i.precio, 0) : 0;
           return total + subtotal + (p.direccion ? 15 : 0); 
        }, 0);

      const activos = pedidos.filter(p => p.estadoNombre !== 'Servido' && p.estadoNombre !== 'Cancelado').length;
      const ocupadas = dataMesas.filter(m => m.estado === 'Ocupada').length;

      const recientes = [...pedidos].sort((a, b) => b.id - a.id).slice(0, 5);
      setPedidosRecientes(recientes);

      setStats({
        ventasHoy: ventas,
        pedidosActivos: activos,
        mesasOcupadas: ocupadas,
        reservasHoy: 0, 
        totalMesas: dataMesas.length
      });

    } catch (error) {
      console.error("Error cargando dashboard", error);
    }
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 font-sans">
        
        {}
        <header className="flex justify-between items-center mb-8">
            <div>
                [cite_start]<h1 className="text-3xl font-bold text-gray-800">Dashboard [cite: 1]</h1>
                <p className="text-gray-500 mt-1">sábado, 6 de diciembre</p>
            </div>
            <div className="flex items-center gap-4">
                 <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    <input type="text" placeholder="Buscar..." className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vino-800 w-64 shadow-sm" />
                 </div>
                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer">
                    <span className="text-sm font-bold text-gray-700">Administrador</span>
                    <span className="text-xs">▼</span>
                 </div>
            </div>
        </header>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Mesas Ocupadas" 
            value={`${stats.mesasOcupadas}/${stats.totalMesas}`} 
            icon="👥" 
            bgIcon="bg-vino-50 text-vino-800"
          />
          <StatCard 
            title="Reservas Hoy" 
            value={stats.reservasHoy} 
            icon="📅" 
             bgIcon="bg-orange-50 text-orange-600"
          />
          <StatCard 
            title="Pedidos Activos" 
            value={stats.pedidosActivos} 
            icon="📋" 
             bgIcon="bg-yellow-50 text-yellow-600"
          />
          <StatCard 
            title="Ventas Hoy" 
            value={`Bs ${stats.ventasHoy.toFixed(2)}`} 
            icon="📈" 
             bgIcon="bg-green-50 text-green-600"
          />
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ActionButton to="/reservations" icon="📅" label="Nueva Reserva" color="text-vino-900"/>
            <ActionButton to="/orders" icon="📝" label="Nuevo Pedido" color="text-vino-900"/>
            <ActionButton to="/kitchen" icon="👨‍🍳" label="Ver Cocina" color="text-yellow-700"/>
            <ActionButton to="/delivery" icon="🛵" label="Delivery" color="text-blue-700"/>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-fit">
          
          {}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-800 text-xl font-serif">Plano del Salón</h3>
                <div className="flex gap-4 text-xs font-medium text-gray-600">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-400"></span> Disponible</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Ocupada</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Reservada</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Limpieza</span>
                </div>
            </div>
            
            {}
            <div className="grid grid-cols-5 gap-4">
                 {mesas.map((mesa) => (
                    <div 
                        key={mesa.id}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all shadow-sm ${
                            mesa.estado === 'Disponible' ? 'bg-green-50 border-green-200 text-green-700' :
                            mesa.estado === 'Ocupada' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-yellow-50 border-yellow-200 text-yellow-700'
                        }`}
                    >
                        <span className="font-bold text-xl mb-1">{mesa.id}</span>
                        <div className="flex items-center gap-1 text-xs opacity-80">
                            <span>👥</span>
                            <span>{mesa.capacidad}</span>
                        </div>
                        <span className="text-[10px] mt-2 font-bold uppercase tracking-wide">{mesa.estado}</span>
                    </div>
                 ))}
            </div>
          </div>

          {}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-xl font-serif">Pedidos Recientes</h3>
                <Link to="/orders" className="text-sm font-medium text-gray-400 hover:text-vino-800 transition-colors">Ver todos</Link>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {pedidosRecientes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-300">
                        <span className="text-4xl mb-2">🍽️</span>
                        <p>No hay pedidos activos</p>
                    </div>
                ) : (
                    pedidosRecientes.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-vino-200 transition-colors group">
                            <div>
                                <p className="font-bold text-gray-800 text-sm group-hover:text-vino-800 transition-colors">#{p.id} - {p.nombreCliente}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <span>{p.items ? p.items.length : 0} items</span>
                                    <span>•</span>
                                    <span className={`${p.estadoNombre === 'Listo para Servir' ? 'text-green-600 font-bold' : ''}`}>{p.estadoNombre}</span>
                                </p>
                            </div>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                                p.tipo === 'DELIVERY' ? 'bg-blue-100 text-blue-600' : 'bg-vino-100 text-vino-600'
                            }`}>
                                {p.tipo === 'DELIVERY' ? '🛵' : '🍽️'}
                            </span>
                        </div>
                    ))
                )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};


const StatCard = ({ title, value, icon, bgIcon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${bgIcon}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 font-serif mt-1">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ to, icon, label, color }) => (
  <Link to={to} className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all ${color}`}>
    <span className="text-xl">{icon}</span>
    <span className="font-semibold text-gray-700">{label}</span>
  </Link>
);

export default Dashboard;