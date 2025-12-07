import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useRestaurant } from "../context/RestaurantContext";

const Reservations = () => {
  const { mesas } = useRestaurant();
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const [dropdownAbierto, setDropdownAbierto] = useState(null);

  const [formData, setFormData] = useState({
    idMesa: "",
    personas: 2,
    nombreCliente: "",
    telefono: "",
    hora: "19:00",
    notas: ""
  });

  const cargarReservas = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reservas");
      const data = await res.json();
      setReservas(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarReservas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idMesa) {
      alert("⚠️ Selecciona una mesa");
      return;
    }

    const payload = {
      id: 0, 
      idMesa: Number(formData.idMesa), 
      fecha: fechaSeleccionada,
      hora: formData.hora,
      nombreCliente: formData.nombreCliente,
      personas: Number(formData.personas), 
      telefono: formData.telefono || "",   
      notas: formData.notas || ""          
    };

    try {
      const res = await fetch("http://localhost:8080/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModalAbierto(false);
        cargarReservas();
        setFormData({ idMesa: "", personas: 2, nombreCliente: "", telefono: "", hora: "19:00", notas: "" });
        alert("✅ Reserva creada");
      } else {
        const txt = await res.text();
        alert("Error Backend: " + txt);
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const eliminarReserva = async (id) => {
    if(!confirm("¿Borrar reserva?")) return;
    await fetch(`http://localhost:8080/api/reservas/${id}`, { method: "DELETE" });
    cargarReservas();
  };

  const reservasDelDia = reservas.filter(r => r.fecha === fechaSeleccionada);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        
        {}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Reservas</h1>
            <p className="text-gray-500 mt-1">Gestiona las reservas del restaurante</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input type="text" placeholder="Buscar..." className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vino-800 w-64 shadow-sm" />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          
          {}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-fit">
            <h3 className="font-bold text-gray-800 text-xl font-serif mb-6">Calendario</h3>
            
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between mb-4 font-bold text-gray-700 px-2">
                    <span>{"<"}</span> <span>Diciembre 2025</span> <span>{">"}</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 mb-2 font-bold uppercase">
                    <span>lu</span><span>ma</span><span>mi</span><span>ju</span><span>vi</span><span>sá</span><span>do</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-700 cursor-pointer">
                    {[...Array(31)].map((_, i) => {
                        const dia = i + 1;
                        const fechaLoop = `2025-12-${String(dia).padStart(2, '0')}`;
                        const esHoy = fechaLoop === fechaSeleccionada;
                        
                        return (
                            <div key={dia} onClick={() => setFechaSeleccionada(fechaLoop)}
                                className={`h-8 w-8 flex items-center justify-center rounded-lg hover:bg-vino-100 transition-all ${
                                    esHoy ? 'bg-vino-800 text-white shadow-md font-bold ring-2 ring-offset-1 ring-vino-800' : ''
                                }`}
                            >
                                {dia}
                            </div>
                        )
                    })}
                </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                    <h3 className="font-bold text-gray-800 text-xl font-serif">
                        Reservas - {fechaSeleccionada}
                    </h3>
                    <p className="text-sm text-gray-400">{reservasDelDia.length} reserva(s)</p>
                </div>
                <button 
                    onClick={() => setModalAbierto(true)}
                    className="bg-vino-900 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-vino-800 transition-transform active:scale-95 flex items-center gap-2"
                >
                    <span>+</span> Nueva Reserva
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {reservasDelDia.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-xl">
                        <span className="text-4xl mb-2">📅</span>
                        <p>No hay reservas para este día</p>
                    </div>
                ) : (
                    reservasDelDia.map(r => (
                        <div key={r.id} className="relative border border-gray-100 rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-shadow bg-white group">
                            
                            {}
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-vino-800 text-xl shadow-sm">
                                    👤
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-800 text-lg">{r.nombreCliente}</h4>
                                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Confirmada</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">🕒 {r.hora}</span>
                                        <span className="flex items-center gap-1">🪑 Mesa {r.idMesa}</span>
                                        <span className="flex items-center gap-1">👥 {r.personas}</span>
                                        <span className="flex items-center gap-1">📞 {r.telefono || "---"}</span>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex items-center gap-2">
                                {}
                                <div className="relative">
                                    <button 
                                        onClick={() => setDropdownAbierto(dropdownAbierto === r.id ? null : r.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                    >
                                        Confirmada <span className="text-xs">▼</span>
                                    </button>
                                    
                                    {}
                                    {dropdownAbierto === r.id && (
                                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1 animate-fade-in">
                                            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">Estado</div>
                                            {['Pendiente', 'Confirmada', 'Sentados', 'Completada', 'Cancelada'].map(estado => (
                                                <button key={estado} className={`block w-full text-left px-4 py-2 text-sm hover:bg-vino-50 hover:text-vino-800 ${estado === 'Confirmada' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-600'}`}>
                                                    {estado === 'Confirmada' && '✓ '} {estado}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {}
                                <button 
                                    onClick={() => eliminarReserva(r.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar Reserva"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>

        {}
        {modalAbierto && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-scale-in">
                    <button onClick={() => setModalAbierto(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 text-xl font-bold">✕</button>
                    
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Nueva Reserva</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Mesa *</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-vino-800 outline-none"
                                    value={formData.idMesa}
                                    onChange={e => setFormData({...formData, idMesa: e.target.value})}
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    {mesas.map(m => <option key={m.id} value={m.id}>Mesa {m.id} ({m.capacidad}p)</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Personas</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                                    value={formData.personas} onChange={e => setFormData({...formData, personas: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nombre del Cliente *</label>
                            <input type="text" placeholder="Ej: Juan Pérez" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                                value={formData.nombreCliente} onChange={e => setFormData({...formData, nombreCliente: e.target.value})} required />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Teléfono</label>
                            <input type="text" placeholder="+591 ..." className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                                value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Hora Inicio *</label>
                                <select className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-vino-800"
                                    value={formData.hora} onChange={e => setFormData({...formData, hora: e.target.value})}>
                                    <option>12:00</option><option>13:00</option><option>14:00</option>
                                    <option>19:00</option><option>20:00</option><option>21:00</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Hora Fin *</label>
                                <select className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none bg-gray-50 text-gray-400" disabled>
                                    <option>Automático</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Notas</label>
                            <textarea placeholder="Ocasión especial, alergias..." className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800 h-20 resize-none"
                                value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})}></textarea>
                        </div>

                        <button type="submit" className="w-full bg-vino-900 hover:bg-vino-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-[0.98] text-lg">
                            Crear Reserva
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;