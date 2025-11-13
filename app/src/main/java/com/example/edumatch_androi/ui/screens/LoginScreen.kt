@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
package com.example.edumatch_androi.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch // Import cần thiết cho Coroutines
import com.example.edumatch_androi.ui.components.FooterSectionRegister
import kotlinx.coroutines.NonCancellable.isActive
import com.example.edumatch_androi.ui.components.home.CustomHeaderRow

import kotlinx.coroutines.launch


// Màu sắc được sử dụng trong thiết kế
val EduMatchBlue = Color(0xFF1877F2)
val LightGrayBackground = Color(0xFFFAFAFA)
val BorderGray = Color(0xFFE5E5E5)
val TextGray = Color(0xFF666666)
val DividerGray = Color(0xFFE0E0E0)
val DarkText = Color(0xFF333333)

@Composable
fun LoginScreen(
    onNavigateToRegister: () -> Unit = {},
    onLoginSuccess: () -> Unit = {},
    navController: NavController
) {
    val auth = FirebaseAuth.getInstance()
    var email by remember { mutableStateOf("khuongda1409@gmail.com") }
    var password by remember { mutableStateOf("••••••••") }
    var rememberMe by remember { mutableStateOf(false) }
    var showPassword by remember { mutableStateOf(false) }

    // **THÊM STATE CHO CHỨC NĂNG QUÊN MẬT KHẨU**
    var showForgotPasswordDialog by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()

    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            CustomHeaderRow(
                navController = navController,
                activeScreen = "Sign In", // Màn hình này không có trong navbar nên có thể để tên bất kỳ
                onNavigateToRegister = { navController.navigate("register_route") },
//                onNavigateToRegister = onNavigateToRegister,
                onSignInClicked = {}
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }, // Thêm Snackbar Host để hiển thị thông báo
        containerColor = LightGrayBackground
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .background(LightGrayBackground)
                .verticalScroll(scrollState)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 80.dp),
                contentAlignment = Alignment.Center
            ) {
                Card(
                    modifier = Modifier
                        .width(420.dp)
                        .border(1.dp, BorderGray, RoundedCornerShape(12.dp)),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(0.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(horizontal = 40.dp, vertical = 48.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("Welcome back", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = DarkText)
                        Spacer(Modifier.height(8.dp))
                        Text("Sign in to your EduMatch account", color = TextGray, fontSize = 16.sp)
                        Spacer(Modifier.height(32.dp))

                        // Email Field
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            label = { Text("Email", color = TextGray) },
                            singleLine = true,
                            leadingIcon = { Icon(Icons.Default.MailOutline, null, tint = Color(0xFF999999)) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = EduMatchBlue,
                                unfocusedBorderColor = BorderGray,
                                focusedLabelColor = EduMatchBlue,
                                unfocusedLabelColor = TextGray
                            )
                        )
                        Spacer(Modifier.height(16.dp))

                        // Password Field
                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it },
                            label = { Text("Password", color = TextGray) },
                            singleLine = true,
                            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation('●'),
                            leadingIcon = { Icon(Icons.Default.Lock, null, tint = Color(0xFF999999)) },
                            trailingIcon = {
                                IconButton(onClick = { showPassword = !showPassword }) {
                                    Icon(
                                        if (showPassword) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                        null,
                                        tint = Color(0xFF999999)
                                    )
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = EduMatchBlue,
                                unfocusedBorderColor = BorderGray,
                                focusedLabelColor = EduMatchBlue,
                                unfocusedLabelColor = TextGray
                            )
                        )
                        Spacer(Modifier.height(16.dp))

                        // Remember me + Forgot
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Checkbox(
                                    checked = rememberMe,
                                    onCheckedChange = { rememberMe = it },
                                    colors = CheckboxDefaults.colors(checkedColor = EduMatchBlue)
                                )
                                Text("Remember me", color = TextGray, fontSize = 14.sp)
                            }
                            // **GÁN HÀNH ĐỘNG MỞ DIALOG QUÊN MẬT KHẨU**
                            TextButton(onClick = { showForgotPasswordDialog = true }) {
                                Text("Forgot password?", color = EduMatchBlue, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                            }
                        }

                        Spacer(Modifier.height(24.dp))

                        // Sign In Button (Logic Firebase giữ nguyên)
                        Button(
                            onClick = {
                                // Kiểm tra cơ bản
                                if (email.isBlank() || password.isBlank()) {
                                    coroutineScope.launch {
                                        snackbarHostState.showSnackbar("Vui lòng nhập đầy đủ Email và Mật khẩu.")
                                    }
                                    return@Button
                                }

                                auth.signInWithEmailAndPassword(email, password)
                                    .addOnCompleteListener { task ->
                                        coroutineScope.launch {
                                            if (task.isSuccessful) {
                                                // 1. THÀNH CÔNG: Hiển thị thông báo và chuyển hướng
                                                snackbarHostState.showSnackbar("Đăng nhập thành công! Chuyển hướng...")
                                                onLoginSuccess()
                                            } else {
                                                // 2. THẤT BẠI: Hiển thị lỗi Firebase cụ thể
                                                val errorMessage = task.exception?.localizedMessage ?: "Lỗi đăng nhập không xác định."
                                                snackbarHostState.showSnackbar("Đăng nhập thất bại: $errorMessage")

                                                // In ra Console để dễ debug hơn
                                                println("Login failed: $errorMessage")
                                            }
                                        }
                                    }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = EduMatchBlue)
                        ) {
                            Text("Sign In →", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                        }

                        Spacer(Modifier.height(24.dp))

                        // Sign up link
                        ClickableText(
                            text = buildAnnotatedString {
                                withStyle(SpanStyle(color = TextGray, fontSize = 14.sp)) {
                                    append("Don't have an account? ")
                                }
                                withStyle(SpanStyle(color = EduMatchBlue, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)) {
                                    append("Sign up")
                                }
                            },
                            onClick = { offset ->
                                if (offset >= "Don't have an account? ".length) {
                                    onNavigateToRegister()
                                }
                            }
                        )

                        Spacer(Modifier.height(32.dp))
                        HorizontalDivider(color = BorderGray)
                        Spacer(Modifier.height(24.dp))

                        Text(
                            "Demo accounts (for testing):",
                            color = TextGray,
                            fontSize = 14.sp,
                            modifier = Modifier.fillMaxWidth(),
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(16.dp))
                        DemoAccountsBox()
                    }
                }
            }
//            FooterSection()
            FooterSectionRegister()
        }
    }

    // **HIỂN THỊ DIALOG QUÊN MẬT KHẨU**
    if (showForgotPasswordDialog) {
        ForgotPasswordDialog(
            auth = auth,
            onDismiss = { showForgotPasswordDialog = false },
            onSuccess = { email ->
                showForgotPasswordDialog = false
                coroutineScope.launch {
                    snackbarHostState.showSnackbar("Email đặt lại mật khẩu đã được gửi đến $email")
                }
            },
            onError = { errorMsg ->
                coroutineScope.launch {
                    snackbarHostState.showSnackbar("Lỗi: $errorMsg")
                }
            }
        )
    }
}

// **HÀM COMPOSABLE MỚI CHO DIALOG QUÊN MẬT KHẨU**
@Composable
fun ForgotPasswordDialog(
    auth: FirebaseAuth,
    onDismiss: () -> Unit,
    onSuccess: (String) -> Unit,
    onError: (String) -> Unit
) {
    var email by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Đặt lại mật khẩu") },
        text = {
            Column {
                Text("Vui lòng nhập địa chỉ email bạn đã đăng ký. Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu đến email này.")
                Spacer(Modifier.height(16.dp))
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    singleLine = true,
                    leadingIcon = { Icon(Icons.Default.MailOutline, null) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = EduMatchBlue,
                        unfocusedBorderColor = BorderGray
                    )
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (email.isNotBlank()) {
                        isLoading = true
                        auth.sendPasswordResetEmail(email)
                            .addOnCompleteListener { task ->
                                isLoading = false
                                if (task.isSuccessful) {
                                    onSuccess(email)
                                } else {
                                    onError(task.exception?.localizedMessage ?: "Không thể gửi email đặt lại.")
                                }
                            }
                    } else {
                        onError("Vui lòng nhập email.")
                    }
                },
                enabled = !isLoading
            ) {
                if (isLoading) {
                    // Hiển thị trạng thái loading trong nút
                    CircularProgressIndicator(Modifier.size(24.dp), color = Color.White)
                } else {
                    Text("Gửi liên kết đặt lại")
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Hủy")
            }
        }
    )
}

// --- Giữ nguyên các hàm phụ còn lại (Header, NavbarButton, DemoAccountsBox, Footer) ---

@Composable
fun CustomHeaderRow(onNavigateToRegister: () -> Unit, onSignInClicked: () -> Unit) {
    // ... (Giữ nguyên CustomHeaderRow)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp)
            .shadow(1.dp)
            .background(Color.White)
            .padding(horizontal = 16.dp), // Padding tổng thể
        verticalAlignment = Alignment.CenterVertically
    ) {
        // 1. Logo (Cố định bên trái)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Surface(
                modifier = Modifier.size(32.dp),
                shape = RoundedCornerShape(8.dp),
                color = EduMatchBlue
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text("E", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.width(8.dp))
            Text("EduMatch", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = DarkText)
        }

        // **Thêm khoảng trống linh hoạt, sau đó là Navbar có thể cuộn ngang**
        Spacer(Modifier.width(20.dp)) // Khoảng cách nhỏ giữa Logo và Navbar

        // 2. Navbar Links (Cuộn ngang)
        Row(
            modifier = Modifier
                .weight(1f) // Chiếm phần không gian còn lại
                .horizontalScroll(rememberScrollState()), // Cho phép cuộn ngang
            verticalAlignment = Alignment.CenterVertically
        ) {
            NavbarButton("Home", onClick = {}, isActive = false)
            NavbarButton("About", onClick = {}, isActive = false)
            NavbarButton("Scholarships", onClick = {}, isActive = false)
            NavbarButton("Pricing", onClick = {}, isActive = false)
            NavbarButton("Contact", onClick = {}, isActive = false)

            // Spacer nhỏ sau Contact để cuộn thoải mái hơn
            Spacer(Modifier.width(4.dp))
        }

        // 3. Actions (Cố định bên phải)
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            VerticalDivider(
                modifier = Modifier
                    .height(24.dp)
                    .padding(horizontal = 8.dp),
                color = DividerGray
            )

            TextButton(
                onClick = onSignInClicked,
                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
            ) {
                Text("Sign In", color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Medium)
            }
            Spacer(Modifier.width(4.dp))
            Button(
                onClick = onNavigateToRegister,
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = EduMatchBlue),
                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 8.dp)
            ) {
                Text("Get Started", color = Color.White, fontSize = 14.sp)
            }
        }
    }
}

@Composable
fun NavbarButton(title: String, onClick: () -> Unit = {}, isActive: Boolean) {
    TextButton(
        onClick = onClick, // <<< SỬ DỤNG ONCLICK
        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
    ) {
        Text(
            title,
            color = if (isActive) EduMatchBlue else Color(0xFF555555),
            fontSize = 14.sp,
            fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium
        )
    }
}

@Composable
fun DemoAccountsBox() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        DemoAccountCard("Applicant Account", "student@demo.com", "demo123")
        DemoAccountCard("Provider Account", "provider@demo.com", "demo123")
    }
}

@Composable
fun DemoAccountCard(title: String, email: String, password: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF5F8FF)),
        elevation = CardDefaults.cardElevation(0.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, fontWeight = FontWeight.Bold, color = EduMatchBlue, fontSize = 14.sp)
            Spacer(Modifier.height(4.dp))
            Text("Email: $email", color = TextGray, fontSize = 13.sp)
            Text("Password: $password", color = TextGray, fontSize = 13.sp)
        }
    }
}

//@Composable
//fun FooterSection() {
//    Column(
//        modifier = Modifier
//            .fillMaxWidth()
//            .background(Color.White)
//            .padding(horizontal = 100.dp, vertical = 60.dp)
//    ) {
//        Row(
//            modifier = Modifier.fillMaxWidth(),
//            horizontalArrangement = Arrangement.SpaceBetween,
//            verticalAlignment = Alignment.Top
//        ) {
//            Box(modifier = Modifier.weight(1.5f)) { FooterAbout() }
//            Box(modifier = Modifier.weight(1f)) { FooterColumn("Quick Links", listOf("Home", "About Us", "Browse Scholarships", "Pricing Plans")) }
//            Box(modifier = Modifier.weight(1f)) { FooterColumn("Support", listOf("Contact Us", "Help Center", "FAQ", "Privacy Policy", "Terms of Service")) }
//            Box(modifier = Modifier.weight(1.5f)) {
//                FooterColumn(
//                    "Get in Touch",
//                    listOf("support@edumatch.com", "+1 (555) 123-4567", "123 Education Street", "San Francisco, CA 94105"),
//                    hasIcons = true
//                )
//            }
//        }
//
//        Spacer(Modifier.height(40.dp))
//        HorizontalDivider(color = DividerGray)
//        Spacer(Modifier.height(20.dp))
//
//        Row(
//            modifier = Modifier.fillMaxWidth(),
//            horizontalArrangement = Arrangement.SpaceBetween,
//            verticalAlignment = Alignment.CenterVertically
//        ) {
//            Text("© 2025 EduMatch. All rights reserved.", color = Color(0xFF888888), fontSize = 13.sp)
//            Row {
//                FooterBottomText("Privacy")
//                Spacer(Modifier.width(24.dp))
//                FooterBottomText("Terms")
//                Spacer(Modifier.width(24.dp))
//                FooterBottomText("Contact")
//            }
//        }
//    }
//}
//
//@Composable
//fun FooterBottomText(text: String) {
//    Text(text, color = Color(0xFF888888), fontSize = 13.sp)
//}
//
//@Composable
//fun FooterAbout() {
//    Column {
//        Row(verticalAlignment = Alignment.CenterVertically) {
//            Surface(Modifier.size(32.dp), shape = RoundedCornerShape(8.dp), color = EduMatchBlue) {
//                Box(contentAlignment = Alignment.Center) {
//                    Text("E", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
//                }
//            }
//            Spacer(Modifier.width(8.dp))
//            Text("EduMatch", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = DarkText)
//        }
//        Spacer(Modifier.height(12.dp))
//        Text(
//            "Connecting students with scholarship opportunities and providers with qualified candidates. Making education accessible for everyone.",
//            color = TextGray,
//            fontSize = 14.sp,
//            lineHeight = 20.sp
//        )
//        Spacer(Modifier.height(16.dp))
//        // Thêm Social Icons
//        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
//            Icon(Icons.Default.Share, contentDescription = "Twitter", modifier = Modifier.size(18.dp), tint = TextGray)
//            Icon(Icons.Default.ThumbUp, contentDescription = "Facebook", modifier = Modifier.size(18.dp), tint = TextGray)
//            Icon(Icons.Default.CameraAlt, contentDescription = "Instagram", modifier = Modifier.size(18.dp), tint = TextGray)
//            Icon(Icons.Default.Business, contentDescription = "LinkedIn", modifier = Modifier.size(18.dp), tint = TextGray)
//        }
//    }
//}
//
//@Composable
//fun FooterColumn(title: String, items: List<String>, hasIcons: Boolean = false) {
//    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
//        Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = DarkText)
//        items.forEachIndexed { index, item ->
//            Row(verticalAlignment = Alignment.CenterVertically) {
//                if (hasIcons) {
//                    val icon = when (index) {
//                        0 -> Icons.Default.MailOutline
//                        1 -> Icons.Default.Phone
//                        else -> Icons.Default.LocationOn
//                    }
//                    Icon(icon, null, tint = TextGray, modifier = Modifier.size(16.dp))
//                    Spacer(Modifier.width(8.dp))
//                }
//                Text(item, color = TextGray, fontSize = 14.sp)
//            }
//        }
//    }
//}
