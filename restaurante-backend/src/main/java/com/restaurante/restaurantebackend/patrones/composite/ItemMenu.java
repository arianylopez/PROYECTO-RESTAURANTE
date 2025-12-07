package com.restaurante.restaurantebackend.patrones.composite;

public abstract class ItemMenu {
    protected int id;
    protected String nombre;
    protected String descripcion;
    protected double precioBase;
    protected String categoria;
    protected int tiempoEstimado;
    protected boolean disponible;

    public ItemMenu(int id, String nombre, String descripcion, double precioBase, String categoria, int tiempoEstimado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioBase = precioBase;
        this.categoria = categoria;
        this.tiempoEstimado = tiempoEstimado;
        this.disponible = true;
    }

    public abstract double getPrecio();

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setPrecioBase(double precioBase) { this.precioBase = precioBase; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public int getTiempoEstimado() { return tiempoEstimado; }
    public void setTiempoEstimado(int tiempoEstimado) { this.tiempoEstimado = tiempoEstimado; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}
