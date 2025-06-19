package net.javaguides.testpfe_backend.config;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DatabaseConfiguration {
    private String name;
    private String username;
    private String password;
    private String host;
    private int port;
}
