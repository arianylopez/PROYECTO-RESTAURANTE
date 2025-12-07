package com.restaurante.restaurantebackend.patrones.strategy;

public interface EstrategiaImpuesto {
    double calcularImpuesto(double subtotal);
    String getNombre();
}