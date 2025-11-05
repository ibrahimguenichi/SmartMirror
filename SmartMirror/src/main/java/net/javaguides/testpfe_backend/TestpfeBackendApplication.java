package net.javaguides.testpfe_backend;

import io.github.cdimascio.dotenv.Dotenv;
import net.javaguides.testpfe_backend.config.ApplicationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(ApplicationProperties.class)
public class TestpfeBackendApplication {

	public static void main(String[] args) {
		// Load .env.dev file
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.filename(".env.dev")
				.load();

		// Set system properties from .env.dev
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(TestpfeBackendApplication.class, args);
	}
}
