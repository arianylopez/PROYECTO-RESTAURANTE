import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null); // Si es null, es modo CREAR

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precioBase: "",
    tiempoEstimado: "",
    categoria: "Entradas",
    disponible: true
  });

  const categorias = ["Todas", "Entradas", "Principales", "Postres", "Bebidas", "Especiales"];

  const cargarMenu = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/menu");
      const data = await res.json();
      setItems(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarMenu(); }, []);

  const abrirModal = (item = null) => {
    if (item) {
      setItemEditando(item);
      setFormData({
        nombre: item.nombre,
        descripcion: item.descripcion,
        precioBase: item.precio, 
        tiempoEstimado: item.tiempoEstimado,
        categoria: item.categoria,
        disponible: item.disponible
      });
    } else {
      setItemEditando(null);
      setFormData({ nombre: "", descripcion: "", precioBase: "", tiempoEstimado: "", categoria: "Entradas", disponible: true });
    }
    setModalAbierto(true);
  };

  const guardarItem = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      precio: parseFloat(formData.precioBase),
      tiempoEstimado: parseInt(formData.tiempoEstimado),
      id: itemEditando ? itemEditando.id : 0
    };

    const url = itemEditando 
      ? `http://localhost:8080/api/menu/${itemEditando.id}` 
      : "http://localhost:8080/api/menu";                  

    const method = itemEditando ? "PUT" : "POST";

    await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setModalAbierto(false);
    cargarMenu();
  };

  const itemsVisibles = categoriaActiva === "Todas" 
    ? items 
    : items.filter(i => i.categoria === categoriaActiva);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        
        {}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Menú</h1>
            <p className="text-gray-500 mt-1">Gestiona los platos y bebidas</p>
          </div>
          
          <div className="flex gap-4">
            <input type="text" placeholder="Buscar en el menú..." className="bg-white border border-gray-200 rounded-lg pl-4 pr-4 py-2 text-sm w-64 shadow-sm outline-none focus:ring-2 focus:ring-vino-800" />
            <button 
              onClick={() => abrirModal()}
              className="bg-vino-900 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-vino-800 transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Nuevo Plato
            </button>
          </div>
        </header>

        {}
        <div className="flex gap-2 mb-8 border-b border-gray-200 pb-1 overflow-x-auto">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-6 py-2 rounded-t-lg text-sm font-semibold transition-all relative top-1 ${
                categoriaActiva === cat 
                  ? "bg-white text-vino-900 border border-gray-200 border-b-white z-10" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsVisibles.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
              
              <div className="flex justify-between items-start mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.categoria === 'Entradas' ? 'bg-green-100 text-green-700' :
                  item.categoria === 'Principales' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.categoria}
                </span>
                <button 
                  onClick={() => abrirModal(item)}
                  className="text-gray-400 hover:text-vino-800 text-sm font-medium border border-gray-200 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                >
                  Editar
                </button>
              </div>

              <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">{item.nombre}</h3>
              <p className="text-gray-500 text-sm mb-6 h-10 overflow-hidden text-ellipsis leading-relaxed">
                {item.descripcion}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <span className="font-bold text-xl text-vino-900 font-serif">Bs {item.precio || item.precioBase}</span>
                {item.tiempoEstimado > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>⏱</span>
                    <span>{item.tiempoEstimado} min</span>
                  </div>
                )}
                {!item.disponible && (
                    <span className="ml-auto text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Agotado</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-scale-in">
              <button onClick={() => setModalAbierto(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 text-xl">✕</button>
              
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                {itemEditando ? "Editar Plato" : "Nuevo Plato"}
              </h2>
              
              <form onSubmit={guardarItem} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nombre *</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                    value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Descripción</label>
                  <textarea className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800 h-24 resize-none"
                    value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Precio (Bs) *</label>
                    <input type="number" step="0.5" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                      value={formData.precioBase} onChange={e => setFormData({...formData, precioBase: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Tiempo (min)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                      value={formData.tiempoEstimado} onChange={e => setFormData({...formData, tiempoEstimado: e.target.value})} />
                  </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Categoría</label>
                    <select className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-vino-800"
                        value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                        {categorias.filter(c => c !== "Todas").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Disponible</span>
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, disponible: !formData.disponible})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.disponible ? "bg-vino-800" : "bg-gray-300"}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.disponible ? "left-7" : "left-1"}`} />
                    </button>
                </div>

                <button type="submit" className="w-full bg-vino-900 hover:bg-vino-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-[0.98] text-lg">
                  {itemEditando ? "Guardar Cambios" : "Agregar al Menú"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;