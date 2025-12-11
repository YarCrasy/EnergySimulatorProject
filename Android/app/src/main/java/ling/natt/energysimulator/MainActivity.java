package ling.natt.energysimulator;

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

import ling.natt.energysimulator.api.ProjectsAPI;
import ling.natt.energysimulator.api.UsersAPI;
import ling.natt.energysimulator.models.Project;
import ling.natt.energysimulator.models.User;

import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

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
                User user = UsersAPI.register(email, pass);
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
        intent.putExtra("user", user);
        startActivity(intent);
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
