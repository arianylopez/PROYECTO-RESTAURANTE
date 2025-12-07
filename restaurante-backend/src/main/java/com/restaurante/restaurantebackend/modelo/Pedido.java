package com.restaurante.restaurantebackend.modelo;

import com.restaurante.restaurantebackend.patrones.composite.ItemMenu;
import com.restaurante.restaurantebackend.patrones.state.EnCola;
import com.restaurante.restaurantebackend.patrones.observer.PedidoObserver;
import com.restaurante.restaurantebackend.patrones.state.EstadoPedido;
import java.util.ArrayList;
import java.util.List;

public abstract class Pedido {
    protected int id;
    protected String nombreCliente;
    protected List<ItemMenu> items;
    protected EstadoPedido estado;
    private String nitFactura;
    private String razonSocialFactura;
    private String fechaFactura;

    private List<PedidoObserver> observadores = new ArrayList<>();

    public Pedido(int id, String nombreCliente) {
        this.id = id;
        this.nombreCliente = nombreCliente;
        this.items = new ArrayList<>();
        this.estado = new EnCola();
    }

    public void agregarObservador(PedidoObserver observer) {
        observadores.add(observer);
    }

    public void eliminarObservador(PedidoObserver observer) {
        observadores.remove(observer);
    }

    private void notificarObservadores() {
        for (PedidoObserver observer : observadores) {
            observer.actualizar(this);
        }
    }

    public void agregarItem(ItemMenu item) {
        items.add(item);
    }

    public void avanzarEstado() {
        estado.siguienteEstado(this);
    }

    public void cancelarPedido() {
        estado.cancelar(this);
    }

    public double calcularTotal() {
        double total = 0;
        for (ItemMenu item : items) {
            total += item.getPrecio();
        }
        return total;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public String getEstadoNombre() {
        return estado.getNombre();
    }

    public int getId() { return id; }
    public String getNombreCliente() { return nombreCliente; }
    public List<ItemMenu> getItems() { return items; }
    public String getNitFactura() { return nitFactura; }
    public void setNitFactura(String nitFactura) { this.nitFactura = nitFactura; }

    public String getRazonSocialFactura() { return razonSocialFactura; }
    public void setRazonSocialFactura(String razonSocialFactura) { this.razonSocialFactura = razonSocialFactura; }

    public String getFechaFactura() { return fechaFactura; }
    public void setFechaFactura(String fechaFactura) { this.fechaFactura = fechaFactura; }
}