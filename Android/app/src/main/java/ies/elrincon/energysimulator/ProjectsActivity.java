package ies.elrincon.energysimulator;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import android.os.Build;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import ies.elrincon.energysimulator.api.ProjectsAPI;
import ies.elrincon.energysimulator.components.ProjectCardView;
import ies.elrincon.energysimulator.models.Project;
import ies.elrincon.energysimulator.models.User;

public class ProjectsActivity extends AppCompatActivity {
    public static final String EXTRA_USER = "user";
    private GridLayout projectsGrid;
    private User sessionUser;
    private TextView errMsg;
    private ActivityResultLauncher<Intent> projectLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_projects);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        errMsg = findViewById(R.id.projectsActErrMsg);

        Button createBtn = findViewById(R.id.createProjectBtn);
        createBtn.setOnClickListener(v -> createNewProject());

        Button profileBtn = findViewById(R.id.profileBtn);
        profileBtn.setOnClickListener(v -> openProfile());

        Button logoutBtn = findViewById(R.id.backBtn);
        logoutBtn.setOnClickListener(v -> logout());

        registerChangesFromSimulator();
        loadProjects();
    }

    private void renderProjects(List<Project> projects) {
        if (projectsGrid != null) {
            projectsGrid.removeAllViews();
        }
        if (projects == null || projects.isEmpty()) {
            errMsg.setText("No hay proyectos disponibles.");
            return;
        }
        errMsg.setText("");

        for (Project project : projects) {
            setupProjectCard(project);
        }
    }

    private void loadProjects() {
        projectsGrid = findViewById(R.id.projectsGrid);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            sessionUser = getIntent().getParcelableExtra(EXTRA_USER, User.class);
        } else {
            sessionUser = getIntent().getParcelableExtra(EXTRA_USER);
        }

        if (sessionUser == null) {
            errMsg.setText("Error al cargar el perfil, intente de nuevo o póngase en contacto con el soporte.");
            return;
        }

        if (sessionUser.getProjects() == null || sessionUser.getProjects().isEmpty()) {
            fetchProjectsFromServer();
        } else {
            renderProjects(sessionUser.getProjects());
        }
    }

    private void fetchProjectsFromServer() {
        errMsg.setText("Cargando proyectos...");
        new Thread(() -> {
            try {
                List<Project> fetched = ProjectsAPI.getProjectsFromUser(sessionUser.getId());
                ArrayList<Project> projects = new ArrayList<>(fetched);
                runOnUiThread(() -> {
                    sessionUser.setProjects(projects);
                    renderProjects(projects);
                });
            } catch (JSONException e) {
                runOnUiThread(() -> errMsg.setText(e.getMessage()));
            } catch (IOException e) {
                runOnUiThread(() -> errMsg.setText("Error de red: " + e.getMessage()));
            }
        }).start();
    }

    private void registerChangesFromSimulator() {
        projectLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result == null) return;
                    if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                        Intent data = result.getData();
                        Project updated;
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                            updated = data.getParcelableExtra(SimulatorActivity.EXTRA_PROJECT, Project.class);
                        } else {
                            updated = data.getParcelableExtra(SimulatorActivity.EXTRA_PROJECT);
                        }
                        if (updated != null && sessionUser.getProjects() != null) {
                            for (int i = 0; i < sessionUser.getProjects().size(); i++) {
                                Project p = sessionUser.getProjects().get(i);
                                if (p.getId() != null && p.getId().equals(updated.getId())) {
                                    p.setName(updated.getName());
                                    p.setUpdatedAt(updated.getUpdatedAt());
                                    //any other fields needed here
                                    break;
                                }
                            }
                            renderProjects(sessionUser.getProjects());
                        }
                    }
                });
    }



    private void setupProjectCard(Project project) {
        ProjectCardView cardView = new ProjectCardView(this, project);
        String updated = project.getUpdatedAt() != null ? project.getUpdatedAt().toString() : "";
        cardView.bind(project.getName(), updated);

        cardView.setProjectCardListener(new ProjectCardView.ProjectCardListener() {
            @Override
            public void onOpenProject(Project p) {
                // Abrir el simulador pasando el proyecto
                Intent intent = new Intent(ProjectsActivity.this, SimulatorActivity.class);
                intent.putExtra(SimulatorActivity.EXTRA_PROJECT, p);
                projectLauncher.launch(intent);
            }

            @Override
            public void onRenameRequested(Project p) {
                setupRenameProject(p);
            }

            @Override
            public void onDeleteRequested(Project p) {
               setupDeleteProject(p);
            }
        });

        if (projectsGrid != null) {
            projectsGrid.addView(cardView);
        }
    }

    private void setupRenameProject(Project p) {
        AlertDialog.Builder builder = new AlertDialog.Builder(ProjectsActivity.this);
        builder.setTitle("Renombrar proyecto");

        final EditText input = new EditText(ProjectsActivity.this);
        input.setText(p.getName());
        input.setSelection(input.getText().length());
        builder.setView(input);

        builder.setPositiveButton("Guardar", (dialog, which) -> {
            String newName = input.getText().toString().trim();
            if (newName.isEmpty()) {
                Toast.makeText(ProjectsActivity.this,
                        "El nombre no puede estar vacío", Toast.LENGTH_SHORT).show();
                return;
            }
            new Thread(() -> {
                try {
                    JSONObject payload = new JSONObject();
                    payload.put("name", newName);
                    Project updated = ProjectsAPI.updateProject(p.getId(), payload);

                    runOnUiThread(() -> {
                        // actualizar en la lista local
                        if (sessionUser != null && sessionUser.getProjects() != null) {
                            for (int i = 0; i < sessionUser.getProjects().size(); i++) {
                                Project proj = sessionUser.getProjects().get(i);
                                if (proj.getId().equals(updated.getId())) {
                                    proj.setName(updated.getName());
                                    proj.setUpdatedAt(updated.getUpdatedAt());
                                    break;
                                }
                            }
                        }
                        renderProjects(sessionUser != null ? sessionUser.getProjects() : null);
                        Toast.makeText(ProjectsActivity.this,
                                "Nombre actualizado", Toast.LENGTH_SHORT).show();
                    });
                } catch (Exception e) {
                    runOnUiThread(() ->
                            Toast.makeText(ProjectsActivity.this,
                                    "Error al actualizar: " + e.getMessage(),
                                    Toast.LENGTH_LONG).show());
                }
            }).start();
        });

        builder.setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.show();
    }
    private void setupDeleteProject(Project p) {
        AlertDialog.Builder builder = new AlertDialog.Builder(ProjectsActivity.this);
        builder.setTitle("Eliminar proyecto");
        builder.setMessage("¿Seguro que desea eliminar el proyecto '" + p.getName() + "'? Esta acción no se puede deshacer.");

        builder.setPositiveButton("Eliminar", (dialog, which) -> {
            new Thread(() -> {
                try {
                    ProjectsAPI.deleteProject(p.getId());
                    // Actualizar UI y lista local
                    runOnUiThread(() -> {
                        if (sessionUser != null && sessionUser.getProjects() != null) {
                            sessionUser.getProjects().removeIf(pr -> pr.getId().equals(p.getId()));
                        }
                        renderProjects(sessionUser != null ? sessionUser.getProjects() : null);
                        Toast.makeText(ProjectsActivity.this,
                                "Proyecto eliminado", Toast.LENGTH_SHORT).show();
                    });
                } catch (Exception e) {
                    runOnUiThread(() -> Toast.makeText(ProjectsActivity.this,
                            "Error al eliminar: " + e.getMessage(), Toast.LENGTH_LONG).show());
                }
            }).start();
        });

        builder.setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.show();
    }

    private void openProfile() {
        if (sessionUser == null) {
            errMsg.setText("Error al cargar el perfil, intente de nuevo o póngase en contacto con el soporte.");
            return;
        }
        Intent intent = new Intent(this, ProfileActivity.class);
        intent.putExtra(ProfileActivity.EXTRA_USER, sessionUser);
        startActivity(intent);
    }

    private void createNewProject() {
        errMsg.setText("");
        Intent intent = new Intent(this, SimulatorActivity.class);
        Project p = new Project();
        if (sessionUser != null) p.setUserId(sessionUser.getId());

        // Asegurar campos obligatorios que el backend espera (ej. name no nulo)
        p.setName("Proyecto nuevo");
        p.setEnergyNeeded(0f);
        p.setEnergyEnough(false);

        // Ejecutar llamadas de red en hilo de fondo
        new Thread(() -> {
            try {
                Project newProject = ProjectsAPI.createProject(p.getUserId(), p);

                if (sessionUser != null) {
                    ArrayList<Project> userProjects = sessionUser.getProjects();
                    if (userProjects == null) {
                        userProjects = new ArrayList<>();
                        sessionUser.setProjects(userProjects);
                    }
                    userProjects.add(newProject);
                }

                runOnUiThread(() -> {
                    intent.putExtra(SimulatorActivity.EXTRA_PROJECT, newProject);
                    renderProjects(sessionUser != null ? sessionUser.getProjects() : null);
                    projectLauncher.launch(intent);
                });
            } catch (JSONException e) {
                runOnUiThread(() -> errMsg.setText(e.getMessage()));
            } catch (IOException e) {
                runOnUiThread(() -> errMsg.setText("Error de red: " + e.getMessage()));
            }
        }).start();
    }

    private void logout() {
        Toast.makeText(this, "Sesion cerrada", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}



