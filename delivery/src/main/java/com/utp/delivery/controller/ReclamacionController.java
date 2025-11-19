package com.utp.delivery.controller;

import com.utp.delivery.dto.CrearReclamacionRequest;
import com.utp.delivery.model.Reclamacion;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.service.ReclamacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReclamacionController {

    private final ReclamacionService reclamacionService;

    @PostMapping
    public ResponseEntity<Reclamacion> crear(@AuthenticationPrincipal Usuario usuario, 
                                             @RequestBody CrearReclamacionRequest request) {
        Reclamacion nueva = reclamacionService.crearReclamacion(usuario.getId(), request);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Reclamacion>> listarTodas() {
        return ResponseEntity.ok(reclamacionService.obtenerTodas());
    }
}