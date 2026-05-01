package ies.elrincon.backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class SchemaMaintenanceConfig {

    @Bean
    public ApplicationRunner maintainElementTypeConstraint(JdbcTemplate jdbcTemplate) {
        return args -> {
            jdbcTemplate.execute("ALTER TABLE elements DROP CONSTRAINT IF EXISTS elements_element_type_check");
            jdbcTemplate.execute("""
                    ALTER TABLE elements
                    ADD CONSTRAINT elements_element_type_check
                    CHECK (element_type IN ('CONSUMER_ELEMENT', 'GENERATOR_ELEMENT', 'BATTERY_ELEMENT'))
                    """);
        };
    }
}
