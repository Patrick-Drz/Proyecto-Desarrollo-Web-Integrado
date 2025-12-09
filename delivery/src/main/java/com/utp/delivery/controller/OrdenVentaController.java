package com.utp.delivery.controller;

import com.utp.delivery.dto.CrearOrdenRequest;
import com.utp.delivery.model.OrdenVenta;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.repository.UsuarioRepository;
import com.utp.delivery.service.OrdenVentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class OrdenVentaController {
    
    private final OrdenVentaService ordenVentaService;
    private final UsuarioRepository usuarioRepository; 

    private Usuario getUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String correo = authentication.getName();
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @PostMapping
    public ResponseEntity<OrdenVenta> crearOrden(@RequestBody CrearOrdenRequest ordenRequest) {
        Usuario usuario = getUsuarioAutenticado();

        OrdenVenta nuevaOrden = ordenVentaService.crearOrdenDesdeCarrito(usuario.getId(), ordenRequest);
        return new ResponseEntity<>(nuevaOrden, HttpStatus.CREATED);
    }

    @GetMapping("/mis-ordenes")
    public ResponseEntity<List<OrdenVenta>> obtenerMisOrdenes() {
        Usuario usuario = getUsuarioAutenticado();
        List<OrdenVenta> ordenes = ordenVentaService.obtenerOrdenesPorUsuario(usuario.getId());
        return ResponseEntity.ok(ordenes);
    }

    @GetMapping
    public ResponseEntity<List<OrdenVenta>> obtenerOrdenes() {
        return obtenerMisOrdenes();
    }

    @GetMapping("/todas")
    public ResponseEntity<List<OrdenVenta>> listarTodasLasOrdenes() {
        return ResponseEntity.ok(ordenVentaService.obtenerTodasLasOrdenes());
    }
}