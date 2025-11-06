// THAY THẾ TOÀN BỘ FILE app/build.gradle.kts BẰNG NỘI DUNG NÀY

// Phần import chỉ cần 1 lần ở đầu file (nếu cần)
// import androidx.glance.appwidget.compose // Dòng này có vẻ không cần thiết, có thể xóa

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.google.services)
}

android {
    namespace = "com.example.edumatch_androi"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.edumatch_androi"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = libs.versions.composeCompiler.get()
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

}

dependencies {
    // Thư viện cơ bản và Compose
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.compose.material:material-icons-extended:1.6.8") // Nên dùng phiên bản mới hơn một chút
    // Thêm các thư viện Glance sau
    implementation("androidx.glance:glance-appwidget:1.1.0") // Thay bằng phiên bản mới nhất nếu cần
    implementation("androidx.glance:glance-material3:1.1.0") // Tùy chọn, nếu bạn muốn dùng Material3 cho widget

    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.foundation:foundation-layout-android:1.4.0")

//    implementation("androidx.compose.foundation:foundation-interaction:1.6.8")

    // Thư viện Firebase (dùng BoM và không có đuôi -ktx)
    implementation(platform("com.google.firebase:firebase-bom:33.1.1")) // Nên dùng phiên bản ổn định từ libs.versions.toml
    implementation("com.google.firebase:firebase-auth")
    implementation("com.google.firebase:firebase-database")
    implementation("com.google.firebase:firebase-analytics")

    // Thư viện Test
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}