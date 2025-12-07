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

import ling.natt.energysimulator.api.UsersAPI;
import ling.natt.energysimulator.models.User;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    EditText username;
    EditText password;
    Button loginBtn;
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
        errorMessage = findViewById(R.id.error);


        loginBtn.setOnClickListener(v -> login());

    }

    void login() {
        String email = username.getText().toString().trim();
        String pass = password.getText().toString().trim();
        if (email.isEmpty() || pass.isEmpty()) {
            errorMessage.setText("Por favor, ingrese un usuario y contraseña");
            return;
        }
        errorMessage.setText("");
        setLoading(true);
        loginExecutor.execute(() -> {
            try {
                User u = UsersAPI.login(email, pass);
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

    private void navigateToProject(User user) {
        setLoading(false);
        Intent intent = new Intent(this, ProjectsActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    private void setLoading(boolean loading) {
        loginBtn.setEnabled(!loading);
    }

    @Override
    protected void onDestroy() {
        loginExecutor.shutdownNow();
        super.onDestroy();
    }
}
