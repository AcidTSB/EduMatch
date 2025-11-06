@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
package com.example.edumatch_androi.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.ClickableText
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.PersonSearch
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
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserProfileChangeRequest
import kotlinx.coroutines.launch
import com.example.edumatch_androi.ui.components.FooterSectionRegister

// Màu sắc được sử dụng trong thiết kế (ĐÃ ĐỔI TÊN ĐỂ TRÁNH XUNG ĐỘT)
val RegEduMatchBlue = Color(0xFF1877F2)
val RegLightGrayBackground = Color(0xFFFAFAFA)
val RegBorderGray = Color(0xFFE5E5E5)
val RegTextGray = Color(0xFF666666)
val RegDividerGray = Color(0xFFE0E0E0)
val RegDarkText = Color(0xFF333333)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    onNavigateBack: () -> Unit = {}
) {
    val auth = FirebaseAuth.getInstance()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    val roles = listOf("Student", "Provider")
    var role by remember { mutableStateOf(roles[0]) }
    var roleExpanded by remember { mutableStateOf(false) }

    var agree by remember { mutableStateOf(false) }
    var showPassword by remember { mutableStateOf(false) }
    var showConfirmPassword by remember { mutableStateOf(false) }

    // Logic để xác định nút có được kích hoạt hay không
    val isFormValid = name.isNotBlank() &&
            email.isNotBlank() &&
            password.length >= 6 &&
            password == confirmPassword &&
            agree

    Scaffold(
        // SỬ DỤNG HEADER CHUNG CỦA LOGIN (CustomHeaderRow phải chấp nhận 2 tham số)
        topBar = { CustomHeaderRow(onNavigateToRegister = {}, onSignInClicked = onNavigateBack) },
        snackbarHost = { SnackbarHost(snackbarHostState) },
        containerColor = RegLightGrayBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(padding)
        ) {
            Spacer(Modifier.height(60.dp))

            // FORM CARD
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Card(
                    modifier = Modifier
                        .width(420.dp)
                        .border(1.dp, RegBorderGray, RoundedCornerShape(12.dp)),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(vertical = 48.dp, horizontal = 40.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("Create account", fontWeight = FontWeight.ExtraBold, fontSize = 28.sp, color = RegDarkText)
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "Join EduMatch to find scholarship opportunities",
                            fontSize = 16.sp,
                            color = RegTextGray
                        )
                        Spacer(Modifier.height(32.dp))

                        InputFieldRegister("Full name", Icons.Outlined.Person, value = name, onValueChange = { name = it })
                        Spacer(Modifier.height(16.dp))

                        InputFieldRegister("Email address", Icons.Outlined.Email, value = email, onValueChange = { email = it })
                        Spacer(Modifier.height(16.dp))

                        // DROPDOWN
                        ExposedDropdownMenuBox(
                            expanded = roleExpanded,
                            onExpandedChange = { roleExpanded = !roleExpanded },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            OutlinedTextField(
                                value = role,
                                onValueChange = {},
                                readOnly = true,
                                leadingIcon = { Icon(Icons.Outlined.PersonSearch, contentDescription = null, tint = Color(0xFF999999)) },
                                trailingIcon = {
                                    Icon(
                                        if (roleExpanded) Icons.Filled.KeyboardArrowUp else Icons.Filled.ArrowDropDown,
                                        contentDescription = "Dropdown arrow",
                                        Modifier.clickable { roleExpanded = !roleExpanded }
                                    )
                                },
                                label = { Text("I am a...", color = RegTextGray) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .menuAnchor(),
                                shape = RoundedCornerShape(8.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = RegEduMatchBlue,
                                    unfocusedBorderColor = RegBorderGray,
                                    focusedLabelColor = RegEduMatchBlue,
                                    unfocusedLabelColor = RegTextGray
                                )
                            )
                            ExposedDropdownMenu(
                                expanded = roleExpanded,
                                onDismissRequest = { roleExpanded = false }
                            ) {
                                roles.forEach { selectionOption ->
                                    DropdownMenuItem(
                                        text = { Text(selectionOption, color = RegDarkText) },
                                        onClick = {
                                            role = selectionOption
                                            roleExpanded = false
                                        },
                                        contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                                    )
                                }
                            }
                        }

                        Spacer(Modifier.height(16.dp))

                        // PASSWORD
                        InputFieldRegister(
                            "Password",
                            Icons.Outlined.Lock,
                            value = password,
                            onValueChange = { password = it },
                            isPassword = true,
                            showPassword = showPassword,
                            onTogglePassword = { showPassword = !showPassword }
                        )
                        Spacer(Modifier.height(16.dp))

                        // CONFIRM PASSWORD
                        InputFieldRegister(
                            "Confirm password",
                            Icons.Outlined.Lock,
                            value = confirmPassword,
                            onValueChange = { confirmPassword = it },
                            isPassword = true,
                            showPassword = showConfirmPassword,
                            onTogglePassword = { showConfirmPassword = !showConfirmPassword }
                        )

                        Spacer(Modifier.height(24.dp))

                        // CHECKBOX
                        Row(verticalAlignment = Alignment.Top, modifier = Modifier.fillMaxWidth()) {
                            Checkbox(
                                checked = agree,
                                onCheckedChange = { agree = it },
                                colors = CheckboxDefaults.colors(checkedColor = RegEduMatchBlue)
                            )
                            Text(
                                "I agree to the Terms and Conditions and Privacy Policy",
                                fontSize = 14.sp,
                                color = RegTextGray,
                                modifier = Modifier.padding(top = 8.dp)
                            )
                        }

                        Spacer(Modifier.height(24.dp))

                        // BUTTON CREATE ACCOUNT
                        Button(
                            onClick = {
                                if (isFormValid) {
                                    auth.createUserWithEmailAndPassword(email, password)
                                        .addOnCompleteListener { task ->
                                            scope.launch {
                                                if (task.isSuccessful) {
                                                    // BƯỚC QUAN TRỌNG: LƯU DISPLAY NAME
                                                    val firebaseUser = auth.currentUser
                                                    val profileUpdates = UserProfileChangeRequest.Builder()
                                                        .setDisplayName(name) // 'name' là state Full Name
                                                        .build()

                                                    // GỬI YÊU CẦU CẬP NHẬT TÊN
                                                    firebaseUser?.updateProfile(profileUpdates)?.addOnCompleteListener { profileTask ->
                                                        // Dù cập nhật Profile thành công hay thất bại, ta vẫn tiếp tục điều hướng
                                                        scope.launch {
                                                            snackbarHostState.showSnackbar("Đăng ký thành công! Vui lòng đăng nhập.")
                                                            onNavigateBack()
                                                        }
                                                    } ?: run {
                                                        // Xử lý nếu currentUser null
                                                        scope.launch { onNavigateBack() }
                                                    }

                                                } else {
                                                    // Xử lý lỗi đăng ký thất bại
                                                    snackbarHostState.showSnackbar("Đăng ký thất bại: ${task.exception?.localizedMessage}")
                                                }
                                            }
                                        }
                                }
                            },
                            enabled = isFormValid,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = RegEduMatchBlue,
                                disabledContainerColor = Color(0xFFB0C4DE) // Light Slate Gray
                            )
                        ) {
                            Text("Create account →", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                        }

                        Spacer(Modifier.height(16.dp))

                        // NÚT SIGN IN Ở DƯỚI (Đã đúng)
                        TextButton(onClick = onNavigateBack) {
                            Text(
                                "Already have an account? Sign in",
                                color = RegEduMatchBlue,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(80.dp))

            FooterSectionRegister()
        }
    }
}


@Composable
fun InputFieldRegister(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    value: String,
    onValueChange: (String) -> Unit,
    isPassword: Boolean = false,
    showPassword: Boolean = false,
    onTogglePassword: (() -> Unit)? = null
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, fontSize = 14.sp, color = RegTextGray) },
        leadingIcon = { Icon(icon, contentDescription = null, tint = Color(0xFF999999)) },
        trailingIcon = if (isPassword && onTogglePassword != null) {
            {
                IconButton(onClick = onTogglePassword) {
                    Icon(
                        if (showPassword) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                        contentDescription = null,
                        tint = Color(0xFF999999)
                    )
                }
            }
        } else null,
        visualTransformation = if (isPassword && !showPassword) PasswordVisualTransformation('●') else VisualTransformation.None,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = RegEduMatchBlue,
            unfocusedBorderColor = RegBorderGray,
            focusedLabelColor = RegEduMatchBlue,
            unfocusedLabelColor = RegTextGray
        )
    )
}

//@Composable
//fun FooterSectionRegister() {
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
//            Column(modifier = Modifier.weight(1.5f)) {
//                // Logo Footer
//                Row(verticalAlignment = Alignment.CenterVertically) {
//                    Surface(Modifier.size(32.dp), shape = RoundedCornerShape(8.dp), color = RegEduMatchBlue) {
//                        Box(contentAlignment = Alignment.Center) {
//                            Text("E", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
//                        }
//                    }
//                    Spacer(Modifier.width(8.dp))
//                    Text("EduMatch", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = RegDarkText)
//                }
//                Spacer(Modifier.height(12.dp))
//                Text(
//                    "Connecting students with scholarship opportunities and providers with qualified candidates. Making education accessible for everyone.",
//                    fontSize = 14.sp,
//                    color = RegTextGray,
//                    lineHeight = 20.sp
//                )
//            }
//            // Các cột liên kết
//            Box(modifier = Modifier.weight(1f)) { FooterColumnRegister("Quick Links", listOf("Home", "About Us", "Browse Scholarships", "Pricing Plans")) }
//            Box(modifier = Modifier.weight(1f)) { FooterColumnRegister("Support", listOf("Contact Us", "Help Center", "FAQ", "Privacy Policy", "Terms of Service")) }
//            Box(modifier = Modifier.weight(1.5f)) {
//                FooterColumnRegister("Get in Touch", listOf("support@edumatch.com", "+1 (555) 123-4567", "123 Education Street", "San Francisco, CA 94105"), hasIcons = true)
//            }
//        }
//
//        Spacer(Modifier.height(40.dp))
//        Divider(color = RegDividerGray)
//        Spacer(Modifier.height(20.dp))
//
//        // Bản quyền
//        Row(
//            modifier = Modifier.fillMaxWidth(),
//            horizontalArrangement = Arrangement.SpaceBetween,
//            verticalAlignment = Alignment.CenterVertically
//        ) {
//            Text("© 2025 EduMatch. All rights reserved.", color = Color(0xFF888888), fontSize = 13.sp)
//            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
//                Text("Privacy", color = Color(0xFF888888), fontSize = 13.sp)
//                Text("Terms", color = Color(0xFF888888), fontSize = 13.sp)
//                Text("Contact", color = Color(0xFF888888), fontSize = 13.sp)
//            }
//        }
//    }
//}
//
//@Composable
//fun FooterColumnRegister(title: String, items: List<String>, hasIcons: Boolean = false) {
//    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
//        Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = RegDarkText)
//        items.forEachIndexed { index, item ->
//            Row(verticalAlignment = Alignment.CenterVertically) {
//                if (hasIcons) {
//                    val icon = when (index) {
//                        0 -> Icons.Outlined.Email
//                        1 -> Icons.Default.Phone
//                        else -> Icons.Default.LocationOn
//                    }
//                    Icon(icon, null, tint = RegTextGray, modifier = Modifier.size(16.dp))
//                    Spacer(Modifier.width(8.dp))
//                }
//                Text(item, color = RegTextGray, fontSize = 14.sp)
//            }
//        }
//    }
//}