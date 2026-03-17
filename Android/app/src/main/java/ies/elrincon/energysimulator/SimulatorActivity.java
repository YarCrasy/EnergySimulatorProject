package ies.elrincon.energysimulator;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import ies.elrincon.energysimulator.api.ElementsAPI;
import ies.elrincon.energysimulator.api.ProjectsAPI;
import ies.elrincon.energysimulator.models.EnergyElement;
import ies.elrincon.energysimulator.models.Project;
import ies.elrincon.energysimulator.models.ProjectNode;

public class SimulatorActivity extends AppCompatActivity {
    public static final String EXTRA_PROJECT = "project";

    private Project currentProject;
    private final List<ProjectNode> selectedNodes = new ArrayList<>();
    private final List<EnergyElement> catalogElements = new ArrayList<>();
    private final Object saveLock = new Object();

    private LinearLayout sideMenu;
    private LinearLayout elementsList;
    private LinearLayout selectedElementsList;
    private EditText titleEdit;
    private TextView statusView;
    private TextView emptyStateView;
    private TextView countMetricView;
    private TextView generationMetricView;
    private TextView consumptionMetricView;
    private TextView balanceMetricView;
    private ToggleButton menuToggleBtn;
    private Button saveProjectBtn;

    private volatile boolean isSaving = false;
    private boolean isDirty = false;

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

        bindViews();
        bindProjectFromIntent();
        setupInteractions();
        loadProjectData();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (isDirty) {
            saveProject(false);
        }
    }

    @Override
    public void onBackPressed() {
        returnProjectAndFinish();
    }

    private void bindViews() {
        sideMenu = findViewById(R.id.sideMenu);
        elementsList = findViewById(R.id.elementsList);
        selectedElementsList = findViewById(R.id.selectedElementsList);
        titleEdit = findViewById(R.id.simulatorTitle);
        statusView = findViewById(R.id.simulatorStatus);
        emptyStateView = findViewById(R.id.simulatorEmptyState);
        countMetricView = findViewById(R.id.simulatorMetricCount);
        generationMetricView = findViewById(R.id.simulatorMetricGeneration);
        consumptionMetricView = findViewById(R.id.simulatorMetricConsumption);
        balanceMetricView = findViewById(R.id.simulatorMetricBalance);
        menuToggleBtn = findViewById(R.id.menuToggleBtn);
        saveProjectBtn = findViewById(R.id.saveProjectBtn);
    }

    private void bindProjectFromIntent() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            currentProject = getIntent().getParcelableExtra(EXTRA_PROJECT, Project.class);
        } else {
            currentProject = getIntent().getParcelableExtra(EXTRA_PROJECT);
        }
        if (currentProject == null) {
            currentProject = new Project();
        }
        titleEdit.setText(currentProject.getName());
    }

    private void setupInteractions() {
        Button backBtn = findViewById(R.id.backToProjectsBtn);
        backBtn.setOnClickListener(v -> returnProjectAndFinish());

        saveProjectBtn.setOnClickListener(v -> saveProject(true));

        menuToggleBtn.setOnCheckedChangeListener((buttonView, isChecked) ->
                sideMenu.setVisibility(isChecked ? View.GONE : View.VISIBLE));

        titleEdit.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                currentProject.setName(s.toString());
                isDirty = true;
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    private void loadProjectData() {
        setStatus("Cargando proyecto...");
        new Thread(() -> {
            try {
                List<EnergyElement> fetchedCatalog = ElementsAPI.getAllElements();
                Project detailedProject = currentProject;
                if (currentProject.getId() != null) {
                    detailedProject = ProjectsAPI.getProjectById(currentProject.getId());
                }

                Map<Long, EnergyElement> elementMap = new HashMap<>();
                for (EnergyElement element : fetchedCatalog) {
                    if (element != null && element.getId() != null) {
                        elementMap.put(element.getId(), element);
                    }
                }

                List<ProjectNode> hydratedNodes = new ArrayList<>();
                if (detailedProject.getProjectNodes() != null) {
                    for (ProjectNode node : detailedProject.getProjectNodes()) {
                        if (node == null) {
                            continue;
                        }
                        EnergyElement resolved = node.getElement();
                        if (resolved == null && node.getElementId() != null) {
                            resolved = elementMap.get(node.getElementId());
                        }
                        node.setElement(resolved);
                        hydratedNodes.add(node);
                    }
                }

                Project finalDetailedProject = detailedProject;
                runOnUiThread(() -> {
                    currentProject = finalDetailedProject;
                    catalogElements.clear();
                    catalogElements.addAll(fetchedCatalog);
                    selectedNodes.clear();
                    selectedNodes.addAll(hydratedNodes);
                    titleEdit.setText(currentProject.getName());
                    renderCatalog();
                    renderSelectedNodes();
                    recalculateProjectMetrics();
                    setStatus("Proyecto listo para editar.");
                    isDirty = false;
                });
            } catch (Exception e) {
                runOnUiThread(() -> setStatus("No se pudo cargar el simulador: " + e.getMessage()));
            }
        }).start();
    }

    private void renderCatalog() {
        elementsList.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(this);

        for (EnergyElement element : catalogElements) {
            View card = inflater.inflate(R.layout.view_catalog_element, elementsList, false);
            ((TextView) card.findViewById(R.id.catalogElementType)).setText(element.getElementType());
            ((TextView) card.findViewById(R.id.catalogElementName)).setText(element.getName());
            ((TextView) card.findViewById(R.id.catalogElementPower)).setText(element.getPowerLabel());
            String description = element.getDescription() != null && !element.getDescription().isBlank()
                    ? element.getDescription()
                    : "Pulsa para a\u00f1adir este elemento al proyecto.";
            ((TextView) card.findViewById(R.id.catalogElementDescription)).setText(description);
            card.setOnClickListener(v -> addElementToProject(element));
            elementsList.addView(card);
        }
    }

    private void renderSelectedNodes() {
        selectedElementsList.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(this);

        if (selectedNodes.isEmpty()) {
            emptyStateView.setVisibility(View.VISIBLE);
            return;
        }
        emptyStateView.setVisibility(View.GONE);

        int index = 1;
        for (ProjectNode node : selectedNodes) {
            View card = inflater.inflate(R.layout.view_selected_element, selectedElementsList, false);
            EnergyElement element = node.getElement();
            String type = element != null ? element.getElementType() : "Elemento";
            String name = element != null ? element.getName() : "Elemento sin nombre";
            String power = element != null ? element.getPowerLabel() : "0 W";
            String meta = String.format(Locale.US, "Nodo %d · Posición (%.0f, %.0f)", index, node.getPositionX(), node.getPositionY());

            ((TextView) card.findViewById(R.id.selectedElementType)).setText(type);
            ((TextView) card.findViewById(R.id.selectedElementName)).setText(name);
            ((TextView) card.findViewById(R.id.selectedElementPower)).setText(power);
            ((TextView) card.findViewById(R.id.selectedElementMeta)).setText(meta);

            card.setOnClickListener(v -> showNodeOptions(node));
            selectedElementsList.addView(card);
            index++;
        }
    }

    private void showNodeOptions(ProjectNode node) {
        new AlertDialog.Builder(this)
                .setTitle("Elemento del proyecto")
                .setMessage("Puedes duplicarlo o eliminarlo del escenario actual.")
                .setPositiveButton("Duplicar", (dialog, which) -> duplicateNode(node))
                .setNeutralButton("Eliminar", (dialog, which) -> removeNode(node))
                .setNegativeButton("Cancelar", null)
                .show();
    }

    private void addElementToProject(EnergyElement element) {
        ProjectNode node = new ProjectNode();
        node.setElement(element);
        node.setType(element.getElementType());
        node.setPositionX(180f + (selectedNodes.size() % 4) * 120f);
        node.setPositionY(140f + (selectedNodes.size() / 4) * 90f);
        node.setData(buildNodeData(element));

        selectedNodes.add(node);
        isDirty = true;
        renderSelectedNodes();
        recalculateProjectMetrics();
        setStatus("Elemento añadido al proyecto.");
    }

    private void duplicateNode(ProjectNode source) {
        if (source == null || source.getElement() == null) {
            return;
        }

        ProjectNode duplicated = new ProjectNode();
        duplicated.setElement(source.getElement());
        duplicated.setType(source.getType());
        duplicated.setPositionX(source.getPositionX() + 32f);
        duplicated.setPositionY(source.getPositionY() + 24f);
        duplicated.setData(source.getData());

        selectedNodes.add(duplicated);
        isDirty = true;
        renderSelectedNodes();
        recalculateProjectMetrics();
        setStatus("Elemento duplicado.");
    }

    private void removeNode(ProjectNode node) {
        selectedNodes.remove(node);
        isDirty = true;
        renderSelectedNodes();
        recalculateProjectMetrics();
        setStatus("Elemento eliminado del proyecto.");
    }

    private String buildNodeData(EnergyElement element) {
        try {
            JSONObject data = new JSONObject();
            data.put("label", element.getName());
            if (element.getPowerWatt() != null) {
                data.put("powerWatt", element.getPowerWatt());
            }
            if (element.getPowerConsumption() != null) {
                data.put("powerConsumption", element.getPowerConsumption());
            }
            if (element.getBaseConsumption() != null) {
                data.put("baseConsumption", element.getBaseConsumption());
            }
            if (element.getDescription() != null) {
                data.put("notes", element.getDescription());
            }
            return data.toString();
        } catch (JSONException e) {
            return "";
        }
    }

    private void recalculateProjectMetrics() {
        double generation = 0d;
        double consumption = 0d;

        for (ProjectNode node : selectedNodes) {
            EnergyElement element = node.getElement();
            if (element == null) {
                continue;
            }
            if (element.isGenerator()) {
                generation += element.getNominalPower();
            } else {
                consumption += element.getNominalPower();
            }
        }

        double balance = generation - consumption;
        currentProject.setEnergyNeeded((float) Math.max(consumption - generation, 0d));
        currentProject.setEnergyEnough(!selectedNodes.isEmpty() && balance >= 0d);
        currentProject.setProjectNodes(new ArrayList<>(selectedNodes));

        countMetricView.setText(String.valueOf(selectedNodes.size()));
        generationMetricView.setText(String.format(Locale.US, "%.0f W", generation));
        consumptionMetricView.setText(String.format(Locale.US, "%.0f W", consumption));
        balanceMetricView.setText(String.format(Locale.US, "%.0f W", balance));
    }

    private void saveProject(boolean explicitFeedback) {
        if (currentProject == null || currentProject.getId() == null) {
            if (explicitFeedback) {
                Toast.makeText(this, "El proyecto aún no está persistido", Toast.LENGTH_SHORT).show();
            }
            return;
        }

        synchronized (saveLock) {
            if (isSaving) {
                return;
            }
            isSaving = true;
        }

        recalculateProjectMetrics();
        currentProject.setName(titleEdit.getText().toString().trim().isEmpty()
                ? "Proyecto sin nombre"
                : titleEdit.getText().toString().trim());

        saveProjectBtn.setEnabled(false);
        setStatus("Guardando cambios...");

        new Thread(() -> {
            try {
                Project updated = ProjectsAPI.updateProject(currentProject.getId(), currentProject.toJSON());
                Map<Long, EnergyElement> elementMap = new HashMap<>();
                for (EnergyElement element : catalogElements) {
                    if (element != null && element.getId() != null) {
                        elementMap.put(element.getId(), element);
                    }
                }
                if (updated.getProjectNodes() != null) {
                    for (ProjectNode node : updated.getProjectNodes()) {
                        if (node.getElement() == null && node.getElementId() != null) {
                            node.setElement(elementMap.get(node.getElementId()));
                        }
                    }
                }

                runOnUiThread(() -> {
                    currentProject = updated;
                    selectedNodes.clear();
                    if (updated.getProjectNodes() != null) {
                        selectedNodes.addAll(updated.getProjectNodes());
                    }
                    renderSelectedNodes();
                    recalculateProjectMetrics();
                    setStatus("Proyecto guardado correctamente.");
                    isDirty = false;
                    if (explicitFeedback) {
                        Toast.makeText(this, "Proyecto guardado", Toast.LENGTH_SHORT).show();
                    }
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    setStatus("No se pudo guardar el proyecto: " + e.getMessage());
                    if (explicitFeedback) {
                        Toast.makeText(this, "No se pudo guardar el proyecto", Toast.LENGTH_SHORT).show();
                    }
                });
            } finally {
                runOnUiThread(() -> saveProjectBtn.setEnabled(true));
                synchronized (saveLock) {
                    isSaving = false;
                }
            }
        }).start();
    }

    private void returnProjectAndFinish() {
        if (currentProject == null) {
            setResult(Activity.RESULT_CANCELED);
            finish();
            return;
        }

        recalculateProjectMetrics();
        currentProject.setName(titleEdit.getText().toString().trim());
        currentProject.setProjectNodes(new ArrayList<>(selectedNodes));

        Intent data = new Intent();
        data.putExtra(EXTRA_PROJECT, currentProject);
        setResult(Activity.RESULT_OK, data);
        finish();
    }

    private void setStatus(String message) {
        statusView.setText(message);
    }
}
