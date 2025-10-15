package com.utp.delivery.controller;

import com.utp.delivery.dto.CrearOrdenRequest;
import com.utp.delivery.model.OrdenVenta;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.service.OrdenVentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class OrdenVentaController {
    private final OrdenVentaService ordenVentaService;

    @PostMapping
    public ResponseEntity<OrdenVenta> crearOrden(@AuthenticationPrincipal Usuario usuario, @RequestBody CrearOrdenRequest ordenRequest) {
        OrdenVenta nuevaOrden = ordenVentaService.crearOrdenDesdeCarrito(usuario.getId(), ordenRequest);
        return new ResponseEntity<>(nuevaOrden, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<OrdenVenta>> obtenerMisOrdenes(@AuthenticationPrincipal Usuario usuario) {
        List<OrdenVenta> ordenes = ordenVentaService.obtenerOrdenesPorUsuario(usuario.getId());
        return ResponseEntity.ok(ordenes);
    }
}
