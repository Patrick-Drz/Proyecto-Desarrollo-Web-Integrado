package com.utp.delivery.repository;

import com.utp.delivery.model.ComboProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComboProductoRepository extends JpaRepository<ComboProducto, Long> {
}