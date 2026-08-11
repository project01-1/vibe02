const PROJECT_URL = "https://xytlzevnucxgkaohmjwk.supabase.co";

function cleanEnvironmentValue(value: string | undefined) {
  return value?.replace(/^\uFEFF/, "").trim();
}

function requireServerValue(name: "SUPABASE_SERVICE_ROLE_KEY" | "AUTH_PIN_PEPPER") {
  const value = cleanEnvironmentValue(process.env[name]);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export function getSupabasePublicConfig() {
  const url = cleanEnvironmentValue(process.env.NEXT_PUBLIC_SUPABASE_URL) ?? PROJECT_URL;
  const anonKey = cleanEnvironmentValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.");
  return { url, anonKey };
}

export function getSupabaseAdminConfig() {
  return {
    url: cleanEnvironmentValue(process.env.NEXT_PUBLIC_SUPABASE_URL) ?? PROJECT_URL,
    serviceRoleKey: requireServerValue("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getPinPepper() {
  return requireServerValue("AUTH_PIN_PEPPER");
}
