import { useEffect, useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const Tables = () => {
  const { mesas, refreshMesas, loading } = useRestaurant();
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  useEffect(() => {
    refreshMesas();
    const interval = setInterval(refreshMesas, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mesas.length > 0 && !mesaSeleccionada) {
      setMesaSeleccionada(mesas[0]);
    }
  }, [mesas]);

  const cambiarEstado = async (nuevoEstado) => {
    if (!mesaSeleccionada) return;

    setMesaSeleccionada({ ...mesaSeleccionada, estado: nuevoEstado });

    try {
      await fetch(`http://localhost:8080/api/mesas/${mesaSeleccionada.id}/estado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      refreshMesas();
      
    } catch (error) {
      console.error("Error actualizando mesa:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        
        {}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Gestión de Mesas</h1>
            <p className="text-gray-500 mt-1">Administra el estado de las mesas</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {}
          <div className="lg:col-span-2 bg-[#FDFBF7] p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-800 text-xl font-serif">Plano del Salón</h3>
              <div className="flex gap-4 text-xs font-medium text-gray-600">
                <LegendItem color="bg-green-400" label="Disponible" />
                <LegendItem color="bg-vino-800" label="Ocupada" />
                <LegendItem color="bg-yellow-400" label="Reservada" />
                <LegendItem color="bg-gray-400" label="Limpieza" />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-400">Cargando mapa de mesas...</div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {mesas.map((mesa) => (
                  <button
                    key={mesa.id}
                    onClick={() => setMesaSeleccionada(mesa)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all relative ${
                      mesa.estado === 'Disponible' ? 'bg-green-50 border-green-200 text-green-800' :
                      mesa.estado === 'Ocupada' ? 'bg-vino-50 border-vino-200 text-vino-800' :
                      mesa.estado === 'Reservada' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                      'bg-gray-100 border-gray-300 text-gray-600'
                    } ${
                      mesaSeleccionada?.id === mesa.id ? 'ring-2 ring-offset-2 ring-vino-800 scale-105 shadow-md z-10' : 'hover:scale-105'
                    }`}
                  >
                    <span className="font-bold text-2xl mb-1">{mesa.id}</span>
                    <div className="flex items-center gap-1 text-xs font-medium opacity-80">
                      <span>👥</span>
                      <span>{mesa.capacidad}</span>
                    </div>
                    {}
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/50">
                      {mesa.estado}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-8">
            {mesaSeleccionada ? (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Mesa {mesaSeleccionada.id}</h2>
                
                <div className="mb-8">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Capacidad</p>
                  <p className="text-xl font-medium text-gray-800">{mesaSeleccionada.capacidad} personas</p>
                </div>

                {}
                <div className="mb-8">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2 block">Estado</label>
                  <div className="relative">
                    <select
                      value={mesaSeleccionada.estado}
                      onChange={(e) => cambiarEstado(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-vino-800 focus:border-transparent font-medium cursor-pointer shadow-sm transition-colors hover:border-vino-300"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Ocupada">Ocupada</option>
                      <option value="Reservada">Reservada</option>
                      <option value="Limpieza">Limpieza</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-4">
                  <Link 
                    to="/orders" 
                    state={{ mesaId: mesaSeleccionada.id }}
                    className="block w-full bg-vino-900 hover:bg-vino-800 text-white text-center font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>📝</span> Nuevo Pedido
                  </Link>
                  
                  <button 
                    onClick={() => alert("Módulo de reservas en construcción")}
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>📅</span> Nueva Reserva
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <span className="text-4xl block mb-4">👈</span>
                <p>Selecciona una mesa para ver detalles</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
    <span>{label}</span>
  </div>
);

export default Tables;