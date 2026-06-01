export const AUTH_MODAL_VISITED_KEY = "dajubhai_visited"; // localStorage key

export const LOGIN_FORM_DEFAULTS = {
  email: "",
  password: "",
  rememberMe: false,
} as const;

export const AUTH_STRINGS = {
  title: "Create Account",
  subtitle: "Sign up to get started",
  emailLabel: "Email",
  emailPlaceholder: "Enter your Email",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your Password",
  rememberMe: "Remember me",
  forgotPassword: "Forgot password?",
  loginBtn: "Login",
  orDivider: "or",
  googleBtn: "Login with Google",
  noAccount: "Don't have an account?",
  register: "Register",
} as const;
