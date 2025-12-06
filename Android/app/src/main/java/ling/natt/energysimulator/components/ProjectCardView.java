package ling.natt.energysimulator.components;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.cardview.widget.CardView;

import ling.natt.energysimulator.R;

public class ProjectCardView extends CardView {
    private TextView titleView;
    private TextView subtitleView;
    private TextView metaView;
    private Button profileBtn;
    private Button simulatorBtn;

    public ProjectCardView(Context context) {
        super(context);
        init(context);
    }

    public ProjectCardView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public ProjectCardView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    private void init(Context context) {
        LayoutInflater.from(context).inflate(R.layout.view_project_card, this, true);
        float radius = getResources().getDisplayMetrics().density * 12f;
        setUseCompatPadding(true);
        setRadius(radius);
        setCardElevation(radius / 3f);

        titleView = findViewById(R.id.projectCardTitle);
        subtitleView = findViewById(R.id.projectCardSubtitle);
        metaView = findViewById(R.id.projectCardMeta);
        profileBtn = findViewById(R.id.projectCardProfileBtn);
        simulatorBtn = findViewById(R.id.projectCardSimulatorBtn);
    }

    public void bind(CharSequence title,
                     CharSequence subtitle,
                     CharSequence meta,
                     View.OnClickListener profileListener,
                     View.OnClickListener simulatorListener) {
        titleView.setText(title);
        subtitleView.setText(subtitle);
        metaView.setText(meta);
        profileBtn.setOnClickListener(profileListener);
        simulatorBtn.setOnClickListener(simulatorListener);
    }
}

