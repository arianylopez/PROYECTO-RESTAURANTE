package com.restaurante.restaurantebackend.controladores;

import com.restaurante.restaurantebackend.modelo.Mesa;
import com.restaurante.restaurantebackend.servicios.RestauranteFacade;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    private RestauranteFacade facade;

    public MesaController() {
        this.facade = new RestauranteFacade();
    }

    @GetMapping
    public List<Mesa> obtenerMesas() {
        return facade.obtenerMesas();
    }

    @PostMapping("/{id}/estado")
    public void cambiarEstado(@PathVariable int id, @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        facade.cambiarEstadoMesa(id, nuevoEstado);
    }
}