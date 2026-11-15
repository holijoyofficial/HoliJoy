// Demo accounts for the team (see /demo). Controlled by the DEMO_MODE env var;
// it must be turned off before launch, because the demo hotel is approved and
// can see animators' WhatsApp numbers.
export const isDemoMode = () => process.env.DEMO_MODE === "true";

export const DEMO_ANIMATOR_SLUG = "deniz-demo";
