package ies.elrincon.energysimulator.components;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.widget.PopupMenu;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;

import ies.elrincon.energysimulator.R;
import ies.elrincon.energysimulator.models.Project;

public class ProjectCardView extends CardView {
    private TextView nameView;
    private TextView dateView;
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

        // Asegurar que la CardView reciba los clicks (si los hijos los consumen)
        setClickable(true);
        setFocusable(true);
        setLongClickable(true);

        // click corto: abrir simulador (se delega al listener)
        setOnClickListener(v -> {
            if (listener != null && project != null) {
                listener.onOpenProject(project);
            }
        });

        // pulsación larga: mostrar menú de opciones
        setOnLongClickListener(v -> {
            if (project == null) return true;
            PopupMenu popup = new PopupMenu(getContext(), ProjectCardView.this);
            popup.getMenu().add(0, 1, 0, "Cambiar nombre");
            popup.getMenu().add(0, 2, 1, "Eliminar");
            popup.setOnMenuItemClickListener(item -> {
                if (listener == null) return true;
                int id = item.getItemId();
                if (id == 1) {
                    listener.onRenameRequested(project);
                } else if (id == 2) {
                    listener.onDeleteRequested(project);
                }
                return true;
            });
            popup.show();
            return true;
        });
    }

    public void bind(CharSequence title, CharSequence meta) {
        if (nameView != null) nameView.setText(title);
        if (dateView != null) dateView.setText(meta);
    }

    public void setProject(Project p) {
        this.project = p;
    }

    public void setProjectCardListener(ProjectCardListener l) {
        this.listener = l;
    }

    public interface ProjectCardListener {
        void onOpenProject(Project project);
        void onRenameRequested(Project project);
        void onDeleteRequested(Project project);
    }
}

