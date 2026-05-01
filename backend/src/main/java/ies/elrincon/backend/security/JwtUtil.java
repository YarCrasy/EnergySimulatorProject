package ies.elrincon.backend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import ies.elrincon.backend.models.User;

@Component
public class JwtUtil {

    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final long EXPIRATION_SECONDS = 24 * 60 * 60;

    private final byte[] secret;

    public JwtUtil(@Value("${app.jwt.secret}") String secret) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payload = String.format(
                "{\"sub\":\"%s\",\"userId\":%d,\"admin\":%s,\"iat\":%d,\"exp\":%d}",
                escapeJson(user.getEmail()),
                user.getId(),
                user.isAdmin(),
                now.getEpochSecond(),
                now.plusSeconds(EXPIRATION_SECONDS).getEpochSecond()
        );

        String encodedHeader = encode(header);
        String encodedPayload = encode(payload);
        String unsignedToken = encodedHeader + "." + encodedPayload;
        return unsignedToken + "." + sign(unsignedToken);
    }

    public String extractEmail(String token) {
        return extractStringClaim(getPayload(token), "sub");
    }

    public boolean isTokenValid(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String unsignedToken = parts[0] + "." + parts[1];
            if (!MessageDigest.isEqual(sign(unsignedToken).getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                return false;
            }

            long exp = extractLongClaim(getPayload(token), "exp");
            return exp > Instant.now().getEpochSecond();
        } catch (RuntimeException ex) {
            return false;
        }
    }

    private String getPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            byte[] decodedPayload = Base64.getUrlDecoder().decode(parts[1]);
            return new String(decodedPayload, StandardCharsets.UTF_8);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid JWT", ex);
        }
    }

    private String encode(String data) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(data.getBytes(StandardCharsets.UTF_8));
    }

    private String extractStringClaim(String payload, String claim) {
        String marker = "\"" + claim + "\":\"";
        int start = payload.indexOf(marker);
        if (start == -1) throw new IllegalArgumentException("Missing JWT claim: " + claim);
        start += marker.length();
        int end = payload.indexOf('"', start);
        if (end == -1) throw new IllegalArgumentException("Invalid JWT claim: " + claim);
        return payload.substring(start, end);
    }

    private long extractLongClaim(String payload, String claim) {
        String marker = "\"" + claim + "\":";
        int start = payload.indexOf(marker);
        if (start == -1) throw new IllegalArgumentException("Missing JWT claim: " + claim);
        start += marker.length();
        int end = start;
        while (end < payload.length() && Character.isDigit(payload.charAt(end))) {
            end++;
        }
        return Long.parseLong(payload.substring(start, end));
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret, HMAC_SHA256));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign JWT", ex);
        }
    }
}
