package com.restaurante.restaurantebackend.patrones.singleton;

import com.restaurante.restaurantebackend.modelo.Mesa;
import com.restaurante.restaurantebackend.patrones.composite.Combo;
import com.restaurante.restaurantebackend.patrones.composite.ItemMenu;
import com.restaurante.restaurantebackend.patrones.composite.Producto;
import com.restaurante.restaurantebackend.modelo.Pedido;
import com.restaurante.restaurantebackend.patrones.strategy.ContextoFacturacion;
import com.restaurante.restaurantebackend.modelo.Reserva;
import com.restaurante.restaurantebackend.patrones.strategy.PagoPromocion;
import com.restaurante.restaurantebackend.patrones.strategy.ImpuestoTurista;
import com.restaurante.restaurantebackend.modelo.Configuracion;

import java.util.ArrayList;
import java.util.List;

public class BaseDeDatos {
    private static BaseDeDatos instancia;
    private List<Mesa> mesas;
    private List<ItemMenu> menu;
    private List<Pedido> pedidosIngresados; // Lista general de todos los pedidos
    private List<Pedido> pedidosListosParaServir;
    private ContextoFacturacion contextoFacturacion;
    private List<Reserva> reservas;
    private List<Pedido> historialVentas;
    private Configuracion configSistema;

    private BaseDeDatos() {
        mesas = new ArrayList<>();
        menu = new ArrayList<>();
        pedidosIngresados = new ArrayList<>();
        pedidosListosParaServir = new ArrayList<>();
        this.contextoFacturacion = new ContextoFacturacion();
        reservas = new ArrayList<>();
        historialVentas = new ArrayList<>();
        this.configSistema = new Configuracion(
                "La Mesa - Restaurante Boliviano",
                "123456789",
                "Av. Principal #123, La Paz, Bolivia",
                "+591 2 1234567"
        );
        cargarDatosIniciales();
    }

    public static synchronized BaseDeDatos getInstancia() {
        if (instancia == null) {
            instancia = new BaseDeDatos();
        }
        return instancia;
    }

    private void cargarDatosIniciales() {
        for (int i = 1; i <= 10; i++) mesas.add(new Mesa(i, 4));

        Producto saltena = new Producto(1, "Salteña", "Empanada jugosa de carne", 12.00, "Entradas", 15);
        Producto pique = new Producto(2, "Pique Macho", "Carne con papas y salchicha", 65.00, "Principales", 25);
        Producto coca = new Producto(3, "Coca Cola", "Refresco 500ml", 10.00, "Bebidas", 0);

        menu.add(saltena);
        menu.add(pique);
        menu.add(coca);

        Combo desayuno = new Combo(4, "Combo Mañanero", "2 Salteñas + Coca", 0.10);
        desayuno.agregarItem(saltena);
        desayuno.agregarItem(saltena);
        desayuno.agregarItem(coca);

        menu.add(desayuno);
    }

    public List<Mesa> getMesas() {
        return mesas;
    }

    public List<ItemMenu> getMenu() {
        return menu;
    }

    public void agregarPedido(Pedido p) {
        pedidosIngresados.add(p);
    }

    public List<Pedido> getPedidosIngresados() {
        return pedidosIngresados;
    }

    public List<Pedido> getPedidosListosParaServir() {
        return pedidosListosParaServir;
    }

    public ContextoFacturacion getContextoFacturacion() {
        return contextoFacturacion;
    }

    public List<Reserva> getReservas() { return reservas; }

    public void agregarReserva(Reserva r) { reservas.add(r); }

    public boolean isHappyHourActivo() {
        return contextoFacturacion.getEstrategiaCobro() instanceof PagoPromocion;
    }

    public boolean isImpuestoTuristaActivo() {
        return contextoFacturacion.getEstrategiaImpuesto() instanceof ImpuestoTurista;
    }

    public List<Pedido> getHistorialVentas() { return historialVentas; }

    public Configuracion getConfigSistema() { return configSistema; }
    public void setConfigSistema(Configuracion configSistema) { this.configSistema = configSistema; }
}