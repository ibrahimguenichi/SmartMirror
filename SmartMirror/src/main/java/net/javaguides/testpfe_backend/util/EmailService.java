package net.javaguides.testpfe_backend.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmailWithAttachment(String toEmail,
                                        String subject,
                                        String body,
                                        String attachmentPath) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body);

        FileSystemResource file = new FileSystemResource(new File(attachmentPath));
        helper.addAttachment(file.getFilename(), file);

        mailSender.send(message);
    }
}
