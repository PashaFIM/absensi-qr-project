import { createContext, useContext } from 'react';

export const RefreshContext = createContext({ setRefreshFn: () => {}, setRefreshing: () => {} });

export const useHeaderRefresh = () => useContext(RefreshContext);
