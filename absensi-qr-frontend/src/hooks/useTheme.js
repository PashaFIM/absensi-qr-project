import { useContext } from 'react';
import { ThemeContext } from '../context/themeContextObject';

export const useTheme = () => useContext(ThemeContext);
