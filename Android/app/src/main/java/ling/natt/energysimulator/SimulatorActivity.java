package ling.natt.energysimulator;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import ling.natt.energysimulator.api.ProjectsAPI;
import ling.natt.energysimulator.models.Project;
import ling.natt.energysimulator.models.User;

public class SimulatorActivity extends AppCompatActivity {
    public static final String EXTRA_USER = "user";
    public static final String EXTRA_FROM_PROJECTS = "from_projects";

    private User currentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_simulator);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            currentUser = getIntent().getParcelableExtra(EXTRA_USER, User.class);
        } else {
            currentUser = getIntent().getParcelableExtra(EXTRA_USER);
        }

        EditText projectNameInput = findViewById(R.id.projectNameInput);
        Button createBtn = findViewById(R.id.createProjectSubmit);

        createBtn.setOnClickListener(v -> {
            String name = projectNameInput.getText().toString().trim();
            if (TextUtils.isEmpty(name)) {
                projectNameInput.setError("Nombre requerido");
                return;
            }
            v.setEnabled(false);
            new Thread(() -> {
                try {
                    Project p = new Project(name, currentUser.getId(), null);
                    Project created = ProjectsAPI.createProject(currentUser.getId(), p);
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Proyecto creado", Toast.LENGTH_SHORT).show();
                        Intent result = new Intent();
                        result.putExtra("createdProject", created);
                        setResult(RESULT_OK, result);
                        finish();
                    });
                } catch (Exception e) {
                    runOnUiThread(() -> Toast.makeText(this, "Error al crear: " + e.getMessage(), Toast.LENGTH_LONG).show());
                } finally {
                    runOnUiThread(() -> v.setEnabled(true));
                }
            }).start();
        });
    }
}