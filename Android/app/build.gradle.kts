plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "ies.elrincon.energysimulator"
    compileSdk = 34

    defaultConfig {
        applicationId = "ies.elrincon.energysimulator"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        // Use the host machine IP on the local network so physical devices can reach the backend.
        buildConfigField("String", "BACKEND_BASE_URL", "\"http://192.168.1.248:8080/api/\"")
    }

    buildFeatures {
        buildConfig = true
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            buildConfigField("String", "BACKEND_BASE_URL", "\"https://dam.yarcrasy.com/api/\"")
            buildConfigField("String", "WEB_BASE_URL", "\"https://dam-project.yarcrasy.com\"")
        }
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}
