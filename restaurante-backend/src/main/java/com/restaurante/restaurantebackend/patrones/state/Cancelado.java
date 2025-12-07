package com.restaurante.restaurantebackend.patrones.state;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class Cancelado implements EstadoPedido {

    @Override
    public void siguienteEstado(Pedido pedido) {
        throw new RuntimeException("El pedido está cancelado");
    }

    @Override
    public void cancelar(Pedido pedido) {
    }

    @Override
    public String getNombre() {
        return "Cancelado";
    }
}