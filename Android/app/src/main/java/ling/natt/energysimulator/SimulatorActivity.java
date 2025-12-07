package ling.natt.energysimulator;

import android.os.Build;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;


import ling.natt.energysimulator.models.Project;

public class SimulatorActivity extends AppCompatActivity {
    public static final String EXTRA_FROM_PROJECTS = "project";
    private Project currentProject;

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

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                currentProject = getIntent().getParcelableExtra(EXTRA_FROM_PROJECTS, Project.class);
            } else {
                currentProject = getIntent().getParcelableExtra(EXTRA_FROM_PROJECTS);
            }

            loadProject();
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Error al cargar el proyecto", Toast.LENGTH_LONG).show();
            finish();
        }
    }

    private void loadProject() {
        TextView titleView = findViewById(R.id.simulatorTitle);
        titleView.setText(currentProject.getName());

    }

}