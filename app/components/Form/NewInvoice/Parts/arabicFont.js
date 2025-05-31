import { Font } from '@react-pdf/renderer';

export const registerArabicFont = () => {
  Font.register({
    family: 'tajawal',
    src: '/fonts/Tajawal-Regular.ttf',
    fontWeight: 'normal',
  });
};
