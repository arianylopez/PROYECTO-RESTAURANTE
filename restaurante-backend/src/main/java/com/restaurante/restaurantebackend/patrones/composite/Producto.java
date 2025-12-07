package com.restaurante.restaurantebackend.patrones.composite;

public class Producto extends ItemMenu {

    public Producto(int id, String nombre, String descripcion, double precioBase, String categoria, int tiempoEstimado) {
        super(id, nombre, descripcion, precioBase, categoria, tiempoEstimado);
    }

    @Override
    public double getPrecio() {
        return precioBase;
    }
}