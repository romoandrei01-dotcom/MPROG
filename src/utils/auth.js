
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "washtrack_session_v1";

const accounts = [
  {
    email: "admin@washtrack.com",
    password: "admin123",
    role: "admin",
    name: "WashTrack Admin",
  },
  {
    email: "staff@washtrack.com",
    password: "staff123",
    role: "staff",
    name: "WashTrack Staff",
  },
];

export async function login(email, password) {
  const account = accounts.find(
    (user) =>
      user.email === String(email).trim().toLowerCase() &&
      user.password === password
  );

  if (!account) {
    throw new Error("Invalid email or password.");
  }

  const session = {
    email: account.email,
    role: account.role,
    name: account.name,
  };

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  return session;
}

export async function getSession() {
  const data = await AsyncStorage.getItem(SESSION_KEY);

  if (!data) {
    return null;
  }

  try {
    const session = JSON.parse(data);

    const validAccount = accounts.some(
      (account) =>
        account.email === session.email &&
        account.role === session.role
    );

    return validAccount ? session : null;
  } catch {
    return null;
  }
}

export async function logout() {
  await AsyncStorage.multiRemove([
    SESSION_KEY,
    "isLoggedIn",
  ]);
}
