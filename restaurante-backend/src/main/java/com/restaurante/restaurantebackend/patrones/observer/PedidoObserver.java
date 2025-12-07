package com.restaurante.restaurantebackend.patrones.observer;

import com.restaurante.restaurantebackend.modelo.Pedido;

public interface PedidoObserver {
    void actualizar(Pedido pedido);
}