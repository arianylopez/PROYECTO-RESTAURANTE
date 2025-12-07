package com.restaurante.restaurantebackend.controladores;

import com.restaurante.restaurantebackend.patrones.composite.ItemMenu;
import com.restaurante.restaurantebackend.servicios.RestauranteFacade;
import com.restaurante.restaurantebackend.patrones.composite.Producto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private RestauranteFacade facade;

    public MenuController() {
        this.facade = new RestauranteFacade();
    }

    @GetMapping
    public List<ItemMenu> obtenerMenu() {
        return facade.obtenerMenu();
    }

    @PostMapping
    public void crearPlato(@RequestBody Producto p) {
        if(p.getId() == 0) {
            int id = (int)(System.currentTimeMillis() % 100000);
        }

        facade.crearProducto(p);
    }

    @PutMapping("/{id}")
    public void editarPlato(@PathVariable int id, @RequestBody Producto p) {
        facade.editarProducto(id, p);
    }
}