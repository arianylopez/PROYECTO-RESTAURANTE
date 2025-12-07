package com.restaurante.restaurantebackend.controladores;

import com.restaurante.restaurantebackend.modelo.Pedido;
import com.restaurante.restaurantebackend.servicios.RestauranteFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private RestauranteFacade facade;

    public PedidoController() {
        this.facade = new RestauranteFacade();
    }

    @PostMapping
    public Pedido crearPedido(@RequestParam String tipo,
                              @RequestParam int id,
                              @RequestParam String cliente,
                              @RequestParam String datoExtra) {
        return facade.crearPedido(tipo, id, cliente, datoExtra);
    }

    @PostMapping("/{id}/avanzar")
    public void avanzarEstado(@PathVariable int id) {
        facade.avanzarEstadoPedido(id);
    }

    @PostMapping("/{id}/cancelar")
    public void cancelarPedido(@PathVariable int id) {
        facade.cancelarPedido(id);
    }

    @GetMapping("/{id}/total")
    public double obtenerTotal(@PathVariable int id) {
        return facade.calcularTotalPedido(id);
    }

    @GetMapping("/cocina")
    public List<Pedido> obtenerPedidosCocina() {
        return facade.obtenerPedidosEnCocina();
    }

    @GetMapping("/listos")
    public List<Pedido> obtenerPedidosListos() {
        return facade.obtenerPedidosListosParaServir();
    }

    @GetMapping
    public List<Pedido> obtenerTodos() {
        return facade.obtenerTodosLosPedidos();
    }

    @PostMapping("/{id}/items")
    public void agregarItem(@PathVariable int id, @RequestBody Map<String, String> body) {
        String nombreProducto = body.get("nombre");
        facade.agregarProductoPorNombre(id, nombreProducto);
    }

    @PostMapping("/{id}/pagar")
    public void pagarPedido(@PathVariable int id, @RequestBody java.util.Map<String, String> datos) {
        String nit = datos.get("nit");
        String razonSocial = datos.get("razonSocial");
        facade.pagarPedido(id, nit, razonSocial);
    }

    @GetMapping("/historial")
    public List<Pedido> obtenerHistorial() {
        return facade.obtenerHistorial();
    }
}
