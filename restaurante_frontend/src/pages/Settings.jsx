import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Settings = () => {
  const [formData, setFormData] = useState({
    nombreRestaurante: "",
    nit: "",
    direccion: "",
    telefono: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/config/factura")
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    try {
      await fetch("http://localhost:8080/api/config/factura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      alert("✅ Configuración guardada correctamente");
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        
        {}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Configuración</h1>
            <p className="text-gray-500 mt-1">Ajustes del sistema</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input type="text" placeholder="Buscar..." className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm w-64 shadow-sm outline-none focus:ring-2 focus:ring-vino-800" />
             </div>
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer">
                <span className="text-sm font-bold text-gray-700">Administrador</span>
                <span className="text-xs">▼</span>
             </div>
          </div>
        </header>

        {loading ? <p>Cargando configuración...</p> : (
          <div className="max-w-4xl">
            
            {}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl text-vino-900">📄</span>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 font-serif">Datos de Factura</h2>
                        <p className="text-sm text-gray-500">Información que aparece en las facturas</p>
                    </div>
                </div>

                <div className="space-y-6">
                    
                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Restaurante</label>
                        <input 
                            type="text" 
                            name="nombreRestaurante"
                            value={formData.nombreRestaurante}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-vino-800 focus:bg-white transition-all"
                        />
                    </div>

                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIT</label>
                        <input 
                            type="text" 
                            name="nit"
                            value={formData.nit}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-vino-800 focus:bg-white transition-all"
                        />
                    </div>

                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                        <input 
                            type="text" 
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-vino-800 focus:bg-white transition-all"
                        />
                    </div>

                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                        <input 
                            type="text" 
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-vino-800 focus:bg-white transition-all"
                        />
                    </div>

                    {}
                    <div className="pt-4">
                        <button 
                            onClick={handleSave}
                            className="bg-[#F5F5F5] hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-300"
                        >
                            Guardar Datos de Factura
                        </button>
                    </div>

                </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;