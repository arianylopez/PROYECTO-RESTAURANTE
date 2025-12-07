package com.restaurante.restaurantebackend.patrones.strategy;

public class PagoNormal implements EstrategiaCobro {
    @Override
    public double generarTotalAPagar(double totalConImpuestos) {
        return totalConImpuestos;
    }

    @Override
    public String getDescripcion() {
        return "Pago Completo (Estándar)";
    }
}