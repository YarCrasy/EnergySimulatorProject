package ling.natt.energysimulator.components;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;

import ling.natt.energysimulator.R;
import ling.natt.energysimulator.models.Project;

public class ProjectCardView extends CardView {
    private TextView nameView;
    private TextView DateView;
    private Project project;

    @Override
    public void setOnClickListener(@Nullable OnClickListener l) {
        super.setOnClickListener(l);
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
        DateView = findViewById(R.id.projectCardMeta);

    }

    public void bind(CharSequence title, CharSequence meta) {
        nameView.setText(title);
        DateView.setText(meta);
    }
}

