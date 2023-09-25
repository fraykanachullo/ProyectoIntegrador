package com.example.curso;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CursoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CursoApplication.class, args);
	}

	@Bean
	public OpenAPI custoOpenAPI() {
		return new OpenAPI().info(new Info()
				.title("OPEN API MICROSERVICIOS CURSO")
				.version("0.0.1")
				.description("servicio web curso")
				.termsOfService("http://swagger.io/terms")
				.license(new License().name("Apache 2.0").url("http://springdoc.org")));
	}

}
