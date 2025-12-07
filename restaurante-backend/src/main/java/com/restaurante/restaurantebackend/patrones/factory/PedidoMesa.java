package com.restaurante.restaurantebackend.patrones.factory;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class PedidoMesa extends Pedido {
    private int idMesa;
    private double propina;

    public PedidoMesa(int id, String nombreCliente, int idMesa) {
        super(id, nombreCliente);
        this.idMesa = idMesa;
        this.propina = 0;
    }

    public void setPropina(double propina) {
        this.propina = propina;
    }

    @Override
    public double calcularTotal() {
        return super.calcularTotal() + propina;
    }

    public int getIdMesa() { return idMesa; }
}