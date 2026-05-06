package ies.elrincon.energysimulator;

import android.annotation.SuppressLint;
import android.os.Build;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

import ies.elrincon.energysimulator.api.ApiConnection;

public class WebSimulatorActivity extends AppCompatActivity {
    private static final String TAG = "WebSimulator";
    // URLs disponibles
    private static final String LOCAL_WEB_BASE_URL = "http://192.168.1.248:5173";
    private static final String REMOTE_WEB_BASE_URL = "https://dam-project.yarcrasy.com";
    // Usar la URL configurada en build o la local si no está definida
    private String activeWebBaseUrl = BuildConfig.WEB_BASE_URL != null ? BuildConfig.WEB_BASE_URL : LOCAL_WEB_BASE_URL;

    private WebView webView;
    private TextView statusView;
    private Long projectId;
    private String userToken;
    private String userData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_web_simulator);

        webView = findViewById(R.id.webView);
        statusView = findViewById(R.id.statusView);

        // Obtener datos del intent
        if (getIntent().hasExtra("projectId")) projectId = getIntent().getLongExtra("projectId", -1);
        if (getIntent().hasExtra("userToken")) userToken = getIntent().getStringExtra("userToken");
        if (getIntent().hasExtra("userData")) userData = getIntent().getStringExtra("userData");

        setupWebView();
        loadSimulatorWithAuth();
        setupBackNavigation();
        logMessage("Intentando conectar a: " + activeWebBaseUrl);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        // Permitir mixed content (HTTP en emulador)
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Configurar WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                logMessage("Cargado: " + url);
                statusView.setText(getString(R.string.web_status_connected, view.getUrl()));
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (!request.isForMainFrame()) return;

                int errorCode = error.getErrorCode();
                CharSequence description = error.getDescription();
                String errorMsg = "Error " + errorCode + ": " + description;
                logMessage(errorMsg);
                Toast.makeText(WebSimulatorActivity.this, errorMsg, Toast.LENGTH_LONG).show();
                statusView.setText(getString(R.string.web_status_error, description));
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }
        });
    }

    private void loadSimulatorWithAuth() {
        String url = buildSimulatorUrl(activeWebBaseUrl);
        logMessage("Cargando URL: " + url);
        injectAuthAndLoad(url);
    }

    private String buildSimulatorUrl(String baseUrl) {
        if (projectId == null || projectId == -1) {
            return baseUrl + "/projects";
        }
        return baseUrl + "/simulator/" + projectId;
    }

    private void injectAuthAndLoad(String url) {
        runOnUiThread(() -> {
            try {
                statusView.setText("Cargando simulador...");

                // Obtener token
                String token = userToken;
                if (token == null || token.isEmpty()) {
                    token = ApiConnection.getBearerToken();
                }

                // Limpiar cookies anteriores
                CookieManager.getInstance().removeAllCookies(null);
                CookieManager.getInstance().setAcceptCookie(true);
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                    CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
                }

                if (token != null && !token.isEmpty() && userData != null && !userData.isEmpty()) {
                    // Establecer cookie para compatibilidad
                    CookieManager.getInstance().setCookie(activeWebBaseUrl, "auth_token=" + token);
                    CookieManager.getInstance().setCookie(activeWebBaseUrl, "token=" + token);
                    CookieManager.getInstance().flush();

                    // Cargar una página intermedia que inyecte token y usuario en localStorage y luego redirija al simulador
                    String authHtml = "<html><body><script>" +
                            "localStorage.setItem('auth:user', " + JSONObject.quote(userData) + ");" +
                            "localStorage.setItem('auth:token', " + JSONObject.quote(token) + ");" +
                            "window.location.replace('" + url + "');" +
                            "</script></body></html>";
                    webView.loadDataWithBaseURL(activeWebBaseUrl, authHtml, "text/html", "utf-8", null);
                    logMessage("Token y usuario inyectados en localStorage, cargando simulador");
                } else {
                    webView.loadUrl(url);
                    logMessage("Cargando URL sin token o sin userData: " + url);
                }
            } catch (Exception e) {
                logMessage("Error: " + e.getMessage());
                statusView.setText("Error: " + e.getMessage());
            }
        });
    }

    private void logMessage(String message) {
        android.util.Log.d(TAG, message);
        if (statusView != null) runOnUiThread(() -> statusView.append("\n" + message));
    }

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                }
            }
        });
    }
}
