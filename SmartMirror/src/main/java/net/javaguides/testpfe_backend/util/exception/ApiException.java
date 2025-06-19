package net.javaguides.testpfe_backend.util.exception;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class ApiException extends RuntimeException {
  private String message;
  private int statusCode;
  private Map<String, String> errors;
}
