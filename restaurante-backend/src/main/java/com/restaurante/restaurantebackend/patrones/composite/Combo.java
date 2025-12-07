package com.restaurante.restaurantebackend.patrones.composite;

import java.util.ArrayList;
import java.util.List;

public class Combo extends ItemMenu {
    private List<ItemMenu> items;
    private double descuento;

    public Combo(int id, String nombre, String descripcion, double descuento) {
        super(id, nombre, descripcion, 0, "Especiales", 20);
        this.items = new ArrayList<>();
        this.descuento = descuento;
    }

    public void agregarItem(ItemMenu item) {
        items.add(item);
    }

    @Override
    public double getPrecio() {
        double total = 0;
        for (ItemMenu item : items) {
            total += item.getPrecio();
        }
        return total - (total * descuento);
    }
}