package com.restaurante.restaurantebackend.patrones.strategy;

public class ImpuestoTurista implements EstrategiaImpuesto {
    @Override
    public double calcularImpuesto(double subtotal) {
        return subtotal * 0.18; // 18% para turistas
    }

    @Override
    public String getNombre() {
        return "Impuesto al Turista (18%)";
    }
}