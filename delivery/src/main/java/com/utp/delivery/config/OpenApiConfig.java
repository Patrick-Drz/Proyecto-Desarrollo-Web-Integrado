package com.utp.delivery.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Delivery API UTP",
        version = "1.0",
        description = "Documentación de la API para la aplicación Delivery"
    ),
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth", 
    description = "Autenticación con JWT",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP, 
    bearerFormat = "JWT", 
    in = SecuritySchemeIn.HEADER 
)
public class OpenApiConfig {

}