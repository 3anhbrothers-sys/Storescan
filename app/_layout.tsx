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

// Icons for HomeScreen
import { Ionicons, Feather } from "@expo/vector-icons";

// Firebase
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

// ---------------- Firebase Config ----------------
const firebaseConfig = {
  apiKey: "AIzaSyBmhDs7GUISJDioBSMXf0YMivX4KzByuNk",
  authDomain: "storescan-b692e.firebaseapp.com",
  projectId: "storescan-b692e",
  storageBucket: "storescan-b692e.firebasestorage.app",
  messagingSenderId: "388556690144",
  appId: "1:388556690144:web:31518bb1f204d4839af685",
  measurementId: "G-TH314LPZXY",
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
    | "Profile"
    | "ForgotPasswordVerify"
    | "ForgotPasswordReset"
  >("Welcome");

  // Auto-login goes to Home
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
    case "Profile": return <ProfileScreen goTo={setScreen} />;
    case "ForgotPasswordVerify": return <ForgotPasswordVerifyScreen goTo={setScreen} />;
    case "ForgotPasswordReset": return <ForgotPasswordResetScreen goTo={setScreen} />;
    default: return null;
  }
}

// ---------------- Reusable Back Button ----------------
function BackButton({ goTo, to }: { goTo: (s: any) => void; to: string }) {
  return (
    <TouchableOpacity onPress={() => goTo(to)} style={{ marginBottom: 20 }}>
      <Text style={{ color: "#93c5fd" }}>← Back</Text>
    </TouchableOpacity>
  );
}

// ---------------- Screens ----------------
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

// ---------------- Sign In ----------------
function SignInScreen({ goTo }: { goTo: (s: any) => void }) {
  const { setUser, setVerifyCode } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) return Alert.alert("Please fill in all fields");
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (e: any) {
      Alert.alert("Sign In Failed", e.message);
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

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

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

// ---------------- Sign Up ----------------
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
    if (!email || !password || !confirmPassword)
      return Alert.alert("Please fill in all fields");
    if (password !== confirmPassword)
      return Alert.alert("Passwords do not match");
    if (strength < 3)
      return Alert.alert("Weak password", "Please choose a stronger password");

    goTo("Role");
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="Welcome" />

      <ScrollView>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={(t) => {
            setPassword(t);
            calculateStrength(t);
          }}
          value={password}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />

        <View style={styles.strengthBarContainer}>
          {[0,1,2,3].map(i => (
            <View
              key={i}
              style={[
                styles.strengthBar,
                { backgroundColor: i < strength ? "#2563eb" : "#555" },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------- Role Selector ----------------
function RoleSelectionScreen({ goTo }: { goTo: (s: any) => void }) {
  const { setVerifyCode, setRole } = useAuth();

  function handleRole(r: string) {
    setRole(r);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
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

// ---------------- Verify Code ----------------
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

      <TextInput
        style={styles.input}
        placeholder="Enter Verification Code"
        placeholderTextColor="#aaa"
        keyboardType="number-pad"
        onChangeText={setCode}
        value={code}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------- Forgot Password Verify ----------------
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

      <TextInput
        style={styles.input}
        placeholder="Enter Verification Code"
        placeholderTextColor="#aaa"
        keyboardType="number-pad"
        onChangeText={setCode}
        value={code}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------- Reset Password ----------------
function ForgotPasswordResetScreen({ goTo }: { goTo: (s: any) => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  function calculateStrength(pw: string) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    setStrength(s);
  }

  async function handleReset() {
    if (!newPassword || !confirmPassword)
      return Alert.alert("Fill in all fields");
    if (newPassword !== confirmPassword)
      return Alert.alert("Passwords do not match");
    if (strength < 3)
      return Alert.alert("Weak password", "Choose a stronger one");

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("No signed in user");
      await user.updatePassword(newPassword);
      Alert.alert("Success", "Password updated!");
      goTo("SignIn");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goTo={goTo} to="SignIn" />

      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={(t) => {
          setNewPassword(t);
          calculateStrength(t);
        }}
        value={newPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />

      <View style={styles.strengthBarContainer}>
        {[0,1,2,3].map(i => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              { backgroundColor: i < strength ? "#2563eb" : "#555" },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------- Profile Screen ----------------
function ProfileScreen({ goTo }: { goTo: (s: any) => void }) {
  const { user, role, setUser } = useAuth();

  async function handleSignOut() {
    try {
      await signOut(auth);
      setUser(null);
      goTo("Welcome");
    } catch (e: any) {
      Alert.alert("Sign Out Failed", e.message);
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Delete Account?",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await user?.delete();
              setUser(null);
              goTo("Welcome");
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 60 }]}>
      <BackButton goTo={goTo} to="Home" />

      <Text style={styles.title}>My Profile</Text>

      <Text style={{ color: "white", fontSize: 20, marginBottom: 5 }}>Email:</Text>
      <Text style={{ color: "#93c5fd", fontSize: 18, marginBottom: 20 }}>
        {user?.email}
      </Text>

      <Text style={{ color: "white", fontSize: 20, marginBottom: 5 }}>Role:</Text>
      <Text style={{ color: "#93c5fd", fontSize: 18, marginBottom: 30 }}>
        {role || "Not set"}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1e3a8a" }]}
        onPress={() => Alert.alert("Coming Soon", "Profile editing coming later!")}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1e3a8a" }]}
        onPress={() => goTo("ForgotPasswordReset")}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc2626" }]}
        onPress={handleDelete}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4b5563" }]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------- Home Screen ----------------
function HomeScreen({ goTo }: { goTo: (s: any) => void }) {
  const { role } = useAuth();

  return (
    <SafeAreaView style={homeStyles.container}>

      {/* Search bar */}
      <View style={homeStyles.searchBar}>
        <Ionicons name="menu" size={26} color="#0b0b0b" />

        <TextInput
          placeholder="Search for items here...."
          placeholderTextColor="#666"
          style={homeStyles.searchInput}
        />

        <Feather name="search" size={22} color="#0b0b0b" />
      </View>

      {/* Big magnifying glass */}
      <View style={homeStyles.bigIconContainer}>
        <Feather name="search" size={180} color="#154889" />
      </View>

      {/* List menu */}
      <TouchableOpacity style={homeStyles.listButton}>
        <Text style={homeStyles.listButtonText}>List Menu</Text>
        <Ionicons name="chevron-forward" size={22} color="white" />
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={homeStyles.bottomNav}>
        <TouchableOpacity onPress={() => goTo("Profile")}>
          <Ionicons name="person-circle-outline" size={32} color="#0b0b0b" />
        </TouchableOpacity>

        <Ionicons name="cart-outline" size={32} color="#154889" />
        <Ionicons name="location-outline" size={32} color="#0b0b0b" />
        <Ionicons name="scan-outline" size={32} color="#0b0b0b" />
      </View>

    </SafeAreaView>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b", padding: 20 },
  appTitle: { color: "#2563eb", fontSize: 36, fontWeight: "800", textAlign: "center", marginBottom: 20 },
  title: { color: "white", fontSize: 28, fontWeight: "700", marginVertical: 20, textAlign: "center" },
  input: { backgroundColor: "#1a1a1a", color: "white", borderRadius: 8, padding: 14, marginVertical: 10 },
  button: { backgroundColor: "#2563eb", padding: 15, borderRadius: 8, alignItems: "center", marginVertical: 10 },
  buttonText: { color: "white", fontWeight: "600" },
  link: { color: "#93c5fd", marginTop: 15, textAlign: "center" },
  strengthBarContainer: { flexDirection: "row", marginVertical: 5, justifyContent: "space-between" },
  strengthBar: { flex: 1, height: 6, marginHorizontal: 2, borderRadius: 3 },
});

// ------- Home screen styles ------------
const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: "#dbe5f1",
    width: "90%",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0b0b0b",
  },
  bigIconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listButton: {
    flexDirection: "row",
    backgroundColor: "#002c6d",
    width: "70%",
    paddingVertical: 18,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  listButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  bottomNav: {
    width: "100%",
    paddingVertical: 12,
    borderTopWidth: 2,
    borderColor: "#e5e5e5",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
  },
});
