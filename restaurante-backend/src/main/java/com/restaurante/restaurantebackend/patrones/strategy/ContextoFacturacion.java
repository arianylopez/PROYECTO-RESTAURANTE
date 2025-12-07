package com.restaurante.restaurantebackend.patrones.strategy;

import com.restaurante.restaurantebackend.modelo.Pedido;

public class ContextoFacturacion {
    private EstrategiaImpuesto estrategiaImpuesto;
    private EstrategiaCobro estrategiaCobro;

    public ContextoFacturacion() {
        this.estrategiaImpuesto = new ImpuestoNormal();
        this.estrategiaCobro = new PagoNormal();
    }

    public void setEstrategiaImpuesto(EstrategiaImpuesto estrategiaImpuesto) {
        this.estrategiaImpuesto = estrategiaImpuesto;
    }

    public void setEstrategiaCobro(EstrategiaCobro estrategiaCobro) {
        this.estrategiaCobro = estrategiaCobro;
    }

    public double calcularTotalFinal(Pedido pedido) {
        double subtotal = pedido.calcularTotal();
        double impuesto = estrategiaImpuesto.calcularImpuesto(subtotal);
        return estrategiaCobro.generarTotalAPagar(subtotal + impuesto);
    }

    public EstrategiaImpuesto getEstrategiaImpuesto() { return estrategiaImpuesto; }
    public EstrategiaCobro getEstrategiaCobro() { return estrategiaCobro; }
}