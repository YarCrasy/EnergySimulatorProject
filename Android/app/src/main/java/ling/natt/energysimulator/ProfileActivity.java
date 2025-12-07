package ling.natt.energysimulator;

import android.app.AlertDialog;
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

import ling.natt.energysimulator.api.UsersAPI;
import ling.natt.energysimulator.models.User;

public class ProfileActivity extends AppCompatActivity {
    private static final String EXTRA_USER = "user";
    private User currentUser;


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
        currentUser = getIntent().getParcelableExtra(EXTRA_USER);
        if (currentUser != null) {
            populateProfile(currentUser);
            setupPasswordChange();
            setupEmailChange();
            setupDeleteAccount();
            setupBackBtn();
        } else {
            finish();
        }
    }
    private void populateProfile(User user) {
        TextView name = findViewById(R.id.profileName);
        TextView birthday = findViewById(R.id.profileBirthday);
        TextView userType = findViewById(R.id.profileUserType);

        name.setText(user.getFullName());
        birthday.setText(user.getDateOfBirth());
        userType.setText(user.isAdmin() ? "Administrador" : "Usuario");
    }

    private void setupPasswordChange() {
        Button changeBtn = findViewById(R.id.changePasswordBtn);
        EditText oldPassword = findViewById(R.id.oldPassword);
        EditText newPassword = findViewById(R.id.newPassword);
        TextView errMsg = findViewById(R.id.passwordErrMsg);

        changeBtn.setOnClickListener(v -> {
            errMsg.setText("");
            String oldPwd = oldPassword.getText().toString();
            String newPwd = newPassword.getText().toString();

            String validation = validatePasswords(oldPwd, newPwd);
            if (!TextUtils.isEmpty(validation)) {
                errMsg.setText(validation);
                return;
            }

            v.setEnabled(false);
            new Thread(() -> {
                try {
                    currentUser.setPasswordHash(newPwd);
                    UsersAPI.updateUser(currentUser);
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Contraseña actualizada", Toast.LENGTH_SHORT).show();
                        oldPassword.setText("");
                        newPassword.setText("");
                    });
                } catch (Exception e) {
                    runOnUiThread(() -> errMsg.setText("Error al actualizar: " + e.getMessage()));
                } finally {
                    runOnUiThread(() -> v.setEnabled(true));
                }
            }).start();
        });
    }

    private void setupBackBtn() {
        Button backBtn = findViewById(R.id.backToProjectsBtn);
        if (backBtn != null) backBtn.setOnClickListener(v -> finish());
    }

    private String validatePasswords(String oldPwd, String newPwd) {
        if (TextUtils.isEmpty(oldPwd) || TextUtils.isEmpty(newPwd)) {
            return "Completa todos los campos";
        }
        if (newPwd.length() < 6) {
            return "La contraseña debe tener al menos 6 caracteres";
        }
        return "";
    }

    private void setupEmailChange() {
        Button changeEmailBtn = findViewById(R.id.changeEmailBtn);
        EditText oldEmailInput = findViewById(R.id.oldEmail);
        EditText newEmailInput = findViewById(R.id.newEmail);
        TextView errMsg = findViewById(R.id.emailErrMsg);

        changeEmailBtn.setOnClickListener(v -> {
            errMsg.setText("");
            String oldEmail = oldEmailInput.getText().toString().trim();
            String newEmail = newEmailInput.getText().toString().trim();

            String validation = validateEmails(oldEmail, newEmail);
            if (!TextUtils.isEmpty(validation)) {
                errMsg.setText(validation);
                return;
            }

            v.setEnabled(false);
            new Thread(() -> {
                try {
                    currentUser.setEmail(newEmail);
                    UsersAPI.updateUser(currentUser);
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Correo actualizado", Toast.LENGTH_SHORT).show();
                        oldEmailInput.setText("");
                        newEmailInput.setText("");
                    });
                } catch (Exception e) {
                    runOnUiThread(() -> errMsg.setText("Error al actualizar: " + e.getMessage()));
                } finally {
                    runOnUiThread(() -> v.setEnabled(true));
                }
            }).start();
        });
    }

    private String validateEmails(String oldEmail, String newEmail) {
        if (TextUtils.isEmpty(oldEmail) || TextUtils.isEmpty(newEmail)) {
            return "Completa todos los campos";
        }
        if (!oldEmail.equalsIgnoreCase(currentUser.getEmail())) {
            return "El correo actual no coincide";
        }
        if (newEmail.equalsIgnoreCase(oldEmail)) {
            return "El nuevo correo debe ser diferente";
        }
        return "";
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
                    finish();
                });
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error al eliminar: " + e.getMessage(), Toast.LENGTH_LONG).show());
            } finally {
                runOnUiThread(() -> deleteBtn.setEnabled(true));
            }
        }).start();
    }
}