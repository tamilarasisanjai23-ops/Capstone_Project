package com.disaster.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )

            .csrf(csrf ->
                csrf.disable()
            )

            .authorizeHttpRequests(auth ->
                auth
                    .anyRequest()
                    .permitAll()
            )

            .formLogin(form ->
                form.disable()
            );

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        /*
         * Local React/Vite frontend
         */
        configuration.setAllowedOrigins(
            Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5173",

                "http://localhost:5500",
                "http://127.0.0.1:5500"
            )
        );


        /*
         * HTTP methods allowed from frontend
         */
        configuration.setAllowedMethods(
            Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            )
        );


        /*
         * Request headers allowed
         */
        configuration.setAllowedHeaders(
            Arrays.asList("*")
        );


        /*
         * We are not using browser credentials/cookies
         */
        configuration.setAllowCredentials(
            false
        );


        /*
         * Cache preflight result for 1 hour
         */
        configuration.setMaxAge(
            3600L
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
            "/**",
            configuration
        );


        return source;
    }
}