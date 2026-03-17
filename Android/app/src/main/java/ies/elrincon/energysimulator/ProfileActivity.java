package ies.elrincon.energysimulator;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import ies.elrincon.energysimulator.api.UsersAPI;
import ies.elrincon.energysimulator.models.User;

public class ProfileActivity extends AppCompatActivity {
    public static final String EXTRA_USER = "user";
    private User currentUser;

    private EditText fullNameInput;
    private EditText birthDateInput;
    private EditText emailInput;
    private EditText newPasswordInput;
    private TextView userTypeView;
    private TextView errorView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_profile);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.profileActivity), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        bindViews();
        loadUserFromIntent();
        if (currentUser == null) {
            finish();
            return;
        }

        populateProfile(currentUser);
        setupSaveProfile();
        setupDeleteAccount();
        setupBackBtn();
    }

    private void bindViews() {
        fullNameInput = findViewById(R.id.profileName);
        birthDateInput = findViewById(R.id.profileBirthday);
        emailInput = findViewById(R.id.profileEmail);
        newPasswordInput = findViewById(R.id.newPassword);
        userTypeView = findViewById(R.id.profileUserType);
        errorView = findViewById(R.id.profileErrMsg);
    }

    private void loadUserFromIntent() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            currentUser = getIntent().getParcelableExtra(EXTRA_USER, User.class);
        } else {
            currentUser = getIntent().getParcelableExtra(EXTRA_USER);
        }
    }

    private void populateProfile(User user) {
        fullNameInput.setText(user.getFullName());
        birthDateInput.setText(user.getDateOfBirth());
        emailInput.setText(user.getEmail());
        userTypeView.setText(user.isAdmin() ? "Administrador" : "Usuario");
    }

    private void setupSaveProfile() {
        Button saveButton = findViewById(R.id.saveProfileBtn);
        saveButton.setOnClickListener(v -> {
            errorView.setText("");

            String fullName = valueOf(fullNameInput);
            String birthDate = valueOf(birthDateInput);
            String email = valueOf(emailInput);
            String newPassword = valueOf(newPasswordInput);

            String validation = validateProfile(fullName, birthDate, email, newPassword);
            if (!TextUtils.isEmpty(validation)) {
                errorView.setText(validation);
                return;
            }

            currentUser.setFullName(fullName);
            currentUser.setDateOfBirth(birthDate);
            currentUser.setEmail(email);
            if (!newPassword.isEmpty()) {
                currentUser.setPasswordHash(newPassword);
            }

            v.setEnabled(false);
            new Thread(() -> {
                try {
                    UsersAPI.updateUser(currentUser);
                    runOnUiThread(() -> {
                        newPasswordInput.setText("");
                        Toast.makeText(this, "Perfil actualizado", Toast.LENGTH_SHORT).show();
                    });
                } catch (Exception e) {
                    runOnUiThread(() -> errorView.setText("Error al actualizar: " + e.getMessage()));
                } finally {
                    runOnUiThread(() -> v.setEnabled(true));
                }
            }).start();
        });
    }

    private String validateProfile(String fullName, String birthDate, String email, String newPassword) {
        if (fullName.isEmpty()) {
            return "Introduce tu nombre completo";
        }
        if (birthDate.isEmpty()) {
            return "Introduce una fecha de nacimiento";
        }
        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            return "Introduce un correo electr\u00f3nico v\u00e1lido";
        }
        if (!newPassword.isEmpty() && newPassword.length() < 8) {
            return "La nueva contrase\u00f1a debe tener al menos 8 caracteres";
        }
        return "";
    }

    private void setupBackBtn() {
        Button backBtn = findViewById(R.id.backToProjectsBtn);
        backBtn.setOnClickListener(v -> finish());
    }

    private void setupDeleteAccount() {
        Button deleteBtn = findViewById(R.id.accountDeleteBtn);
        deleteBtn.setOnClickListener(v -> {
            if (currentUser == null) return;
            new AlertDialog.Builder(this)
                    .setTitle("Eliminar cuenta")
                    .setMessage("¿Seguro que quieres eliminar tu cuenta? Esta acción es permanente.")
                    .setNegativeButton("Cancelar", null)
                    .setPositiveButton("Eliminar", (dialog, which) -> executeDelete(deleteBtn))
                    .show();
        });
    }

    private void executeDelete(Button deleteBtn) {
        deleteBtn.setEnabled(false);
        new Thread(() -> {
            try {
                UsersAPI.deleteUser(currentUser.getId());
                runOnUiThread(() -> {
                    Toast.makeText(this, "Cuenta eliminada", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(this, MainActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                });
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error al eliminar: " + e.getMessage(), Toast.LENGTH_LONG).show());
            } finally {
                runOnUiThread(() -> deleteBtn.setEnabled(true));
            }
        }).start();
    }

    private String valueOf(EditText input) {
        return input.getText().toString().trim();
    }
}
