import * as z from "zod";

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true")
      .optional(),
    APP_URL: z.string().optional().default("http://localhost:5173"),
    NODE_ENV:z.string()
  });

  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((envrs, curr) => {
    const [key, value] = curr;
    if (key.startsWith("VITE_APP_")) {
      envrs[key.replace("VITE_APP_", "")] = value;
    }
    return envrs;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(`Invalid env provided.The following variables are missing or invalid:
                    ${Object.entries(parsedEnv.error.flatten().fieldErrors)
                      .map(([k, v]) => `- ${k}: ${v}`)
                      .join("\n")}`);
  }
  return parsedEnv.data
};

export const env = createEnv();