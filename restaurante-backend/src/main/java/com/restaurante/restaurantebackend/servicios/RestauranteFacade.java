package com.restaurante.restaurantebackend.servicios;

import com.restaurante.restaurantebackend.modelo.Mesa;
import com.restaurante.restaurantebackend.modelo.Pedido;
import com.restaurante.restaurantebackend.modelo.Reserva;
import com.restaurante.restaurantebackend.patrones.composite.ItemMenu;
import com.restaurante.restaurantebackend.patrones.factory.PedidoFactory;
import com.restaurante.restaurantebackend.patrones.observer.CocinaObserver;
import com.restaurante.restaurantebackend.patrones.singleton.BaseDeDatos;
import com.restaurante.restaurantebackend.patrones.strategy.*;
import com.restaurante.restaurantebackend.patrones.composite.Producto;
import com.restaurante.restaurantebackend.modelo.Configuracion;
import java.util.Optional;

import java.util.List;
import java.util.stream.Collectors;

public class RestauranteFacade {

    private BaseDeDatos db;

    public RestauranteFacade() {
        this.db = BaseDeDatos.getInstancia();
    }

    // ---------------------------------------------------------
    // 1. GESTIÓN DE PEDIDOS (Usa FACTORY + OBSERVER + SINGLETON)
    // ---------------------------------------------------------

    public Pedido crearPedido(String tipo, int id, String cliente, String datoExtra) {
        PedidoFactory.TipoPedido tipoEnum = PedidoFactory.TipoPedido.valueOf(tipo);
        Pedido nuevoPedido = PedidoFactory.crearPedido(tipoEnum, id, cliente, datoExtra);

        nuevoPedido.agregarObservador(new CocinaObserver());

        db.agregarPedido(nuevoPedido);

        if (tipoEnum == PedidoFactory.TipoPedido.EN_MESA) {
            int idMesa = Integer.parseInt(datoExtra);
            ocuparMesa(idMesa);
        }

        System.out.println("FACADE: Pedido #" + id + " creado exitosamente.");
        return nuevoPedido;
    }

    public void agregarProductoAPedido(int idPedido, ItemMenu producto) {
        Pedido p = buscarPedido(idPedido);
        if (p != null) {
            p.agregarItem(producto);
            System.out.println("FACADE: Producto agregado al pedido #" + idPedido);
        }
    }

    // ---------------------------------------------------------
    // 2. GESTIÓN DE ESTADOS
    // ---------------------------------------------------------

    public void avanzarEstadoPedido(int idPedido) {
        Pedido p = buscarPedido(idPedido);
        if (p != null) {
            p.avanzarEstado();
        }
    }

    public void cancelarPedido(int idPedido) {
        Pedido p = buscarPedido(idPedido);
        if (p != null) {
            p.cancelarPedido();
        }
    }

    // ---------------------------------------------------------
    // 3. FACTURACIÓN Y PAGOS
    // ---------------------------------------------------------

    public double calcularTotalPedido(int idPedido) {
        Pedido p = buscarPedido(idPedido);
        if (p == null) return 0.0;
        return db.getContextoFacturacion().calcularTotalFinal(p);
    }


    public void configurarEstrategias(boolean happyHour, boolean impuestoTurista) {
        ContextoFacturacion contexto = db.getContextoFacturacion();

        if (happyHour) {
            contexto.setEstrategiaCobro(new PagoPromocion(0.20)); // 20% Descuento
        } else {
            contexto.setEstrategiaCobro(new PagoNormal());
        }

        if (impuestoTurista) {
            contexto.setEstrategiaImpuesto(new ImpuestoTurista());
        } else {
            contexto.setEstrategiaImpuesto(new ImpuestoNormal());
        }

        System.out.println("FACADE: Estrategias de facturación actualizadas.");
    }

    // ---------------------------------------------------------
    // 4. CONSULTAS DE DATOS (Para los Dashboards)
    // ---------------------------------------------------------

    public List<Mesa> obtenerMesas() {
        return db.getMesas();
    }

    public List<ItemMenu> obtenerMenu() {
        return db.getMenu();
    }

    public List<Pedido> obtenerTodosLosPedidos() {
        return db.getPedidosIngresados();
    }

    public List<Pedido> obtenerPedidosEnCocina() {
        return db.getPedidosIngresados().stream()
                .filter(p -> !p.getEstadoNombre().equals("Servido") && !p.getEstadoNombre().equals("Cancelado"))
                .collect(Collectors.toList());
    }

    public List<Pedido> obtenerPedidosListosParaServir() {
        return db.getPedidosListosParaServir();
    }

    private Pedido buscarPedido(int id) {
        return db.getPedidosIngresados().stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);
    }

    private void ocuparMesa(int idMesa) {
        db.getMesas().stream()
                .filter(m -> m.getId() == idMesa)
                .findFirst()
                .ifPresent(m -> m.setEstado("Ocupada"));
    }

    public void agregarProductoPorNombre(int idPedido, String nombreProducto) {
        Pedido p = buscarPedido(idPedido);

        ItemMenu productoEncontrado = db.getMenu().stream()
                .filter(item -> item.getNombre().equalsIgnoreCase(nombreProducto))
                .findFirst()
                .orElse(null);

        if (p != null && productoEncontrado != null) {
            p.agregarItem(productoEncontrado);
            System.out.println("FACADE: Agregada " + nombreProducto + " al pedido #" + idPedido);
        }
    }

    public void cambiarEstadoMesa(int idMesa, String nuevoEstado) {
        db.getMesas().stream()
                .filter(m -> m.getId() == idMesa)
                .findFirst()
                .ifPresent(m -> {
                    m.setEstado(nuevoEstado);
                    System.out.println("FACADE: Mesa " + idMesa + " cambiada a " + nuevoEstado);
                });
    }

    public void crearReserva(Reserva reserva) {
        boolean ocupada = db.getReservas().stream()
                .anyMatch(r -> r.getIdMesa() == reserva.getIdMesa()
                        && r.getFecha().equals(reserva.getFecha())
                        && r.getHora().equals(reserva.getHora()));

        if (ocupada) {
            throw new RuntimeException("CONFLICTO: La Mesa " + reserva.getIdMesa() +
                    " ya tiene una reserva a las " + reserva.getHora());
        }

        db.agregarReserva(reserva);
        System.out.println("FACADE: Reserva creada para " + reserva.getNombreCliente());
    }

    public void eliminarReserva(int id) {
        db.getReservas().removeIf(r -> r.getId() == id);
        System.out.println("FACADE: Reserva eliminada ID: " + id);
    }

    public List<Reserva> obtenerReservas() {
        return db.getReservas();
    }

    public void crearProducto(Producto p) {
        if (p.getId() == 0) {
            int nuevoId = (int) (System.currentTimeMillis() % 100000);
        }

        db.getMenu().add(p);
        System.out.println("FACADE: Nuevo producto agregado: " + p.getNombre());
    }

    public void editarProducto(int id, Producto p) {
        Optional<ItemMenu> itemEncontrado = db.getMenu().stream()
                .filter(item -> item.getId() == id)
                .findFirst();

        if (itemEncontrado.isPresent()) {
            ItemMenu item = itemEncontrado.get();
            item.setNombre(p.getNombre());
            item.setDescripcion(p.getDescripcion());
            item.setPrecioBase(p.getPrecio());
            item.setCategoria(p.getCategoria());
            item.setTiempoEstimado(p.getTiempoEstimado());
            item.setDisponible(p.isDisponible());

            System.out.println("FACADE: Producto actualizado ID: " + id);
        } else {
            throw new RuntimeException("Producto no encontrado");
        }
    }

    public void pagarPedido(int idPedido, String nit, String razonSocial) {
        Pedido p = buscarPedido(idPedido);
        if (p != null) {
            p.setNitFactura(nit);
            p.setRazonSocialFactura(razonSocial);
            p.setFechaFactura(java.time.LocalDate.now().toString());

            db.getPedidosIngresados().remove(p);
            db.getHistorialVentas().add(p);

            System.out.println("FACADE: Factura generada para: " + razonSocial);
        }
    }

    public List<Pedido> obtenerHistorial() {
        return db.getHistorialVentas();
    }

    public Configuracion obtenerDatosFactura() {
        return db.getConfigSistema();
    }

    public void guardarDatosFactura(Configuracion config) {
        db.setConfigSistema(config);
        System.out.println("FACADE: Datos de factura actualizados: " + config.getNombreRestaurante());
    }
}
