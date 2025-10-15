package com.utp.delivery.controller;

import com.utp.delivery.model.Direccion;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.service.DireccionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DireccionController {
    private final DireccionService direccionService;

    @PostMapping
    public ResponseEntity<Direccion> agregarDireccion(@AuthenticationPrincipal Usuario usuario, @RequestBody Direccion direccion) {
        Direccion nuevaDireccion = direccionService.agregarDireccionAUsuario(usuario.getId(), direccion);
        return new ResponseEntity<>(nuevaDireccion, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Direccion>> obtenerDirecciones(@AuthenticationPrincipal Usuario usuario) {
        List<Direccion> direcciones = direccionService.obtenerDireccionesPorUsuario(usuario.getId());
        return ResponseEntity.ok(direcciones);
    }
}
