package org.example.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReadEnvConfig {

    static {
        Dotenv.configure()
                .ignoreIfMissing()
                .systemProperties()
                .load();

        System.out.println("Environment variables loaded into System Properties.");
    }
}