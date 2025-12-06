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

import ling.natt.energysimulator.api.ApiClient;
import ling.natt.energysimulator.api.ApiService;
import ling.natt.energysimulator.api.LoginRequest;
import ling.natt.energysimulator.models.User;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {

    EditText username;
    EditText password;
    Button loginBtn;
    TextView errorMessage;


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
        String user = username.getText().toString().trim();
        String pass = password.getText().toString().trim();

        // Validación simple
        if (user.isEmpty() || pass.isEmpty()) {
            errorMessage.setText("Por favor, complete todos los campos");
            return;
        }

        // Crear request
        LoginRequest loginRequest = new LoginRequest(user, pass);

        ApiService api = ApiClient.getClient().create(ApiService.class);

        Call<User> call = api.login(loginRequest);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    Intent intent = new Intent(MainActivity.this, ProfileActivity.class);
                    User loggedUser = response.body();
                    assert loggedUser != null;
                    intent.putExtra("user", loggedUser.getId());
                    startActivity(intent);
                } else {
                    errorMessage.setText("Credenciales incorrectas");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                errorMessage.setText(t.getMessage());
            }
        });
    }




}
