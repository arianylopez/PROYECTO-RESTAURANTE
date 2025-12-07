package com.restaurante.restaurantebackend.modelo;

public class Configuracion {
    private String nombreRestaurante;
    private String nit;
    private String direccion;
    private String telefono;

    public Configuracion() {}

    public Configuracion(String nombreRestaurante, String nit, String direccion, String telefono) {
        this.nombreRestaurante = nombreRestaurante;
        this.nit = nit;
        this.direccion = direccion;
        this.telefono = telefono;
    }

    public String getNombreRestaurante() { return nombreRestaurante; }
    public void setNombreRestaurante(String nombreRestaurante) { this.nombreRestaurante = nombreRestaurante; }

    public String getNit() { return nit; }
    public void setNit(String nit) { this.nit = nit; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}