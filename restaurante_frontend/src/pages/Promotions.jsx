import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Promotions = () => {
  const [config, setConfig] = useState({
    happyHour: false,
    impuestoTurista: false
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/config/estrategias");
        const data = await res.json();
        setConfig(data);
      } catch (error) {
        console.error("Error cargando config", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const toggleEstrategia = async (key) => {
    const nuevaConfig = { ...config, [key]: !config[key] };
    
    setConfig(nuevaConfig);

    try {
      await fetch("http://localhost:8080/api/config/estrategias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaConfig)
      });
    } catch (error) {
      console.error("Error conectando con Java", error);
      setConfig(config); 
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Promociones</h1>
            <p className="text-gray-500 mt-1">Gestiona descuentos y ofertas (Pattern: Strategy)</p>
          </div>
        </header>

        {loading ? <p>Sincronizando con Backend...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {}
            <PromoCard 
              title="Happy Hour"
              isActive={config.happyHour}
              description="20% de descuento en el total de la cuenta."
              onToggle={() => toggleEstrategia("happyHour")}
              icon="🏷️"
            />

            {}
            <PromoCard 
              title="Impuesto Turista"
              isActive={config.impuestoTurista}
              description="Aplica un recargo del 18% en lugar del 13% estándar."
              onToggle={() => toggleEstrategia("impuestoTurista")}
              icon="✈️"
            />

          </div>
        )}
      </div>
    </div>
  );
};

const PromoCard = ({ title, isActive, description, onToggle, icon }) => (
  <div className={`p-8 rounded-2xl shadow-sm border transition-all hover:shadow-md ${isActive ? 'bg-white border-vino-200 ring-1 ring-vino-100' : 'bg-white border-gray-100'}`}>
    <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isActive ? 'bg-vino-50 text-vino-900' : 'bg-gray-100 text-gray-400'}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 font-serif">{title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {isActive ? 'Activa' : 'Inactiva'}
                </span>
            </div>
        </div>
        
        {}
        <button 
            onClick={onToggle}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${isActive ? 'bg-vino-900' : 'bg-gray-200'}`}
        >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default Promotions;