package com.restaurante.restaurantebackend.modelo;

public class Mesa {
    private int id;
    private int capacidad;
    private String estado;

    public Mesa(int id, int capacidad) {
        this.id = id;
        this.capacidad = capacidad;
        this.estado = "Disponible";
    }

    public int getId() {
        return id;
    }

    public int getCapacidad() {
        return capacidad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
