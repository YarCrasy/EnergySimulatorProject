package ling.natt.energysimulator;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.widget.Button;
import android.widget.GridLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.json.JSONException;

import java.io.IOException;

import ling.natt.energysimulator.api.ProjectsAPI;
import ling.natt.energysimulator.api.UsersAPI;
import ling.natt.energysimulator.components.ProjectCardView;
import ling.natt.energysimulator.models.Project;
import ling.natt.energysimulator.models.User;

public class ProjectsActivity extends AppCompatActivity {
    private GridLayout projectsGrid;
    private User sessionUser;
    private TextView errMsg;

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

        loadProjects();

    }

    private void loadProjects() {
        projectsGrid = findViewById(R.id.projectsGrid);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            sessionUser = getIntent().getParcelableExtra("user", User.class);
        } else {
            sessionUser = getIntent().getParcelableExtra("user");
        }

        if (sessionUser == null) {
            errMsg.setText("Error al cargar el perfil, intente de nuevo o póngase en contacto con el soporte.");
            return;
        }

        if (sessionUser.getProjects() != null) {
            for (Project project : sessionUser.getProjects()) {
                ProjectCardView cardView = new ProjectCardView(this, project);
                String updated = project.getUpdatedAt() != null ? project.getUpdatedAt().toString() : "";
                cardView.bind(project.getName(), updated);
                if (projectsGrid != null) projectsGrid.addView(cardView);
            }
        }
    }

    private void openProfile() {
        if (sessionUser == null) {
            errMsg.setText("Error al cargar el perfil, intente de nuevo o póngase en contacto con el soporte.");
            return;
        }
        Intent intent = new Intent(this, ProfileActivity.class);
        intent.putExtra("user", sessionUser);
        startActivity(intent);
    }

    private void createNewProject() {
        errMsg.setText("");
        Intent intent = new Intent(this, SimulatorActivity.class);
        Project p = new Project();
        if (sessionUser != null) p.setUserId(sessionUser.getId());

        try {
            ProjectsAPI.createProject(p.getUserId(), p);
        } catch (JSONException e) {
            errMsg.setText(e.getMessage());
            return;
        } catch (IOException e) {
            errMsg.setText("Error de red: " + e.getMessage());
            return;
        }

        if (sessionUser != null) {
            if (sessionUser.getProjects() != null) sessionUser.getProjects().add(p);
        }

        try {
            UsersAPI.updateUser(sessionUser);
        } catch (JSONException e) {
            errMsg.setText(e.getMessage());
            return;
        } catch (IOException e) {
            errMsg.setText("Error de red: " + e.getMessage());
            return;
        }

        intent.putExtra("project", p);
        startActivity(intent);
    }

    private void logout() {
        setResult(Activity.RESULT_OK);
        Toast.makeText(this, "Sesión cerrada", Toast.LENGTH_SHORT).show();
        finish();
    }
}