package ies.elrincon.energysimulator.components;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;

import ies.elrincon.energysimulator.R;
import ies.elrincon.energysimulator.models.Project;

public class ProjectCardView extends CardView {
    private TextView nameView;
    private TextView dateView;
    private TextView pillView;
    private TextView descriptionView;
    private Button openButton;
    private Button deleteButton;
    private Project project;
    private ProjectCardListener listener;

    public ProjectCardView(Context context) {
        super(context);
        init(context);
    }

    public ProjectCardView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public ProjectCardView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    public ProjectCardView(Context context, Project p) {
        super(context);
        init(context);
        project = p;
    }

    private void init(Context context) {
        LayoutInflater.from(context).inflate(R.layout.view_project_card, this, true);
        float radius = getResources().getDisplayMetrics().density * 12f;
        setUseCompatPadding(true);
        setRadius(radius);
        setCardElevation(radius / 3f);

        nameView = findViewById(R.id.projectCardTitle);
        dateView = findViewById(R.id.projectCardUpdatedAt);
        pillView = findViewById(R.id.projectCardPill);
        descriptionView = findViewById(R.id.projectCardDescription);
        openButton = findViewById(R.id.projectCardOpenBtn);
        deleteButton = findViewById(R.id.projectCardDeleteBtn);
        setLayoutParams(new ViewGroup.MarginLayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        // Asegurar que la CardView reciba los clicks (si los hijos los consumen)
        setClickable(true);
        setFocusable(true);

        setOnClickListener(v -> {
            if (listener != null && project != null) {
                listener.onViewProject(project);
            }
        });

        if (openButton != null) {
            openButton.setOnClickListener(v -> {
                if (listener != null && project != null) {
                    listener.onOpenProject(project);
                }
            });
        }
        if (deleteButton != null) {
            deleteButton.setOnClickListener(v -> {
                if (listener != null && project != null) {
                    listener.onDeleteRequested(project);
                }
            });
        }

        // no long press menu: use visible action buttons instead
    }

    public void bind(CharSequence title, CharSequence meta) {
        if (nameView != null) nameView.setText(title);
        if (dateView != null) dateView.setText(meta);
        if (pillView != null) {
            boolean balanced = project != null && project.isEnergyEnough();
            pillView.setText(balanced ? "Balanceado" : "Pendiente");
        }
        if (descriptionView != null) {
            double demand = project != null ? project.getEnergyNeeded() : 0d;
            descriptionView.setText(String.format(java.util.Locale.US,
                    "Demanda pendiente %.1f kWh. Pulsa para ver detalles y abrir el simulador.",
                    demand));
        }
    }

    public void setProject(Project p) {
        this.project = p;
    }

    public void setProjectCardListener(ProjectCardListener l) {
        this.listener = l;
    }

    public interface ProjectCardListener {
        void onViewProject(Project project);
        void onOpenProject(Project project);
        void onDeleteRequested(Project project);
    }
}

