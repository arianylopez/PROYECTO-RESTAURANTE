package com.restaurante.restaurantebackend.patrones.state;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class Servido implements EstadoPedido {

    @Override
    public void siguienteEstado(Pedido pedido) {
        // Aquí podría pasar a "Pagado", pero para el MVP termina aquí o se maneja en Facturación.
        throw new RuntimeException("El pedido ya fue servido, fin del ciclo de cocina");
    }

    @Override
    public void cancelar(Pedido pedido) {
        throw new RuntimeException("Ya se lo comieron, imposible cancelar");
    }

    @Override
    public String getNombre() {
        return "Servido";
    }
}