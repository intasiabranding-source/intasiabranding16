import { getSiteSettings, getSiteTheme } from "@/lib/cms/fetch";

export async function getPublicSettings() {
  const [settings, theme] = await Promise.all([getSiteSettings(), getSiteTheme()]);

  return {
    brandName: settings.brandName,
    tagline: settings.tagline,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    whatsapp: settings.whatsapp,
    instagram: settings.instagram,
    address: settings.address,
    mapEmbedUrl: settings.mapEmbedUrl,
    gaMeasurementId: settings.gaMeasurementId,
    theme: {
      primaryColor: theme.primaryColor,
      accentColor: theme.accentColor,
      gradientFrom: theme.gradientFrom,
      gradientTo: theme.gradientTo,
      darkModeDefault: theme.darkModeDefault,
    },
  };
}
