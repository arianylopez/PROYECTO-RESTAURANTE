package com.restaurante.restaurantebackend.patrones.strategy;

public class PagoPromocion implements EstrategiaCobro {
    private double porcentajeDescuento;

    public PagoPromocion(double porcentajeDescuento) {
        this.porcentajeDescuento = porcentajeDescuento;
    }

    @Override
    public double generarTotalAPagar(double totalConImpuestos) {
        return totalConImpuestos - (totalConImpuestos * porcentajeDescuento);
    }

    @Override
    public String getDescripcion() {
        return "Descuento por Promoción (" + (porcentajeDescuento * 100) + "%)";
    }
}
