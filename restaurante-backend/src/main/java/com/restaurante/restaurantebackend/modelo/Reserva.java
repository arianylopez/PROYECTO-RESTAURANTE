package com.restaurante.restaurantebackend.modelo;

public class Reserva {
    private Integer id;
    private Integer idMesa;
    private String fecha;
    private String hora;
    private String nombreCliente;
    private Integer personas;
    private String telefono;
    private String notas;

    public Reserva() {
    }

    public Reserva(Integer id, Integer idMesa, String fecha, String hora, String nombreCliente, Integer personas, String telefono, String notas) {
        this.id = id;
        this.idMesa = idMesa;
        this.fecha = fecha;
        this.hora = hora;
        this.nombreCliente = nombreCliente;
        this.personas = personas;
        this.telefono = telefono;
        this.notas = notas;
    }

    public int getId() { return id != null ? id : 0; }
    public void setId(Integer id) { this.id = id; }

    public int getIdMesa() { return idMesa != null ? idMesa : 0; }
    public void setIdMesa(Integer idMesa) { this.idMesa = idMesa; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }

    public int getPersonas() { return personas != null ? personas : 1; }
    public void setPersonas(Integer personas) { this.personas = personas; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}