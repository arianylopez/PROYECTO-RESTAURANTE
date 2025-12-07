import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const Delivery = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDelivery = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/pedidos");
      const data = await res.json();
      
      const soloDelivery = data.filter(p => 
        p.direccion !== undefined &&     
        p.direccion !== null &&          
        p.estadoNombre !== 'Servido' &&  
        p.estadoNombre !== 'Cancelado'   
      );
      
      setPedidos(soloDelivery);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const completarPedido = async (id) => {
    if(!confirm("¿Pedido entregado? Se marcará como Servido.")) return;
    
    try {
        await fetch(`http://localhost:8080/api/pedidos/${id}/avanzar`, { method: "POST" });
        cargarDelivery(); 
    } catch (e) { alert("Error de conexión"); }
  };

  useEffect(() => {
    cargarDelivery();
    const interval = setInterval(cargarDelivery, 5000);
    return () => clearInterval(interval);
  }, []);

  const paraLlevar = pedidos.filter(p => p.direccion === "Recoger en Local");
  const conMoto = pedidos.filter(p => p.direccion !== "Recoger en Local");

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Delivery & Para Llevar</h1>
            <p className="text-gray-500 mt-1">Gestiona pedidos externos</p>
          </div>
          <Link to="/orders" className="bg-vino-900 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-vino-800 transition-colors">
            + Nuevo Pedido
          </Link>
        </header>

        {loading ? <p className="text-center text-gray-400 py-20">Cargando...</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {}
            <div>
                <div className="flex items-center gap-2 mb-4 p-2 bg-white rounded-lg border border-gray-100 shadow-sm w-fit">
                    <span className="text-2xl">🛵</span>
                    <h2 className="text-lg font-bold text-gray-800 font-serif pr-2">Delivery</h2>
                    <span className="bg-vino-100 text-vino-800 text-xs font-bold px-2 py-1 rounded-full">{conMoto.length}</span>
                </div>
                <div className="space-y-4">
                    {conMoto.length === 0 && <EmptyState text="No hay envíos pendientes" icon="🛵" />}
                    {conMoto.map(p => <DeliveryCard key={p.id} pedido={p} onAction={() => completarPedido(p.id)} />)}
                </div>
            </div>

            {}
            <div>
                <div className="flex items-center gap-2 mb-4 p-2 bg-white rounded-lg border border-gray-100 shadow-sm w-fit">
                    <span className="text-2xl">🛍️</span>
                    <h2 className="text-lg font-bold text-gray-800 font-serif pr-2">Para Llevar</h2>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{paraLlevar.length}</span>
                </div>
                <div className="space-y-4">
                    {paraLlevar.length === 0 && <EmptyState text="No hay pedidos para recoger" icon="🛍️" />}
                    {paraLlevar.map(p => <DeliveryCard key={p.id} pedido={p} onAction={() => completarPedido(p.id)} isPickup />)}
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

const DeliveryCard = ({ pedido, onAction, isPickup }) => {
  const costoEnvio = isPickup ? 0 : 15;
  const totalItems = pedido.items ? pedido.items.reduce((s, i) => s + (i.precio || i.precioBase), 0) : 0;
  const total = totalItems + costoEnvio;

  const estaListo = pedido.estadoNombre === 'Listo para Servir';

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group animate-fade-in">
        <div className="flex justify-between items-start mb-3">
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-lg">#{pedido.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                        estaListo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                        {pedido.estadoNombre}
                    </span>
                </div>
                <p className="text-sm font-medium text-gray-700 mt-1 flex items-center gap-1">
                    👤 {pedido.nombreCliente}
                </p>
                
                {/* Mostrar dirección solo si es delivery de moto */}
                {!isPickup && (
                    <div className="flex items-start gap-1 text-xs text-gray-500 mt-2 bg-blue-50 px-2 py-1.5 rounded w-fit border border-blue-100">
                        <span>📍</span> 
                        <span className="font-medium text-blue-800">{pedido.direccion}</span>
                    </div>
                )}
            </div>
            
            <div className="text-right">
                <p className="font-serif font-bold text-xl text-vino-900">Bs {total.toFixed(2)}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                    {pedido.items ? pedido.items.length : 0} items
                </p>
            </div>
        </div>

        <div className="border-t border-gray-50 pt-3 mb-4">
            <div className="space-y-1">
                {pedido.items && pedido.items.map((it, idx) => (
                    <div key={idx} className="text-sm text-gray-600 flex justify-between">
                        <span>• {it.nombre}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        {estaListo ? (
            <button 
                onClick={onAction}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
                <span>{isPickup ? '✅ Entregar al Cliente' : '🛵 Despachar Moto'}</span>
            </button>
        ) : (
            <div className="w-full bg-gray-100 text-gray-400 text-sm font-bold py-2.5 rounded-lg text-center cursor-not-allowed flex items-center justify-center gap-2">
                <span>🕒</span> Esperando Cocina...
            </div>
        )}
    </div>
  );
};

const EmptyState = ({ text, icon }) => (
    <div className="h-40 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <span className="text-4xl mb-2 opacity-50">{icon}</span>
        <p className="text-sm font-medium">{text}</p>
    </div>
);

export default Delivery;