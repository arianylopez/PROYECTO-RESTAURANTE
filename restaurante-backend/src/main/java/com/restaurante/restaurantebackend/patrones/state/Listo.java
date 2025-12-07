package com.restaurante.restaurantebackend.patrones.state;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class Listo implements EstadoPedido {

    @Override
    public void siguienteEstado(Pedido pedido) {
        pedido.setEstado(new Servido());
    }

    @Override
    public void cancelar(Pedido pedido) {
        throw new RuntimeException("No se puede cancelar, ya se desperdiciaron insumos");
    }

    @Override
    public String getNombre() {
        return "Listo para Servir";
    }
}