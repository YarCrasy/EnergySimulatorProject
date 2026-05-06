package ies.elrincon.energysimulator;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.io.IOException;

import ies.elrincon.energysimulator.api.ApiConnection;
import ies.elrincon.energysimulator.api.ProjectsAPI;
import ies.elrincon.energysimulator.models.Project;
import ies.elrincon.energysimulator.models.User;

public class ProjectDetailActivity extends AppCompatActivity {
    public static final String EXTRA_PROJECT = "project";
    public static final String EXTRA_USER = "user";
    public static final String EXTRA_DELETED_PROJECT_ID = "deletedProjectId";

    private Project project;
    private User sessionUser;
    private TextView titleView;
    private TextView statusView;
    private TextView updatedView;
    private TextView demandView;
    private TextView descriptionView;
    private TextView errorView;
    private Button openBtn;
    private Button deleteBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_project_detail);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.projectDetailRoot), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        titleView = findViewById(R.id.projectDetailTitle);
        statusView = findViewById(R.id.projectDetailStatus);
        updatedView = findViewById(R.id.projectDetailUpdated);
        demandView = findViewById(R.id.projectDetailDemand);
        descriptionView = findViewById(R.id.projectDetailDescription);
        errorView = findViewById(R.id.projectDetailError);
        openBtn = findViewById(R.id.projectDetailOpenBtn);
        deleteBtn = findViewById(R.id.projectDetailDeleteBtn);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            project = getIntent().getParcelableExtra(EXTRA_PROJECT, Project.class);
            sessionUser = getIntent().getParcelableExtra(EXTRA_USER, User.class);
        } else {
            project = getIntent().getParcelableExtra(EXTRA_PROJECT);
            sessionUser = getIntent().getParcelableExtra(EXTRA_USER);
        }

        if (project == null || sessionUser == null) {
            finish();
            return;
        }

        ApiConnection.setBearerToken(sessionUser.getAuthToken());
        bindProject();

        openBtn.setOnClickListener(v -> openSimulator());
        deleteBtn.setOnClickListener(v -> confirmDelete());
    }

    private void bindProject() {
        titleView.setText(project.getName());
        statusView.setText(project.isEnergyEnough() ? "Balanceado" : "Pendiente");
        String updated = project.getUpdatedAt() != null ? project.getUpdatedAt().toString() : "Sin registro";
        updatedView.setText("Actualizado: " + updated);
        demandView.setText(String.format(java.util.Locale.US, "Demanda: %.1f kWh", project.getEnergyNeeded()));
        descriptionView.setText("Revisa los datos y abre el simulador para continuar con el proyecto.");
    }

    private void openSimulator() {
        Intent intent = new Intent(this, SimulatorActivity.class);
        intent.putExtra(SimulatorActivity.EXTRA_PROJECT, project);
        startActivity(intent);
    }

    private void confirmDelete() {
        new AlertDialog.Builder(this)
                .setTitle("Eliminar proyecto")
                .setMessage("¿Seguro que deseas eliminar el proyecto '" + project.getName() + "'?")
                .setPositiveButton("Eliminar", (dialog, which) -> deleteProject())
                .setNegativeButton("Cancelar", null)
                .show();
    }

    private void deleteProject() {
        errorView.setText("");
        new Thread(() -> {
            try {
                ProjectsAPI.deleteProject(project.getId());
                runOnUiThread(() -> {
                    Intent result = new Intent();
                    result.putExtra(EXTRA_DELETED_PROJECT_ID, String.valueOf(project.getId()));
                    setResult(RESULT_OK, result);
                    finish();
                });
            } catch (Exception e) {
                runOnUiThread(() -> errorView.setText("No se pudo eliminar el proyecto: " + e.getMessage()));
            }
        }).start();
    }
}
