package ling.natt.energysimulator;

import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import ling.natt.energysimulator.models.User;

public class ProfileActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_profile);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.profileActivity), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        User user;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            user = getIntent().getParcelableExtra("user", User.class);
        } else {
            user = getIntent().getParcelableExtra("user");
        }
        if (user != null) populateProfile(user);
    }

    private void populateProfile(User user) {
        TextView name = findViewById(R.id.profileName);
        TextView birthday = findViewById(R.id.profileBirthday);
        TextView userType = findViewById(R.id.profileUserType);
        EditText oldEmail = findViewById(R.id.oldEmail);

        name.setText(user.getFullName());
        birthday.setText(user.getDateOfBirth());
        userType.setText(user.isAdmin() ? "Administrador" : "Usuario");
        oldEmail.setText(user.getEmail());
    }
}