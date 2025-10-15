package com.utp.delivery.controller;

import com.utp.delivery.dto.CrearComboRequest;
import com.utp.delivery.model.ComboProducto;
import com.utp.delivery.service.ComboProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/combos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ComboProductoController {

    private final ComboProductoService comboProductoService;

    @PostMapping("/componentes")
    public ResponseEntity<ComboProducto> agregarComponente(@RequestBody CrearComboRequest request) {
        ComboProducto nuevoComponente = comboProductoService.agregarComponenteACombo(request);
        return new ResponseEntity<>(nuevoComponente, HttpStatus.CREATED);
    }
}
