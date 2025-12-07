package com.restaurante.restaurantebackend.controladores;

import com.restaurante.restaurantebackend.servicios.RestauranteFacade;
import org.springframework.web.bind.annotation.*;
import com.restaurante.restaurantebackend.patrones.singleton.BaseDeDatos;
import com.restaurante.restaurantebackend.modelo.Configuracion;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*")
public class ConfigController {

    private RestauranteFacade facade;

    public ConfigController() {
        this.facade = new RestauranteFacade();
    }

    @GetMapping("/estrategias")
    public Map<String, Boolean> obtenerConfiguracion() {
        Map<String, Boolean> config = new HashMap<>();
        BaseDeDatos db = BaseDeDatos.getInstancia();

        config.put("happyHour", db.isHappyHourActivo());
        config.put("impuestoTurista", db.isImpuestoTuristaActivo());

        return config;
    }

    @PostMapping("/estrategias")
    public void configurarEstrategias(@RequestBody Map<String, Boolean> config) {
        boolean happyHour = config.getOrDefault("happyHour", false);
        boolean turista = config.getOrDefault("impuestoTurista", false);
        facade.configurarEstrategias(happyHour, turista);
    }

    @GetMapping("/factura")
    public Configuracion obtenerDatosFactura() {
        return facade.obtenerDatosFactura();
    }

    @PostMapping("/factura")
    public void guardarDatosFactura(@RequestBody Configuracion config) {
        facade.guardarDatosFactura(config);
    }
}