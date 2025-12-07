import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const Kitchen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidosCocina = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/pedidos/cocina");
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error("Error conectando a cocina:", error);
    } finally {
      setLoading(false);
    }
  };

  const avanzarEstado = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/pedidos/${id}/avanzar`, {
        method: "POST",
      });
      fetchPedidosCocina();
    } catch (error) {
      alert("Error al avanzar el pedido");
    }
  };

  useEffect(() => {
    fetchPedidosCocina(); // Carga inicial
    const interval = setInterval(fetchPedidosCocina, 2000);
    return () => clearInterval(interval);
  }, []);

  const enCola = pedidos.filter((p) => p.estadoNombre === "En Cola");
  const enPreparacion = pedidos.filter((p) => p.estadoNombre === "En Preparación");
  const listos = pedidos.filter((p) => p.estadoNombre === "Listo para Servir");

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-hidden h-screen flex flex-col">
        
        {}
        <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-serif">Cocina</h1>
              <p className="text-gray-500 mt-1">Vista de pedidos para preparación</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    <input type="text" placeholder="Buscar..." className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm w-64 shadow-sm" />
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm font-bold text-gray-700">Administrador</span>
                </div>
            </div>
        </header>

        {}
        <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
          
          {}
          <ColumnKanban 
            title="En Cola" 
            icon="🕒"
            count={enCola.length} 
            headerColor="text-blue-600"
            bgBadge="bg-blue-100 text-blue-600"
          >
            {enCola.map(p => (
              <CardPedido 
                key={p.id} 
                pedido={p} 
                onAction={() => avanzarEstado(p.id)} 
                btnText="Cocinar ▶" 
                btnColor="bg-blue-600 hover:bg-blue-700 text-white" 
              />
            ))}
          </ColumnKanban>

          {}
          <ColumnKanban 
            title="Preparando" 
            icon="👨‍🍳"
            count={enPreparacion.length} 
            headerColor="text-yellow-600"
            bgBadge="bg-yellow-100 text-yellow-600"
          >
            {enPreparacion.map(p => (
              <CardPedido 
                key={p.id} 
                pedido={p} 
                onAction={() => avanzarEstado(p.id)} 
                btnText="Terminar ✓" 
                btnColor="bg-yellow-600 hover:bg-yellow-700 text-white" 
              />
            ))}
          </ColumnKanban>

          {}
          <ColumnKanban 
            title="Listo para Servir" 
            icon="✅"
            count={listos.length} 
            headerColor="text-green-600"
            bgBadge="bg-green-100 text-green-600"
          >
            {listos.map(p => (
              <CardPedido 
                key={p.id} 
                pedido={p} 
                onAction={() => avanzarEstado(p.id)} 
                btnText="Servido ➜" 
                btnColor="bg-[#B4833E] hover:bg-[#966b30] text-white shadow-md" 
              />
            ))}
          </ColumnKanban>

        </div>
      </div>
    </div>
  );
};

const ColumnKanban = ({ title, icon, count, headerColor, bgBadge, children }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-4 px-2">
      <div className={`flex items-center gap-2 font-bold text-lg ${headerColor}`}>
        <span>{icon}</span>
        <h3>{title}</h3>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${bgBadge}`}>{count}</span>
    </div>
    
    <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
      {children.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-sm">Sin pedidos</p>
        </div>
      ) : children}
    </div>
  </div>
);

const CardPedido = ({ pedido, onAction, btnText, btnColor }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all animate-fade-in group">
    <div className="flex justify-between items-start mb-3">
      <div>
        <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-gray-800">
                {}
                {pedido.items.length}x Items
            </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span>{pedido.tipo === 'EN_MESA' ? `Mesa ${pedido.idMesa}` : '🛵 Delivery'}</span>
            <span className="text-gray-300">•</span>
            <span>#{pedido.id}</span>
        </p>
      </div>
      
      {onAction && (
        <button 
            onClick={onAction}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95 ${btnColor}`}
        >
            {btnText}
        </button>
      )}
    </div>
    
    {}
    <div className="space-y-2 border-t border-gray-50 pt-3">
      {pedido.items.map((item, idx) => (
        <div key={idx} className="text-sm text-gray-600 flex items-start gap-2">
          <span className="text-vino-800 font-bold">•</span>
          <span>{item.nombre}</span>
        </div>
      ))}
    </div>
    
    <div className="mt-3 text-[10px] text-gray-400 text-right">
        hace unos momentos
    </div>
  </div>
);

export default Kitchen;