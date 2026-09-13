package com.smartration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartRationApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartRationApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Smart Ration Shop Spring Boot API is Running!   ");
        System.out.println(" Endpoint URL: http://localhost:8080/api         ");
        System.out.println("=================================================");
    }
}
