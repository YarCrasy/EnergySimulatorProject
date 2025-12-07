package ling.natt.energysimulator;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
//import android.util.Log;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import ling.natt.energysimulator.api.ProjectsAPI;
import ling.natt.energysimulator.models.Project;

public class SimulatorActivity extends AppCompatActivity {
    public static final String EXTRA_FROM_PROJECTS = "project";
    private Project currentProject;

    private static final String TAG = "SimulatorActivity";

    Button backBtn;
    private android.widget.EditText titleEdit;
    private volatile boolean isSaving = false;
    private final Object saveLock = new Object();

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

        backBtn = findViewById(R.id.backToProjectsBtn);
        backBtn.setOnClickListener(v -> returnProjectAndFinish());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            currentProject = getIntent().getParcelableExtra(EXTRA_FROM_PROJECTS, Project.class);
        } else {
            currentProject = getIntent().getParcelableExtra(EXTRA_FROM_PROJECTS);
        }
        loadProject();
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Guarda siempre al pausar la activity (incluye el cierre de la activity)
        saveProject();
    }

    private void returnProjectAndFinish() {
        String latest = titleEdit.getText().toString();
        currentProject.setName(latest);

        if (currentProject == null) {
            setResult(Activity.RESULT_CANCELED);
        } else {
            Intent data = new Intent();
            data.putExtra("project", currentProject);
            setResult(Activity.RESULT_OK, data);
        }
        finish();
    }

    private void saveProject() {
        if (currentProject == null) return;
        Long projectId = currentProject.getId();
        if (projectId == null) {
            //Log.d(TAG, "saveProject: project not persisted yet (id null), skipping server save");
            return;
        }

        synchronized (saveLock) {
            if (isSaving) {
                //Log.d(TAG, "saveProject: save already in progress, skipping");
                return;
            }
            isSaving = true;
        }

        new Thread(() -> {
            try {
                org.json.JSONObject payload = new org.json.JSONObject();
                payload.put("name", currentProject.getName());
                Project updated = ProjectsAPI.updateProject(projectId, payload);

                currentProject.setName(updated.getName());
                currentProject.setUpdatedAt(updated.getUpdatedAt());
                //Log.d(TAG, "saveProject: saved and updated local project from server");
            } catch (Exception e) {
                //Log.w(TAG, "saveProject: failed to save project: " + e.getMessage());
                runOnUiThread(() ->
                        Toast.makeText(
                                SimulatorActivity.this,
                                "No se pudo guardar el proyecto",
                                Toast.LENGTH_SHORT).show());
            } finally {
                synchronized (saveLock) { isSaving = false; }
            }
        }).start();
    }

    private void loadProject() {
        titleEdit = findViewById(R.id.simulatorTitle);
        if (currentProject != null) titleEdit.setText(currentProject.getName());

        titleEdit.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (currentProject != null) currentProject.setName(s.toString());
            }

            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });

    }

}