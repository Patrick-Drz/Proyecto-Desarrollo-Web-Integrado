package com.utp.delivery.controller;

import com.utp.delivery.model.Oferta;
import com.utp.delivery.service.OfertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ofertas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class OfertaController {
    private final OfertaService ofertaService;

    @GetMapping
    public ResponseEntity<List<Oferta>> listarTodas() {
        return ResponseEntity.ok(ofertaService.obtenerTodas());
    }

    @PostMapping
    public ResponseEntity<Oferta> crear(@RequestBody Oferta oferta) {
        return new ResponseEntity<>(ofertaService.crear(oferta), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Oferta> actualizar(@PathVariable Long id, @RequestBody Oferta oferta) {
        return ResponseEntity.ok(ofertaService.actualizar(id, oferta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ofertaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
