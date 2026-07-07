export const AUTH_MODAL_VISITED_KEY = "website-visited"; // localStorage key

// Where to send the user back to after a Google OAuth round-trip.
export const POST_LOGIN_REDIRECT_KEY = "postLoginRedirect";

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
