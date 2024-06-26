import {
  defaultDirection,
  defaultColor,
  themeSelectedColorStorageKey,
  themeRadiusStorageKey,
  localeOptions,
  defaultLocale,
} from '../constants/config';
import Swal from 'sweetalert2';

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key];
    var B = b[key];
    if (order.indexOf(A + '') > order.indexOf(B + '')) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
};

export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '.' + mm + '.' + yyyy;
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ':' + now.getMinutes();
};

export const ThemeColors = () => {
  let rootStyle = getComputedStyle(document.body);
  return {
    themeColor1: rootStyle.getPropertyValue('--theme-color-1').trim(),
    themeColor2: rootStyle.getPropertyValue('--theme-color-2').trim(),
    themeColor3: rootStyle.getPropertyValue('--theme-color-3').trim(),
    themeColor4: rootStyle.getPropertyValue('--theme-color-4').trim(),
    themeColor5: rootStyle.getPropertyValue('--theme-color-5').trim(),
    themeColor6: rootStyle.getPropertyValue('--theme-color-6').trim(),
    themeColor1_10: rootStyle.getPropertyValue('--theme-color-1-10').trim(),
    themeColor2_10: rootStyle.getPropertyValue('--theme-color-2-10').trim(),
    themeColor3_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor4_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor5_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor6_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    primaryColor: rootStyle.getPropertyValue('--primary-color').trim(),
    foregroundColor: rootStyle.getPropertyValue('--foreground-color').trim(),
    separatorColor: rootStyle.getPropertyValue('--separator-color').trim(),
  };
};

export const getDirection = () => {
  let direction = defaultDirection;
  if (localStorage.getItem('direction')) {
    const localValue = localStorage.getItem('direction');
    if (localValue === 'rtl' || localValue === 'ltr') {
      direction = localValue;
    }
  }
  return {
    direction,
    isRtl: direction === 'rtl',
  };
};

export const setDirection = localValue => {
  let direction = 'ltr';
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue;
  }
  localStorage.setItem('direction', direction);
};

export const getThemeColor = () => {
  let color = defaultColor;
  try {
    if (localStorage.getItem(themeSelectedColorStorageKey)) {
      color =
        localStorage.getItem(themeSelectedColorStorageKey) || defaultColor;
    }
  } catch (error) {
    console.log('>>>> src/utils/index.js : getThemeColor -> error', error);
    color = defaultColor;
  }
  return color;
};

export const setThemeColor = color => {
  try {
    localStorage.setItem(themeSelectedColorStorageKey, color);
  } catch (error) {
    console.log('>>>> src/utils/index.js : setThemeColor -> error', error);
  }
};

export const getThemeRadius = () => {
  let radius = 'rounded';
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      radius = localStorage.getItem(themeRadiusStorageKey) || 'rounded';
    }
  } catch (error) {
    console.log('>>>> src/utils/index.js : getThemeRadius -> error', error);
    radius = 'rounded';
  }
  return radius;
};

export const setThemeRadius = radius => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {
    console.log('>>>> src/utils/index.js : setThemeRadius -> error', error);
  }
};

export const getCurrentLanguage = () => {
  let locale = defaultLocale;
  try {
    if (
      localStorage.getItem('currentLanguage') &&
      localeOptions.filter(
        x => x.id === localStorage.getItem('currentLanguage')
      ).length > 0
    ) {
      locale = localStorage.getItem('currentLanguage');
    }
  } catch (error) {
    console.log('>>>> src/utils/index.js : getCurrentLanguage -> error', error);
    locale = defaultLocale;
  }
  return locale;
};

export const setCurrentLanguage = lang => {
  try {
    localStorage.setItem('currentLanguage', lang);
  } catch (error) {
    console.log('>>>> src/utils/index.js : setCurrentLanguage -> error', error);
  }
};

export const getCurrentUser = () => {
  let user = null;
  try {
    user =
      localStorage.getItem('user') != null
        ? JSON.parse(localStorage.getItem('user'))
        : null;
  } catch (error) {
    console.log('>>>> src/utils/index.js : getCurrentUser -> error', error);
    user = null;
  }
  return user;
};

export const setCurrentUser = user => {
  try {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.log('>>>> src/utils/index.js : setCurrentUser -> error', error);
  }
};

export const setCurrentUserPhoto = photo => {
  try {
    if (photo) {
      const currentData = getCurrentUser();
      currentData.photo = photo;
      setCurrentUser(currentData);
    }
  } catch (error) {
    console.log('>>>> src/utils/index.js : setCurrentUser -> error', error);
  }
};

export const setToken = token => {
  if (token) window.localStorage.setItem('token', token);
  else window.localStorage.removeItem('token');
};

export const getToken = () => {
  return window.localStorage.getItem('token');
};

export const setTokenAmount = tokenAmount => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  user.token_amount = tokenAmount;
  window.localStorage.setItem('user', JSON.stringify(user));
};

export const showConfirmAlert = ({
  title = 'Confirmation',
  text = 'Confirm your action ?',
  icon = 'warning',
}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#153245',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm',
  });
};

export const showConfirmAlertWithPreloader = ({
  title = 'Confirmation',
  text = 'Confirm your action ?',
  icon = 'warning',
  preConfirm = () => {}
}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    confirmButtonColor: '#153245',
    cancelButtonColor: '#d33',
  })
}

export const convertNumberToAlphabet = number => {
  if (number < 1 || number > 26) {
    return -1;
  } else {
    return String.fromCharCode(number + 64);
  }
};

export const ahsItemable = ahsItemableStr => {
  const ahsItemableArr = ahsItemableStr.split('\\');
  return ahsItemableArr[ahsItemableArr.length - 1];
};

export const isItemPrice = ahsItemableStr => {
  return ahsItemable(ahsItemableStr) === 'ItemPrice';
};

export const formatCurrency = number => new Intl.NumberFormat().format(number);

export const checkQueryPath = (basePath, path) => {
  return `${basePath}${
    path && !String(path).startsWith('?') ? `/${path}` : path
  }`;
};

export const numberToAlphabet = number => {
  // prettier-ignore
  const alphabetSequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  return alphabetSequence[number >= 26 ? number % 26 : number];
};

export const formatDateString = stringDate => {
  const date = new Date(stringDate);
  
  const secs = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  const mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();

  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
  const year = date.getFullYear();

  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${mins}:${secs}`
  };
}

export const Utils = {
  downloadFile: function (fileName, blob) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }
}