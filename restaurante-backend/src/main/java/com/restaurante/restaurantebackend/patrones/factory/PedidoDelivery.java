package com.restaurante.restaurantebackend.patrones.factory;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class PedidoDelivery extends Pedido {
    private String direccion;
    private double costoEnvio;

    public PedidoDelivery(int id, String nombreCliente, String direccion) {
        super(id, nombreCliente);
        this.direccion = direccion;
        this.costoEnvio = 15.00;
    }

    @Override
    public double calcularTotal() {
        return super.calcularTotal() + costoEnvio;
    }

    public String getDireccion() { return direccion; }
}