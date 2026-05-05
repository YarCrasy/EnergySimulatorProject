package ies.elrincon.energysimulator;

import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class WebSimulatorActivity extends AppCompatActivity {
    private static final String TAG = "WebSimulator";
    // TODO: Cambiar esta URL cuando subas la página web a producción
    // Para emulador: 10.0.2.2 = localhost del host
    // Para dispositivo físico en LAN: 192.168.1.248 = IP de la máquina Mac
    // Cambiar según tu red: ifconfig | grep "inet " para obtener tu IP
    // Puerto: verificar con npm run dev --host (normalmente 5173)
    private static final String WEB_URL = "http://192.168.1.248:5173";

    private WebView webView;
    private TextView statusView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_web_simulator);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        webView = findViewById(R.id.webView);
        statusView = findViewById(R.id.statusView);
        setupWebView();
        logMessage("Intentando conectar a: " + WEB_URL);
    }

    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        
        // Permitir mixed content (HTTP en emulador)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                logMessage("Cargando: " + url);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                logMessage("Cargado: " + url);
                statusView.setText("Conectado a " + WEB_URL);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                String errorMsg = "Error " + errorCode + ": " + description;
                logMessage(errorMsg);
                Toast.makeText(WebSimulatorActivity.this, errorMsg, Toast.LENGTH_LONG).show();
                statusView.setText("Error: " + description);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        webView.loadUrl(WEB_URL);
    }

    private void logMessage(String message) {
        Log.d(TAG, message);
        if (statusView != null) {
            statusView.append("\n" + message);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
