package net.javaguides.testpfe_backend.util.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import net.javaguides.testpfe_backend.users.dto.CreateEmployeeDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.Advised;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {
    private static final Logger logger = LoggerFactory.getLogger(PasswordMatchValidator.class);

    private String passwordFieldName;
    private String passwordMatchFieldName;

    @Override
    public void initialize(PasswordMatch constraintAnnotation) {
        passwordFieldName = constraintAnnotation.password();
        passwordMatchFieldName = constraintAnnotation.confirmPassword();
    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext context) {
        try {
            // Handle potential proxy
            Object target = o;
            if (target instanceof Advised) {
                target = ((Advised) target).getTargetSource().getTarget();
            }

            Class<?> clazz = target.getClass();

            Method getPassword = clazz.getMethod("getPassword");
            Method getConfirmPassword = clazz.getMethod("getConfirmPassword");

            String password = (String) getPassword.invoke(target);
            String confirmPassword = (String) getConfirmPassword.invoke(target);

            if (password == null || !password.equals(confirmPassword)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Passwords do not match")
                        .addPropertyNode("confirmPassword")
                        .addConstraintViolation();
                return false;
            }
            return true;
        } catch (Exception e) {
            logger.error("Validation error", e);
            return false;
        }
    }

    private Field getField(Class<?> clazz, String fieldName) throws NoSuchFieldException {
        Class<?> current = clazz;
        while (current != null) {
            try {
                return current.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                current = current.getSuperclass();
            }
        }
        throw new NoSuchFieldException(fieldName);
    }
}
