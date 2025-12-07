package com.restaurante.restaurantebackend.patrones.observer;

import com.restaurante.restaurantebackend.modelo.Pedido;
import com.restaurante.restaurantebackend.patrones.singleton.BaseDeDatos;

public class CocinaObserver implements PedidoObserver {

    @Override
    public void actualizar(Pedido pedido) {
        if ("Listo para Servir".equals(pedido.getEstadoNombre())) {
            System.out.println("🔔 COCINA OBSERVER: El pedido #" + pedido.getId() + " está listo. Notificando a meseros...");

            BaseDeDatos.getInstancia().getPedidosListosParaServir().add(pedido);
        }
    }
}