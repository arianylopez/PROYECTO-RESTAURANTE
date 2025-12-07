package com.restaurante.restaurantebackend.patrones.factory;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class PedidoFactory {

    public enum TipoPedido {
        EN_MESA, DELIVERY
    }

    public static Pedido crearPedido(TipoPedido tipo, int id, String nombreCliente, String datoAdicional) {
        switch (tipo) {
            case EN_MESA:
                int idMesa = Integer.parseInt(datoAdicional);
                return new PedidoMesa(id, nombreCliente, idMesa);

            case DELIVERY:
                return new PedidoDelivery(id, nombreCliente, datoAdicional);

            default:
                throw new IllegalArgumentException("Tipo de pedido no válido");
        }
    }
}
