import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useRestaurant } from "../context/RestaurantContext";

const Orders = () => {
  const [pedidosActivos, setPedidosActivos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({ cola: 0, prep: 0, listos: 0, servidos: 0 });

  const cargarPedidos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/pedidos");
      const todosLosPedidos = await res.json();
      
      const nuevosStats = {
        cola: todosLosPedidos.filter(p => p.estadoNombre === "En Cola").length,
        prep: todosLosPedidos.filter(p => p.estadoNombre === "En Preparación").length,
        listos: todosLosPedidos.filter(p => p.estadoNombre === "Listo para Servir").length,
        servidos: todosLosPedidos.filter(p => p.estadoNombre === "Servido").length
      };
      setStats(nuevosStats);

      const soloActivos = todosLosPedidos.filter(p => 
        p.estadoNombre !== "Cancelado" && p.estadoNombre !== "Servido"
      );
      setPedidosActivos(soloActivos);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Pedidos</h1>
            <p className="text-gray-500 mt-1">Gestiona los pedidos del restaurante</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input type="text" placeholder="Buscar..." className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm w-64 shadow-sm outline-none focus:ring-2 focus:ring-vino-800" />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-180px)]">
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-xl font-serif">Pedidos Activos ({pedidosActivos.length})</h3>
                <button onClick={() => setModalAbierto(true)} className="bg-vino-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-vino-800 transition-transform active:scale-95 flex items-center gap-2">
                    <span>+</span> Nuevo Pedido
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {loading ? <div className="text-center py-20 text-gray-400">Cargando...</div> : 
                 pedidosActivos.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-xl bg-white">
                        <span className="text-6xl mb-4 text-gray-200">🛒</span>
                        <p className="font-medium">No hay pedidos pendientes</p>
                    </div>
                ) : (
                    pedidosActivos.map(p => (
                        <div key={p.id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-center animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                                    p.tipo === 'DELIVERY' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                    {p.tipo === 'DELIVERY' ? '🛵' : '🍽️'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">#{p.id} - {p.nombreCliente}</h4>
                                    <div className="text-sm text-gray-500 flex gap-3">
                                        <span>{p.tipo === 'EN_MESA' ? `Mesa ${p.idMesa}` : p.direccion}</span>
                                        <span>•</span>
                                        <span>{p.items ? p.items.length : 0} items</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                    p.estadoNombre === 'En Cola' ? 'bg-gray-100 text-gray-600' :
                                    p.estadoNombre === 'En Preparación' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {p.estadoNombre}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-800 text-xl font-serif mb-6">Resumen del Día</h3>
            <div className="space-y-4">
                <ResumenCard label="Pedidos en cola" count={stats.cola} color="bg-blue-500" />
                <ResumenCard label="En preparación" count={stats.prep} color="bg-yellow-500" />
                <ResumenCard label="Listos para servir" count={stats.listos} color="bg-green-500" />
                <ResumenCard label="Servidos hoy" count={stats.servidos} color="bg-gray-400" />
            </div>
          </div>
        </div>

        {modalAbierto && <NewOrderModal onClose={() => { setModalAbierto(false); cargarPedidos(); }} />}
      </div>
    </div>
  );
};

const ResumenCard = ({ label, count, color }) => (
    <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
        <div><p className="text-sm text-gray-500 mb-1">{label}</p><div className={`w-3 h-3 rounded-full ${color}`}></div></div>
        <span className="text-2xl font-bold text-gray-800 font-serif">{count}</span>
    </div>
);

const NewOrderModal = ({ onClose }) => {
    const { menu, mesas, refreshMenu, refreshMesas } = useRestaurant();
    
    const [tipo, setTipo] = useState("EN_MESA"); 
    const [mesaId, setMesaId] = useState("");
    const [direccion, setDireccion] = useState("");
    const [cliente, setCliente] = useState("");
    
    const [busqueda, setBusqueda] = useState("");
    const [catActiva, setCatActiva] = useState("Todos");
    const [carrito, setCarrito] = useState([]);

    useEffect(() => { refreshMenu(); refreshMesas(); }, []);

    const categorias = ["Todos", "Entradas", "Principales", "Postres", "Bebidas", "Especiales"];
    const itemsFiltrados = menu.filter(item => (catActiva === "Todos" || item.categoria === catActiva) && item.nombre.toLowerCase().includes(busqueda.toLowerCase()) && item.disponible);

    const agregarAlCarrito = (item) => setCarrito([...carrito, item]);
    const quitarDelCarrito = (idx) => { const n = [...carrito]; n.splice(idx, 1); setCarrito(n); };

    const confirmarPedido = async () => {
        if (carrito.length === 0) return alert("Carrito vacío");
        if (!cliente) return alert("Ingresa nombre del cliente");
        if (tipo === "EN_MESA" && !mesaId) return alert("Selecciona mesa");
        if (tipo === "DELIVERY" && !direccion) return alert("Ingresa dirección");

        let tipoBackend = tipo;
        let datoExtra = "";

        if (tipo === "EN_MESA") {
            tipoBackend = "EN_MESA";
            datoExtra = mesaId;
        } else if (tipo === "DELIVERY") {
            tipoBackend = "DELIVERY";
            datoExtra = direccion;
        } else if (tipo === "PARA_LLEVAR") {
            tipoBackend = "DELIVERY";
            datoExtra = "Recoger en Local"; 
        }

        const idPedido = Math.floor(Math.random() * 10000) + 1;

        try {
            await fetch(`http://localhost:8080/api/pedidos?tipo=${tipoBackend}&id=${idPedido}&cliente=${cliente}&datoExtra=${datoExtra}`, { method: "POST" });
            
            const promesas = carrito.map(item => 
                fetch(`http://localhost:8080/api/pedidos/${idPedido}/items`, {
                    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: item.nombre })
                })
            );
            await Promise.all(promesas);
            alert("✅ Pedido creado");
            onClose();
        } catch (error) { alert("Error al crear pedido"); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden animate-scale-in">
                <div className="flex-1 flex flex-col bg-gray-50 border-r border-gray-200">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-gray-800">Nuevo Pedido</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Pedido</label>
                                <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white focus:ring-2 focus:ring-vino-800"
                                    value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                    <option value="EN_MESA">En sala</option>
                                    <option value="DELIVERY">Delivery (Moto)</option>
                                    <option value="PARA_LLEVAR">Para Llevar (Pick-up)</option>
                                </select>
                            </div>

                            {}
                            <div>
                                {tipo === "EN_MESA" && (
                                    <>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mesa</label>
                                        <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white" value={mesaId} onChange={e => setMesaId(e.target.value)}>
                                            <option value="">Seleccionar mesa</option>
                                            {mesas.map(m => <option key={m.id} value={m.id}>Mesa {m.id} ({m.estado})</option>)}
                                        </select>
                                    </>
                                )}
                                {tipo === "DELIVERY" && (
                                    <>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 bg-white" placeholder="Ej: Av. Las Americas #123" value={direccion} onChange={e => setDireccion(e.target.value)} />
                                    </>
                                )}
                                {tipo === "PARA_LLEVAR" && (
                                    <>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ubicación</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-100 text-gray-500" value="Recoger en Local" disabled />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Cliente *</label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-vino-800" placeholder="Nombre..." value={cliente} onChange={e => setCliente(e.target.value)} />
                        </div>

                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                            <input type="text" placeholder="Buscar platos..." className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-vino-800" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex gap-2 px-6 pt-4 overflow-x-auto bg-white border-b border-gray-200">
                        {categorias.map(cat => (
                            <button key={cat} onClick={() => setCatActiva(cat)} className={`px-4 py-2 text-sm font-semibold border-b-2 whitespace-nowrap ${catActiva === cat ? "border-vino-800 text-vino-800" : "border-transparent text-gray-500"}`}>{cat}</button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {itemsFiltrados.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-vino-300 transition-all cursor-pointer group relative" onClick={() => agregarAlCarrito(item)}>
                                    <h4 className="font-bold text-gray-800 mb-1">{item.nombre}</h4>
                                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.descripcion}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <p className="font-serif font-bold text-lg text-vino-900">Bs {item.precio || item.precioBase}</p>
                                        <button className="w-8 h-8 rounded-full bg-vino-900 text-white flex items-center justify-center shadow">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-[400px] bg-white flex flex-col h-full border-l border-gray-200 shadow-xl z-10">
                    <div className="p-6 border-b border-gray-200"><h3 className="font-serif font-bold text-xl">🛒 Pedido ({carrito.length})</h3></div>
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-3">
                        {carrito.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                                <div><p className="font-bold text-sm text-gray-800">{item.nombre}</p><p className="text-xs text-gray-500">Bs {item.precio || item.precioBase}</p></div>
                                <button onClick={() => quitarDelCarrito(idx)} className="text-red-400 hover:text-red-600">✕</button>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 bg-white border-t border-gray-200">
                        <div className="flex justify-between mb-4"><span className="text-gray-600">Total</span><span className="text-2xl font-bold">Bs {carrito.reduce((acc, i) => acc + (i.precio || i.precioBase), 0).toFixed(2)}</span></div>
                        <button onClick={confirmarPedido} className="w-full bg-vino-900 text-white py-4 rounded-xl font-bold hover:bg-vino-800 transition-transform active:scale-[0.98]">Confirmar Pedido</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;