package com.restaurante.restaurantebackend.patrones.state;

import com.restaurante.restaurantebackend.modelo.Pedido;

public interface EstadoPedido {
    void siguienteEstado(Pedido pedido);
    void cancelar(Pedido pedido);
    String getNombre();
}