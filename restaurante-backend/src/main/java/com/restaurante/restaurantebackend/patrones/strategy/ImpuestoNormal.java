package com.restaurante.restaurantebackend.patrones.strategy;

public class ImpuestoNormal implements EstrategiaImpuesto {
    @Override
    public double calcularImpuesto(double subtotal) {
        return subtotal * 0.13; // 13% IVA
    }

    @Override
    public String getNombre() {
        return "Impuesto de Ley (13%)";
    }
}
