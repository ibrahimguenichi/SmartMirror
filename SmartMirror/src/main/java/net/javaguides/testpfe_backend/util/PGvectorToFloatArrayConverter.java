package net.javaguides.testpfe_backend.util;

import org.springframework.data.convert.ReadingConverter;
import org.springframework.core.convert.converter.Converter;
import org.postgresql.util.PGobject;

@ReadingConverter
public class PGvectorToFloatArrayConverter implements Converter<PGobject, float[]> {
    @Override
    public float[] convert(PGobject source) {
        try {
            String value = source.getValue();
            String[] parts = value.substring(1, value.length() - 1).split(",");
            float[] floats = new float[parts.length];
            for (int i = 0; i < parts.length; i++) {
                floats[i] = Float.parseFloat(parts[i].trim());
            }
            return floats;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert PGvector to float[]", e);
        }
    }
}
