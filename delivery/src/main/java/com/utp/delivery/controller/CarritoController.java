package com.utp.delivery.controller;

import com.utp.delivery.dto.AddItemRequest;
import com.utp.delivery.model.Carrito;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CarritoController {
    private final CarritoService carritoService;

    @GetMapping
    public ResponseEntity<Carrito> obtenerCarrito(@AuthenticationPrincipal Usuario usuario) {
        Carrito carrito = carritoService.obtenerCarritoPorUsuario(usuario.getId());
        return ResponseEntity.ok(carrito);
    }
    
    @PostMapping("/items")
    public ResponseEntity<Carrito> agregarItem(@AuthenticationPrincipal Usuario usuario, @RequestBody AddItemRequest itemRequest) {
        Carrito carritoActualizado = carritoService.agregarItemACarrito(usuario.getId(), itemRequest);
        return ResponseEntity.ok(carritoActualizado);
    }

    @DeleteMapping("/items/{idItem}")
    public ResponseEntity<Carrito> eliminarItem(@AuthenticationPrincipal Usuario usuario, @PathVariable Long idItem) {
        Carrito carritoActualizado = carritoService.eliminarItemDelCarrito(usuario.getId(), idItem);
        return ResponseEntity.ok(carritoActualizado);
    }

    @DeleteMapping
    public ResponseEntity<Void> vaciarCarrito(@AuthenticationPrincipal Usuario usuario) {
        carritoService.limpiarCarrito(usuario.getId());
        return ResponseEntity.noContent().build();
    }
}