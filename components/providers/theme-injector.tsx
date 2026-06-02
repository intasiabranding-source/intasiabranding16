import { getSiteTheme } from "@/lib/cms/fetch";

export async function ThemeInjector() {
  const theme = await getSiteTheme();

  const css = `
    :root {
      --primary: ${theme.primaryColor};
      --accent: ${theme.accentColor};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
