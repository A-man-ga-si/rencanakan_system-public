// Application theme related configs
export const defaultTitle = 'Untitled';
export const titleSuffix = ' | Rencanakan.id';

// URLs Related Configs
export const apiDomain = 'http://localhost:8000';
// export const apiDomain = 'https://api.beta.rencanakan.id';
export const apiUrl = `${apiDomain}/api`;
export const adminRoot = '/app';
export const searchPath = `${adminRoot}/#`;
export const buyUrl = '#';
export const landingPageUrl = 'https://rencanakan.id';
// export const apiDomain = 'http://localhost:8000';

// Theme Related Configs
export const defaultMenuType = 'menu-default'; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const rounded = true;
export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;

export const defaultProfilePictureName = 'default-profile-picture.svg';
export const defaultCompanyPictureName = 'default-company-picture.png';
export const isAuthGuardActive = true;
export const themeRadiusStorageKey = 'theme_radius';
export const themeSelectedColorStorageKey = 'theme_selected_color';
export const defaultColor = 'light.blueolympic';
export const colors = [
  'bluenavy',
  'blueyale',
  'blueolympic',
  'greenmoss',
  'greenlime',
  'purplemonster',
  'orangecarrot',
  'redruby',
  'yellowgranola',
  'greysteel',
];

// Locale Related Configs
export const defaultLocale = 'id';
export const defaultDirection = 'ltr';
export const localeOptions = [
  { id: 'en', name: 'English', direction: 'ltr' },
  { id: 'id', name: 'Indonesian', direction: 'ltr' },
];

// Miscellaneous configs
export const availableErrorCodes = ['404', '403', '500'];
