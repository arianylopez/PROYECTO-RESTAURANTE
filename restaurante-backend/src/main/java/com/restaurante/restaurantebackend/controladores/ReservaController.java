package com.restaurante.restaurantebackend.controladores;

import com.restaurante.restaurantebackend.modelo.Reserva;
import com.restaurante.restaurantebackend.servicios.RestauranteFacade;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private RestauranteFacade facade;

    public ReservaController() {
        this.facade = new RestauranteFacade();
    }

    @GetMapping
    public List<Reserva> obtenerReservas() {
        return facade.obtenerReservas();
    }

    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        try {
            if (reserva.getId() == 0) {
                reserva.setId((int) (System.currentTimeMillis() % 100000));
            }
            facade.crearReserva(reserva);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void eliminarReserva(@PathVariable int id) {
        facade.eliminarReserva(id);
    }
}