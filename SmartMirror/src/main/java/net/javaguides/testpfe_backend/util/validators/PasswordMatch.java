package net.javaguides.testpfe_backend.util.validators;

import jakarta.validation.Constraint;

import java.lang.annotation.*;

@Constraint(validatedBy = PasswordMatchValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PasswordMatch {
    String message() default "Password does not match";

    Class<?>[] groups() default {};
    Class<?>[] payload() default {};

    String password();
    String confirmPassword();
}
