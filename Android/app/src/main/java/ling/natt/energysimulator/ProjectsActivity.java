package ling.natt.energysimulator;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.GridLayout;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.util.List;

import ling.natt.energysimulator.components.ProjectCardView;
import ling.natt.energysimulator.models.Project;
import ling.natt.energysimulator.models.User;

public class ProjectsActivity extends AppCompatActivity {

    private GridLayout projectsGrid;
    private User sessionUser;

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
        projectsGrid = findViewById(R.id.projectsGrid);
        if (sessionUser == null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                sessionUser = getIntent().getParcelableExtra("user", User.class);
            } else {
                sessionUser = getIntent().getParcelableExtra("user");
            }
        }

        Button createBtn = findViewById(R.id.createProjectBtn);
        createBtn.setOnClickListener(v -> openSimulator());
        Button profileBtn = findViewById(R.id.profileBtn);
        profileBtn.setOnClickListener(v -> openProfile());

        Button logoutBtn = findViewById(R.id.backBtn);
        logoutBtn.setOnClickListener(v -> logout());
    }

    private void renderProjects(List<Project> projects) {
        if (projectsGrid == null || projects == null) return;
        projectsGrid.removeAllViews();
        for (Project project : projects) {

        }
    }

    private void openProfile() {
        if (sessionUser == null) return;
        Intent intent = new Intent(this, ProfileActivity.class);
        intent.putExtra("user", sessionUser);
        startActivity(intent);
    }

    private void openSimulator() {
        Intent intent = new Intent(this, SimulatorActivity.class);
        if (sessionUser != null) intent.putExtra("user", sessionUser);
        startActivity(intent);
    }

    private void logout() {
        setResult(Activity.RESULT_OK);
        finish();
    }
}