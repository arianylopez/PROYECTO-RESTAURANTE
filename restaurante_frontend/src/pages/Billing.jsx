import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Billing = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [facturasCerradas, setFacturasCerradas] = useState([]);
  
  const [infoRestaurante, setInfoRestaurante] = useState({});

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState("");
  const [datosPedido, setDatosPedido] = useState(null);
  const [totalCalculado, setTotalCalculado] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mostrarModalCobro, setMostrarModalCobro] = useState(false);
  const [mostrarFactura, setMostrarFactura] = useState(null); // Guarda el objeto factura a ver

  const [datosFacturacion, setDatosFacturacion] = useState({ nit: "", razonSocial: "" });

  const cargarDatos = async () => {
    try {
      const res1 = await fetch("http://localhost:8080/api/pedidos");
      const data1 = await res1.json();
      setPedidosPendientes(data1.filter(p => p.estadoNombre !== "Cancelado" && p.items && p.items.length > 0));

      const res2 = await fetch("http://localhost:8080/api/pedidos/historial");
      if (res2.ok) setFacturasCerradas((await res2.json()).reverse());

      const res3 = await fetch("http://localhost:8080/api/config/factura");
      if (res3.ok) setInfoRestaurante(await res3.json());

    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSeleccion = async (e) => {
    const id = e.target.value;
    setPedidoSeleccionado(id);
    setTotalCalculado(null);

    if (id) {
        setLoading(true);
        const pedido = pedidosPendientes.find(p => p.id.toString() === id);
        setDatosPedido(pedido);
        setDatosFacturacion({ nit: "", razonSocial: pedido.nombreCliente });

        try {
            const res = await fetch(`http://localhost:8080/api/pedidos/${id}/total`);
            setTotalCalculado(await res.json());
        } catch (error) { console.error(error); } finally { setLoading(false); }
    } else {
        setDatosPedido(null);
    }
  };

  const procesarPago = async (e) => {
    e.preventDefault();
    if (!datosFacturacion.nit || !datosFacturacion.razonSocial) return alert("Llena los datos");

    try {
        await fetch(`http://localhost:8080/api/pedidos/${pedidoSeleccionado}/pagar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosFacturacion)
        });
        
        alert("✅ Factura generada correctamente");
        setMostrarModalCobro(false);
        setPedidoSeleccionado("");
        setDatosPedido(null);
        setTotalCalculado(null);
        cargarDatos();
    } catch (error) { alert("Error al pagar"); }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <header className="mb-8"><h1 className="text-3xl font-bold text-gray-800 font-serif">Facturación</h1></header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <h2 className="text-xl font-bold text-gray-800 font-serif mb-6">1. Seleccionar Pedido</h2>
                <div className="mb-6">
                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl outline-none"
                        value={pedidoSeleccionado} onChange={handleSeleccion}>
                        <option value="">-- Seleccionar --</option>
                        {pedidosPendientes.map(p => <option key={p.id} value={p.id}>Pedido #{p.id} - {p.nombreCliente}</option>)}
                    </select>
                </div>
                {datosPedido && (
                    <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <ul className="space-y-2">
                            {datosPedido.items.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex justify-between"><span>{item.nombre}</span><span>Bs {item.precio || item.precioBase}</span></li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center min-h-[300px]">
                <h2 className="text-xl font-bold text-gray-800 font-serif mb-6">2. Total a Pagar</h2>
                {loading ? <div className="text-center text-gray-400">Calculando...</div> : totalCalculado !== null ? (
                    <div className="text-center animate-scale-in">
                        <span className="text-6xl font-serif font-bold text-vino-900">Bs {totalCalculado.toFixed(2)}</span>
                        <p className="text-sm text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">✓ Strategy Pattern Applied</p>
                        <button onClick={() => setMostrarModalCobro(true)} className="w-full mt-8 bg-vino-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-vino-800 transition-all active:scale-[0.98]">
                            Cobrar y Emitir Factura
                        </button>
                    </div>
                ) : <div className="text-center text-gray-300 py-10">Selecciona un pedido</div>}
            </div>
        </div>

        {/* LISTA DE FACTURAS */}
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 font-serif mb-6">Facturas Emitidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facturasCerradas.map((f) => (
                    <div key={f.id} className="border border-gray-200 p-4 rounded-xl flex justify-between items-center bg-white hover:shadow-md transition-shadow">
                        <div>
                            <p className="font-bold text-gray-800">Factura #{f.id}</p>
                            <p className="text-xs text-gray-500">{f.razonSocialFactura}</p>
                            <p className="text-[10px] text-gray-400">NIT: {f.nitFactura}</p>
                        </div>
                        <button onClick={() => setMostrarFactura(f)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                            Ver Factura
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {}
        {mostrarModalCobro && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Datos para la Factura</h3>
                    <form onSubmit={procesarPago} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Razón Social / Nombre</label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                                value={datosFacturacion.razonSocial} onChange={e => setDatosFacturacion({...datosFacturacion, razonSocial: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NIT / CI</label>
                            <input type="number" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-vino-800"
                                value={datosFacturacion.nit} onChange={e => setDatosFacturacion({...datosFacturacion, nit: e.target.value})} required />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setMostrarModalCobro(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button type="submit" className="flex-1 bg-vino-900 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-vino-800">Generar Factura</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {}
        {mostrarFactura && (
            <ModalFactura factura={mostrarFactura} infoRestaurante={infoRestaurante} onClose={() => setMostrarFactura(null)} />
        )}

      </div>
    </div>
  );
};

const ModalFactura = ({ factura, infoRestaurante, onClose }) => {
    const subtotal = factura.items.reduce((s, i) => s + (i.precio || i.precioBase), 0);
    const baseImponible = subtotal / 1.13;
    const iva = subtotal - baseImponible;

    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl shadow-2xl relative animate-scale-in overflow-hidden">
                
                {/* Header Azul (Estilo Declarando) */}
                <div className="bg-white p-8 pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-600 mb-1">Factura</h1>
                            <div className="text-sm text-gray-500 space-y-1 mt-4">
                                <p><span className="font-bold text-gray-700">Fecha:</span> {factura.fechaFactura || new Date().toLocaleDateString()}</p>
                                <p><span className="font-bold text-gray-700">Número:</span> 2025-{String(factura.id).padStart(4, '0')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">LA MESA</h2>
                            <p className="text-xs text-gray-400">RESTAURANTE</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 grid grid-cols-2 gap-12">
                    {/* Cliente */}
                    <div>
                        <h3 className="text-blue-500 font-bold mb-3 border-b pb-1">{factura.razonSocialFactura}</h3>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><span className="font-bold">NIT/CI:</span> {factura.nitFactura}</p>
                            <p>La Paz, Bolivia</p>
                        </div>
                    </div>
                    {/* Restaurante */}
                    <div>
                        <h3 className="text-blue-500 font-bold mb-3 border-b pb-1">Datos del Emisor</h3>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p>{infoRestaurante.nombreRestaurante}</p>
                            <p>{infoRestaurante.direccion}</p>
                            <p>NIT: {infoRestaurante.nit}</p>
                            <p>Tel: {infoRestaurante.telefono}</p>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="px-8 py-4">
                    <table className="w-full text-sm">
                        <thead className="text-blue-500 border-b-2 border-blue-100">
                            <tr>
                                <th className="text-left py-2">Descripción</th>
                                <th className="text-right py-2">Cant.</th>
                                <th className="text-right py-2">Precio Unit.</th>
                                <th className="text-right py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {factura.items.map((item, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    <td className="py-3">{item.nombre}</td>
                                    <td className="text-right py-3">1</td>
                                    <td className="text-right py-3">Bs {(item.precio||item.precioBase).toFixed(2)}</td>
                                    <td className="text-right py-3 font-medium">Bs {(item.precio||item.precioBase).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totales */}
                <div className="px-8 pb-8 pt-4 flex flex-col items-end">
                    <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>BASE IMPONIBLE:</span>
                            <span>{baseImponible.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>IVA (13%):</span>
                            <span>{iva.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2 mt-2">
                            <span>TOTAL:</span>
                            <span>Bs {subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <button onClick={onClose} className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-900">
                        Cerrar Vista Previa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Billing;