package com.utp.delivery.controller;

import com.utp.delivery.model.Oferta;
import com.utp.delivery.repository.OfertaRepository;
import com.utp.delivery.service.OfertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ofertas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class OfertaController {
    
    private final OfertaService ofertaService;
    private final OfertaRepository ofertaRepository;

    @GetMapping
    public ResponseEntity<List<Oferta>> listarTodas() {
        return ResponseEntity.ok(ofertaService.obtenerTodas());
    }

    @GetMapping("/activas")
    public List<Oferta> obtenerOfertasActivas() {
        return ofertaRepository.findByActivaTrue();
    }

    @PostMapping
    public ResponseEntity<Oferta> crear(@RequestBody Oferta oferta) {
        return new ResponseEntity<>(ofertaService.crear(oferta), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Oferta> actualizar(@PathVariable Long id, @RequestBody Oferta oferta) {
        return ResponseEntity.ok(ofertaService.actualizar(id, oferta));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        
        if (!oferta.isActiva()) {
            if (oferta.getFechaFin().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                        .body("Oferta vencida. Actualiza la fecha.");
            }
            if (oferta.getStock() <= 0) {
                return ResponseEntity.badRequest()
                        .body("Sin stock disponible. Actualiza el inventario.");
            }
        }
        
        oferta.setActiva(!oferta.isActiva());
        return ResponseEntity.ok(ofertaRepository.save(oferta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ofertaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}