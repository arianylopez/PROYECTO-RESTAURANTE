package com.restaurante.restaurantebackend.patrones.strategy;

public interface EstrategiaCobro {
    double generarTotalAPagar(double totalConImpuestos);
    String getDescripcion();
}