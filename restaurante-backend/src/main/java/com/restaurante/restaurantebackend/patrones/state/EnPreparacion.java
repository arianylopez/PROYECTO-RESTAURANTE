package com.restaurante.restaurantebackend.patrones.state;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class EnPreparacion implements EstadoPedido {

    @Override
    public void siguienteEstado(Pedido pedido) {
        pedido.setEstado(new Listo());
    }

    @Override
    public void cancelar(Pedido pedido) {
        throw new RuntimeException("No se puede cancelar un pedido que ya se está cocinando");
    }

    @Override
    public String getNombre() {
        return "En Preparación";
    }
}