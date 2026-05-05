package ies.elrincon.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private static final String ADMIN = "ADMIN";
    private static final String[] PUBLIC_ENDPOINTS = {
            "/error",
            "/api/users/login"
    };
    private static final String[] ADMIN_USER_READ_ENDPOINTS = {
            "/api/users",
            "/api/users/search"
    };
    private static final String[] ADMIN_CATALOG_ENDPOINTS = {
            "/api/elements",
            "/api/generator-elements/**",
            "/api/consumer-element/**",
            "/api/battery-elements/**"
    };

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ADMIN_CATALOG_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.POST, ADMIN_CATALOG_ENDPOINTS).hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PUT, ADMIN_CATALOG_ENDPOINTS).hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, ADMIN_CATALOG_ENDPOINTS).hasRole(ADMIN)
                        .requestMatchers(HttpMethod.GET, ADMIN_USER_READ_ENDPOINTS).hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole(ADMIN)
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
