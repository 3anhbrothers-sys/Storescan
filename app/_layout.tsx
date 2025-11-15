import React, { useState, createContext, useContext, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from "react-native";

// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

// ---------------- Firebase Config ----------------
const firebaseConfig = {
  apiKey: "AIzaSyBmhDs7GUISJDioBSMXf0YMivX4KzByuNk",
  authDomain: "storescan-b692e.firebaseapp.com",
  projectId: "storescan-b692e",
  storageBucket: "storescan-b692e.firebasestorage.app",
  messagingSenderId: "388556690144",
  appId: "1:388556690144:web:31518bb1f204d4839af685",
  measurementId: "G-TH314LPZXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ---------------- Auth Context ----------------
type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  verifyCode: string;
  setVerifyCode: (code: string) => void;
  role: string;
  setRole: (role: string) => void;
};

const AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [role, setRole] = useState("");
  return (
    <AuthContext.Provider value={{ user, setUser, verifyCode, setVerifyCode, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// ---------------- App ----------------
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

// ---------------- Main Navigator ----------------
function Main() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<
    | "Welcome"
    | "SignIn"
    | "SignUp"
    | "Role"
    | "VerifyCode"
    | "Home"
    | "ForgotPasswordVerify"
    | "ForgotPasswordReset"
  >("Welcome");

  useEffect(() => {
    if (user) setScreen("Home");
  }, [user]);

  switch (screen) {
    case "Welcome": return <WelcomeScreen goTo={setScreen} />;
    case "SignIn": return <SignInScreen goTo={setScreen} />;
    case "SignUp": return <SignUpScreen goTo={setScreen} />;
    case "Role": return <RoleSelectionScreen goTo={setScreen} />;
    case "VerifyCode": return <VerifyCodeScreen goTo={setScreen} />;
    case "Home": return <HomeScreen goTo={setScreen} />;
    case "ForgotPasswordVerify": return <ForgotPasswordVerifyScreen goTo={setScreen} />;
    case "ForgotPasswordReset": return <ForgotPasswordResetScreen goTo={setScreen} />;
    default: return null;
  }
}

// ---------------- Screens ----------------
function BackButton({ goTo, to }: { goTo: (s: any) => void; to: string }) {
  return (
    <TouchableOpacity onPress={() => goTo(to)} style={{ marginBottom: 20 }}>
      <Text style={{ color: "#93c5fd" }}>← Back</Text>
    </TouchableOpacity>
  );
}

function WelcomeScreen({ goTo }: { goTo: (s: any) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>StoreScan</Text>
      <Text style={styles.title}>Welcome</Text>
      <TouchableOpacity style={styles.button} onPress={() => goTo("SignIn")}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => goTo("SignUp")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function SignInScreen({ goTo }: { goTo: (s: any) => void }) {
  const { setUser, setVerifyCode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) return Alert.alert("Please fill in all fields");
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (error: any) {
      Alert.alert("Sign In Failed", error.message);
    }
    setLoading(false);
  }

  function handleForgotPassword() {
    if (!email) return Alert.alert("Enter your email first");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerifyCode(code);
    Alert.alert("Verification Code", `Your code is: ${code}`);
    goTo("ForgotPasswordVerify");
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="Welcome" />
      <Text style={styles.title}>Sign In</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" autoCapitalize="none" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry onChangeText={setPassword} value={password} />
      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={[styles.link, { marginTop: 10 }]}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goTo("SignUp")}>
        <Text style={styles.link}>Create Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function SignUpScreen({ goTo }: { goTo: (s: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);

  function calculateStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    setStrength(score);
  }

  function handleNext() {
    if (!email || !password || !confirmPassword) return Alert.alert("Please fill in all fields");
    if (password !== confirmPassword) return Alert.alert("Passwords do not match");
    if (strength < 3) return Alert.alert("Weak password", "Please choose a stronger password");
    goTo("Role");
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="Welcome" />
      <ScrollView>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" autoCapitalize="none" onChangeText={setEmail} value={email} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry onChangeText={(text) => { setPassword(text); calculateStrength(text); }} value={password} />
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#aaa" secureTextEntry onChangeText={setConfirmPassword} value={confirmPassword} />
        <View style={styles.strengthBarContainer}>
          {[0,1,2,3].map(i => <View key={i} style={[styles.strengthBar, { backgroundColor: i<strength ? "#2563eb":"#555" }]} />)}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function RoleSelectionScreen({ goTo }: { goTo: (s: any) => void }) {
  const { setVerifyCode, setRole } = useAuth();

  function handleRole(role: string) {
    setRole(role);
    const code = Math.floor(100000 + Math.random()*900000).toString();
    setVerifyCode(code);
    Alert.alert("Verification Code", `Your code is: ${code}`);
    goTo("VerifyCode");
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="SignUp" />
      <Text style={styles.title}>Select Role</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleRole("Admin")}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleRole("User")}>
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function VerifyCodeScreen({ goTo }: { goTo: (s: any) => void }) {
  const { verifyCode } = useAuth();
  const [code, setCode] = useState("");

  function handleVerify() {
    if (code === verifyCode) {
      Alert.alert("Success", "Verification successful!");
      goTo("Home");
    } else {
      Alert.alert("Error", "Invalid verification code.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="Role" />
      <Text style={styles.title}>Verify Your Account</Text>
      <TextInput style={styles.input} placeholder="Enter Verification Code" placeholderTextColor="#aaa" keyboardType="number-pad" onChangeText={setCode} value={code} />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ForgotPasswordVerifyScreen({ goTo }: { goTo: (s: any) => void }) {
  const { verifyCode } = useAuth();
  const [code, setCode] = useState("");

  function handleVerify() {
    if (code === verifyCode) goTo("ForgotPasswordReset");
    else Alert.alert("Error", "Invalid verification code.");
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="SignIn" />
      <Text style={styles.title}>Verify Code</Text>
      <TextInput style={styles.input} placeholder="Enter Verification Code" placeholderTextColor="#aaa" keyboardType="number-pad" onChangeText={setCode} value={code} />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ForgotPasswordResetScreen({ goTo }: { goTo: (s: any) => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  function calculateStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    setStrength(score);
  }

  async function handleReset() {
    if (!newPassword || !confirmPassword) return Alert.alert("Fill in all fields");
    if (newPassword !== confirmPassword) return Alert.alert("Passwords do not match");
    if (strength < 3) return Alert.alert("Weak password", "Please choose a stronger password");

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No signed-in user");
      await user.updatePassword(newPassword);
      Alert.alert("Success", "Password updated!");
      goTo("SignIn");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="SignIn" />
      <Text style={styles.title}>Reset Password</Text>
      <TextInput style={styles.input} placeholder="New Password" placeholderTextColor="#aaa" secureTextEntry onChangeText={(text) => { setNewPassword(text); calculateStrength(text); }} value={newPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#aaa" secureTextEntry onChangeText={setConfirmPassword} value={confirmPassword} />
      <View style={styles.strengthBarContainer}>
        {[0,1,2,3].map(i => <View key={i} style={[styles.strengthBar, { backgroundColor: i<strength ? "#2563eb":"#555" }]} />)}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function HomeScreen({ goTo }: { goTo: (s: any) => void }) {
  const { setUser, role } = useAuth();

  function handleSignOut() {
    signOut(auth);
    setUser(null);
    goTo("Welcome");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome {role} 🎉</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0b0b0b", padding:20 },
  appTitle: { color:"#2563eb", fontSize:36, fontWeight:"800", textAlign:"center", marginBottom:20 },
  title: { color:"white", fontSize:28, fontWeight:"700", marginVertical:20, textAlign:"center" },
  input: { backgroundColor:"#1a1a1a", color:"white", borderRadius:8, padding:14, marginVertical:10 },
  button: { backgroundColor:"#2563eb", padding:15, borderRadius:8, alignItems:"center", marginVertical:10 },
  buttonText: { color:"white", fontWeight:"600" },
  link: { color:"#93c5fd", marginTop:15, textAlign:"center" },
  strengthBarContainer: { flexDirection:"row", marginVertical:5, justifyContent:"space-between" },
  strengthBar: { flex:1, height:6, marginHorizontal:2, borderRadius:3 },
});

