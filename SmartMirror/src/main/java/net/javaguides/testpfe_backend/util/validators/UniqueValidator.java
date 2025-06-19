package net.javaguides.testpfe_backend.util.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class UniqueValidator implements ConstraintValidator<Unique, String> {
    private final JdbcTemplate jdbcTemplate;

    private String columnName;
    private String tableName;

    @Autowired
    public UniqueValidator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void initialize(Unique constraintAnnotation) {
        columnName = constraintAnnotation.columnName();
        tableName = constraintAnnotation.tableName();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        String sql = "SELECT COUNT(*) FROM " + tableName + " WHERE " + columnName + " = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, value);
        return count != null && count == 0;
    }
}
