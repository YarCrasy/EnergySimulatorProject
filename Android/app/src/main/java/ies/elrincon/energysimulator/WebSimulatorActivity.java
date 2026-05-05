package ies.elrincon.energysimulator;

import android.annotation.SuppressLint;
import android.os.Build;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import ies.elrincon.energysimulator.api.ApiConnection;

public class WebSimulatorActivity extends AppCompatActivity {
    private static final String TAG = "WebSimulator";
    // URL base de tu web desplegada (cambiar según entorno)
    private static final String WEB_BASE_URL = BuildConfig.WEB_BASE_URL != null
            ? BuildConfig.WEB_BASE_URL
            : "http://192.168.1.248:5173";  // IP para desarrollo local

    private WebView webView;
    private TextView statusView;
    private Long projectId;
    private String userToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_web_simulator);

        webView = findViewById(R.id.webView);
        statusView = findViewById(R.id.statusView);

        // Obtener datos del intent
        if (getIntent().hasExtra("projectId")) {
            projectId = getIntent().getLongExtra("projectId", -1);
        }
        if (getIntent().hasExtra("userToken")) {
            userToken = getIntent().getStringExtra("userToken");
        }

        setupWebView();
        loadSimulatorWithAuth();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        // Permitir mixed content
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Configurar WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                statusView.setText("Conectado al simulador");
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                statusView.setText("Error: " + description);
                Toast.makeText(WebSimulatorActivity.this, "Error de conexión: " + description, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void loadSimulatorWithAuth() {
        if (projectId == null || projectId == -1) {
            // Si no hay projectId, ir al dashboard de proyectos web
            String url = WEB_BASE_URL + "/projects";
            injectAuthAndLoad(url);
        } else {
            // Ir directamente al simulador con el proyecto
            String url = WEB_BASE_URL + "/simulator/" + projectId;
            injectAuthAndLoad(url);
        }
    }

    private void injectAuthAndLoad(String url) {
        statusView.setText("Cargando simulador...");

        // Limpiar cookies anteriores
        CookieManager.getInstance().removeAllCookies(null);

        // Si tenemos token, lo inyectamos en localStorage y cookies
        if (userToken != null && !userToken.isEmpty()) {
            // Método 1: Inyectar token en localStorage vía JavaScript
            String jsCode = "javascript:(function() {" +
                    "localStorage.setItem('auth:token', '" + userToken + "');" +
                    "localStorage.setItem('auth:user', JSON.stringify({token: '" + userToken + "'}));" +
                    "console.log('Token inyectado en localStorage');" +
                    "})()";

            // Método 2: También establecer cookie para compatibilidad
            CookieManager.getInstance().setCookie(WEB_BASE_URL, "auth_token=" + userToken);
            CookieManager.getInstance().setCookie(WEB_BASE_URL, "token=" + userToken);
            CookieManager.getInstance().flush();

            // Cargar URL y luego inyectar JS
            webView.loadUrl(url);
            webView.evaluateJavascript(jsCode, null);

            logMessage("Token inyectado en WebView");
        } else {
            // Si no hay token, intentar obtener de ApiConnection
            String token = ApiConnection.getBearerToken();
            if (token != null && !token.isEmpty()) {
                String jsCode = "javascript:(function() {" +
                        "localStorage.setItem('auth:token', '" + token + "');" +
                        "localStorage.setItem('auth:user', JSON.stringify({token: '" + token + "'}));" +
                        "})()";
                webView.loadUrl(url);
                webView.evaluateJavascript(jsCode, null);
                CookieManager.getInstance().setCookie(WEB_BASE_URL, "auth_token=" + token);
                CookieManager.getInstance().flush();
                logMessage("Token desde ApiConnection inyectado");
            } else {
                webView.loadUrl(url);
            }
        }
    }

    private void logMessage(String message) {
        android.util.Log.d(TAG, message);
        if (statusView != null) {
            runOnUiThread(() -> statusView.append("\n" + message));
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