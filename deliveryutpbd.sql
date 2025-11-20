-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: deliveryutpbd
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
INSERT INTO `carritos` VALUES (6,1,'2025-10-16 00:11:46','2025-11-19 23:20:49'),(7,2,'2025-11-19 06:29:43','2025-11-19 23:52:16'),(8,3,'2025-11-19 06:31:02','2025-11-19 06:31:02');
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo_productos`
--

DROP TABLE IF EXISTS `combo_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo_productos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_producto_padre` bigint(20) NOT NULL,
  `id_producto_hijo` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_producto_padre` (`id_producto_padre`),
  KEY `id_producto_hijo` (`id_producto_hijo`),
  CONSTRAINT `combo_productos_ibfk_1` FOREIGN KEY (`id_producto_padre`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `combo_productos_ibfk_2` FOREIGN KEY (`id_producto_hijo`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_productos`
--

LOCK TABLES `combo_productos` WRITE;
/*!40000 ALTER TABLE `combo_productos` DISABLE KEYS */;
INSERT INTO `combo_productos` VALUES (1,4,1,1),(2,4,2,1),(4,6,1,1),(5,6,2,1);
/*!40000 ALTER TABLE `combo_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_orden_venta`
--

DROP TABLE IF EXISTS `detalles_orden_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_orden_venta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_orden_venta` bigint(20) NOT NULL,
  `id_producto` bigint(20) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario_al_momento` decimal(38,2) DEFAULT NULL,
  `id_oferta` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_orden_venta` (`id_orden_venta`),
  KEY `id_producto` (`id_producto`),
  KEY `FK_detalles_orden_oferta` (`id_oferta`),
  CONSTRAINT `FK_detalles_orden_oferta` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id`),
  CONSTRAINT `detalles_orden_venta_ibfk_1` FOREIGN KEY (`id_orden_venta`) REFERENCES `ordenes_venta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalles_orden_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_orden_venta`
--

LOCK TABLES `detalles_orden_venta` WRITE;
/*!40000 ALTER TABLE `detalles_orden_venta` DISABLE KEYS */;
INSERT INTO `detalles_orden_venta` VALUES (1,1,1,1,18.50,NULL),(2,1,2,1,3.50,NULL),(3,2,1,3,18.50,NULL),(4,2,4,1,20.00,NULL),(5,2,2,4,3.50,NULL),(6,3,1,1,18.50,NULL),(9,5,2,3,3.50,NULL),(10,5,1,2,18.50,NULL),(11,5,NULL,2,13.00,1),(12,6,NULL,1,13.00,1),(13,6,6,1,13.00,NULL),(14,7,1,1,18.50,NULL),(15,7,2,1,3.50,NULL),(16,7,6,1,13.00,NULL);
/*!40000 ALTER TABLE `detalles_orden_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `torre` varchar(1) NOT NULL,
  `piso` int(11) NOT NULL,
  `aula` int(11) NOT NULL,
  `id_usuario` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
INSERT INTO `direcciones` VALUES (1,'C',4,2,NULL),(2,'B',5,1,NULL),(3,'B',4,6,NULL),(4,'A',3,7,NULL);
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_carrito`
--

DROP TABLE IF EXISTS `items_carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_carrito` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_carrito` bigint(20) NOT NULL,
  `id_producto` bigint(20) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario_al_momento` decimal(38,2) DEFAULT NULL,
  `id_oferta` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_carrito` (`id_carrito`),
  KEY `id_producto` (`id_producto`),
  KEY `FKsppg9c27mr5wj4u423asfo40n` (`id_oferta`),
  CONSTRAINT `FKsppg9c27mr5wj4u423asfo40n` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id`),
  CONSTRAINT `items_carrito_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carritos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `items_carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_carrito`
--

LOCK TABLES `items_carrito` WRITE;
/*!40000 ALTER TABLE `items_carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `items_carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ofertas`
--

DROP TABLE IF EXISTS `ofertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ofertas` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre_oferta` varchar(100) NOT NULL,
  `descripcion_oferta` text DEFAULT NULL,
  `tipo_descuento` enum('PORCENTAJE','MONTO_FIJO') NOT NULL,
  `valor_descuento` decimal(38,2) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `activa` tinyint(1) DEFAULT 1,
  `precio_regular` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ofertas`
--

LOCK TABLES `ofertas` WRITE;
/*!40000 ALTER TABLE `ofertas` DISABLE KEYS */;
INSERT INTO `ofertas` VALUES (1,'Oferta Especial','Hamburguesa mas papa fritas y gaseos','MONTO_FIJO',7.00,'2025-11-19 18:37:00','2025-11-23 18:37:00',1,20.00);
/*!40000 ALTER TABLE `ofertas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes_venta`
--

DROP TABLE IF EXISTS `ordenes_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes_venta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `id_direccion_entrega` bigint(20) NOT NULL,
  `fecha_orden` datetime DEFAULT current_timestamp(),
  `total` decimal(38,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_direccion_entrega` (`id_direccion_entrega`),
  CONSTRAINT `ordenes_venta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `ordenes_venta_ibfk_2` FOREIGN KEY (`id_direccion_entrega`) REFERENCES `direcciones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes_venta`
--

LOCK TABLES `ordenes_venta` WRITE;
/*!40000 ALTER TABLE `ordenes_venta` DISABLE KEYS */;
INSERT INTO `ordenes_venta` VALUES (1,1,1,'2025-10-16 00:20:35',22.00,'PENDIENTE'),(2,1,3,'2025-11-19 06:07:12',89.50,'PENDIENTE'),(3,2,4,'2025-11-19 06:30:12',18.50,'PENDIENTE'),(5,1,3,'2025-11-19 22:41:20',73.50,'PENDIENTE'),(6,1,3,'2025-11-19 23:20:55',26.00,'PENDIENTE'),(7,2,4,'2025-11-19 23:52:29',35.00,'PENDIENTE');
/*!40000 ALTER TABLE `ordenes_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `codigo_producto` varchar(50) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(38,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `ruta_imagen` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_producto` (`codigo_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'HAM-CLA-01','Hamburguesa Clásica','Carne de res de 150g, queso cheddar, lechuga, tomate y salsa de la casa en pan brioche.',18.50,50,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',1),(2,'BEB-INK-01','Inca Kola 500ml','Botella de gaseosa personal Inca Kola de 500ml, helada.',3.50,100,'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',1),(4,'COM-CLA-01','Combo Clásico','La combinación perfecta: Hamburguesa Clásica con tu Inca Kola personal.',20.00,40,'/assets/images/combo_clasico.jpg',0),(6,'COM-ALM-01','Combo Almuerzo','Ahorra comprando junto! Incluye Hamburguesa Royal y Gaseosa',13.00,20,'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos_ofertas`
--

DROP TABLE IF EXISTS `productos_ofertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos_ofertas` (
  `id_producto` bigint(20) NOT NULL,
  `id_oferta` bigint(20) NOT NULL,
  PRIMARY KEY (`id_producto`,`id_oferta`),
  KEY `id_oferta` (`id_oferta`),
  CONSTRAINT `productos_ofertas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `productos_ofertas_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos_ofertas`
--

LOCK TABLES `productos_ofertas` WRITE;
/*!40000 ALTER TABLE `productos_ofertas` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos_ofertas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamaciones`
--

DROP TABLE IF EXISTS `reclamaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reclamaciones` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `id_orden_venta` bigint(20) DEFAULT NULL,
  `tipo_reclamacion` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(50) DEFAULT 'ABIERTO',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_orden_venta` (`id_orden_venta`),
  CONSTRAINT `reclamaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `reclamaciones_ibfk_2` FOREIGN KEY (`id_orden_venta`) REFERENCES `ordenes_venta` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamaciones`
--

LOCK TABLES `reclamaciones` WRITE;
/*!40000 ALTER TABLE `reclamaciones` DISABLE KEYS */;
INSERT INTO `reclamaciones` VALUES (1,1,NULL,'RECLAMO','En mi pedido realizado hoy, la \'Hamburguesa Clásica\' llegó sin las cremas que solicité y la carne estaba demasiado cocida. Además, la gaseosa del combo llegó caliente. Solicito una solución o el cambio del producto.','2025-11-20 04:43:01','ABIERTO'),(2,1,NULL,'QUEJA','El tiempo de espera fue excesivo. La aplicación decía 30 minutos, pero mi pedido tardó más de una hora y media en llegar al aula B0406. Cuando llegó, el empaque estaba maltratado.','2025-11-20 04:43:21','ABIERTO'),(3,1,NULL,'SUGERENCIA','Sería excelente si pudieran agregar opciones vegetarianas al menú, como hamburguesas de lentejas o quinua, ya que varios compañeros no comen carne. También sugeriría agregar pago directo con Yape.','2025-11-20 04:43:39','ABIERTO');
/*!40000 ALTER TABLE `reclamaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_direcciones`
--

DROP TABLE IF EXISTS `usuario_direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_direcciones` (
  `id_usuario` bigint(20) NOT NULL,
  `id_direccion` bigint(20) NOT NULL,
  KEY `FK7gxg27hr8121e7yagy2935y4v` (`id_direccion`),
  KEY `FKqj6k7o53vpmly0ng1ymago1gp` (`id_usuario`),
  CONSTRAINT `FK7gxg27hr8121e7yagy2935y4v` FOREIGN KEY (`id_direccion`) REFERENCES `direcciones` (`id`),
  CONSTRAINT `FKqj6k7o53vpmly0ng1ymago1gp` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_direcciones`
--

LOCK TABLES `usuario_direcciones` WRITE;
/*!40000 ALTER TABLE `usuario_direcciones` DISABLE KEYS */;
INSERT INTO `usuario_direcciones` VALUES (1,1),(1,2),(1,3),(2,4);
/*!40000 ALTER TABLE `usuario_direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL DEFAULT 'CLIENTE',
  `codigo_estudiante` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `codigo_estudiante` (`codigo_estudiante`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Patrick Del Aguila','u22327322@utp.edu.pe','$2a$10$Ghlw2GBGqxeBfwVVg2Eime6RIuV/Q1Go2s6k3w.xVXm1fbFatAIw.','CLIENTE','u22327322','2025-10-15 23:32:19',1),(2,'Pablo Torres','u12345678@utp.edu.pe','$2a$10$U52vBldtSlceRFmblrrQVOM5CWdswKhzRV6J/JFIjez7fn8bZ6IAm','CLIENTE','u12345678','2025-11-19 06:08:20',1),(3,'Carlos Tevez','u87654321@utp.edu.pe','$2a$10$/uurrWTSMDJIkyCdzJHWvuAWsE1Twf6sBbeXf5EOSep9WHnR3j5wG','ADMINISTRADOR','u87654321','2025-11-19 06:31:02',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-19 18:54:57
