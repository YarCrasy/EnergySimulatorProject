package ies.elrincon.energysimulator;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import ies.elrincon.energysimulator.api.ProjectsAPI;
import ies.elrincon.energysimulator.api.UsersAPI;
import ies.elrincon.energysimulator.models.Project;
import ies.elrincon.energysimulator.models.User;

import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    EditText fullName;
    EditText dateOfBirth;
    EditText username;
    EditText password;
    Button loginBtn;
    Button registerBtn;
    TextView errorMessage;
    private final ExecutorService loginExecutor = Executors.newSingleThreadExecutor();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        fullName = findViewById(R.id.fullName);
        dateOfBirth = findViewById(R.id.dateOfBirth);
        username = findViewById(R.id.username);
        password = findViewById(R.id.password);
        loginBtn = findViewById(R.id.login);
        registerBtn = findViewById(R.id.register);
        errorMessage = findViewById(R.id.error);


        loginBtn.setOnClickListener(v -> login());
        registerBtn.setOnClickListener(v -> registerUser());

    }

    void login() {
        String email = username.getText().toString().trim();
        String pass = password.getText().toString().trim();
        if (email.isEmpty() || pass.isEmpty()) {
            errorMessage.setText(R.string.login_missing_credentials);
            return;
        }
        errorMessage.setText("");
        setLoading(true);
        loginExecutor.execute(() -> {
            try {
                User u = UsersAPI.login(email, pass);
                u.setProjects((ArrayList<Project>) ProjectsAPI.getProjectsFromUser(u.getId()));
                runOnUiThread(() -> navigateToProject(u));
            } catch (Exception e) {
                runOnUiThread(() -> {
                    setLoading(false);
                    String message = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
                    errorMessage.setText("Hubo un error, intente de nuevo\n" + message);
                });
            }
        });

    }

    private void registerUser() {
        String name = fullName.getText().toString().trim();
        String birthDate = dateOfBirth.getText().toString().trim();
        String email = username.getText().toString().trim();
        String pass = password.getText().toString().trim();
        String validationError = validateRegistration(name, birthDate, email, pass);
        if (validationError != null) {
            errorMessage.setText(validationError);
            return;
        }
        errorMessage.setText("");
        setLoading(true);
        loginExecutor.execute(() -> {
            try {
                User user = UsersAPI.register(name, birthDate, email, pass);
                user.setProjects((ArrayList<Project>) ProjectsAPI.getProjectsFromUser(user.getId()));
                runOnUiThread(() -> navigateToProject(user));
            } catch (Exception e) {
                runOnUiThread(() -> {
                    setLoading(false);
                    String message = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
                    errorMessage.setText(getString(R.string.register_error, message));
                });
            }
        });
    }

    private void navigateToProject(User user) {
        setLoading(false);
        Intent intent = new Intent(this, ProjectsActivity.class);
        intent.putExtra(ProjectsActivity.EXTRA_USER, user);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    private String validateRegistration(String name, String birthDate, String email, String pass) {
        if (name.isEmpty()) {
            return getString(R.string.full_name_required);
        }
        if (birthDate.isEmpty()) {
            return "Introduce una fecha de nacimiento";
        }
        if (email.isEmpty() || pass.isEmpty()) {
            return getString(R.string.login_missing_credentials);
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            return "Introduce un correo electr\u00f3nico v\u00e1lido";
        }
        boolean strongPassword = pass.length() >= 8
                && pass.matches(".*[A-Z].*")
                && pass.matches(".*[a-z].*")
                && pass.matches(".*\\d.*");
        if (!strongPassword) {
            return "La contrase\u00f1a debe tener 8 caracteres, may\u00fascula, min\u00fascula y n\u00famero";
        }
        return null;
    }

    private void setLoading(boolean loading) {
        loginBtn.setEnabled(!loading);
        if (registerBtn != null) {
            registerBtn.setEnabled(!loading);
        }
    }

    @Override
    protected void onDestroy() {
        loginExecutor.shutdownNow();
        super.onDestroy();
    }
}

