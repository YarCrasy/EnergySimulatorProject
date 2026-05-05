package ies.elrincon.backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import ies.elrincon.backend.models.User;

class JwtUtilTest {

    private static final String SECRET = "test-secret-for-jwt-util";
    private JwtUtil jwtUtil;
    private User user;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(SECRET);
        user = new User();
        user.setId(7L);
        user.setEmail("tester@example.com");
        user.setAdmin(true);
    }

    @Test
    void generateToken_ShouldProduceValidTokenWithEmail() {
        String token = jwtUtil.generateToken(user);

        assertNotNull(token);
        assertTrue(jwtUtil.isTokenValid(token));
        assertEquals("tester@example.com", jwtUtil.extractEmail(token));
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenTokenIsTampered() {
        String token = jwtUtil.generateToken(user);
        String[] parts = token.split("\\.");

        String tamperedPayload = "{\"sub\":\"attacker@example.com\",\"userId\":7,\"admin\":true,\"iat\":0,\"exp\":9999999999}";
        String tamperedToken = parts[0] + "." + base64Url(tamperedPayload) + "." + parts[2];

        assertFalse(jwtUtil.isTokenValid(tamperedToken));
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenTokenIsExpired() {
        String token = jwtUtil.generateToken(user);
        String[] parts = token.split("\\.");

        long now = Instant.now().getEpochSecond();
        String expiredPayload = String.format(
                "{\"sub\":\"%s\",\"userId\":%d,\"admin\":%s,\"iat\":%d,\"exp\":%d}",
                "tester@example.com",
                7,
                true,
                now - 200,
                now - 100
        );

        String unsignedExpired = parts[0] + "." + base64Url(expiredPayload);
        String expiredToken = unsignedExpired + "." + sign(unsignedExpired, SECRET);

        assertFalse(jwtUtil.isTokenValid(expiredToken));
    }

    private static String base64Url(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private static String sign(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign JWT in test", ex);
        }
    }
}
