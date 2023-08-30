import { SideBarState as State } from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DefaultTheme, useTheme } from 'styled-components';

import { syncWalletsWithDevice } from '~/actions';
import { useQuery, useNavigateTo } from '~/hooks';

import { useDevice } from './device';

import {
  useAppDispatch,
  useAppSelector,
  selectLanguage,
  selectWallets,
  routes,
  ILangState,
  AppDispatch,
} from '..';

export type Page = 'portfolio' | 'wallet' | 'history' | 'settings' | 'help';

export interface SidebarContextInterface {
  strings: ILangState['strings']['sidebar'];
  getState: (page: Page) => State;
  navigate: (page: Page) => void;
  theme: DefaultTheme;
  isWalletCollapsed: boolean;
  setIsWalletCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  navigateWallet: (id: string | undefined) => void;
  getWalletState: (id: string | undefined) => State;
  syncWalletStatus: string;
  wallets: IWallet[];
  deletedWallets: IWallet[];
  onWalletSync: (e: any) => void;
  dispatch: AppDispatch;
  isWalletPage: boolean;
}

export const SidebarContext: React.Context<SidebarContextInterface> =
  React.createContext<SidebarContextInterface>({} as SidebarContextInterface);

export interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const query = useQuery();
  const dispatch = useAppDispatch();
  const strings = useAppSelector(selectLanguage).strings.sidebar;
  const { wallets, deletedWallets, syncWalletStatus } =
    useAppSelector(selectWallets);
  const theme = useTheme()!;
  const navigateTo = useNavigateTo();
  const { connection, connectDevice } = useDevice();

  const [isWalletCollapsed, setIsWalletCollapsed] = React.useState(false);

  const navigate = (page: Page) => {
    navigateTo(routes[page].path);
  };

  const navigateWallet = (id: string | undefined) => {
    if (!id) return;
    navigateTo(`${routes.wallet.path}?id=${id}`);
  };

  const getState = (page: Page): State => {
    if (location.pathname === routes[page].path) return State.selected;
    return State.normal;
  };
  const getWalletState = (id: string | undefined): State => {
    if (
      id &&
      location.pathname === routes.wallet.path &&
      query.get('id') === id
    )
      return State.active;
    return State.normal;
  };

  useEffect(() => {
    if (location.pathname === routes.wallet.path) {
      setIsWalletCollapsed(false);
    }
  }, [location.pathname]);

  const onWalletSync = (e: any) => {
    e.stopPropagation();
    dispatch(
      syncWalletsWithDevice({
        connection,
        connectDevice,
        doFetchFromDevice: true,
      }),
    );
  };

  const ctx = useMemo(
    () => ({
      strings,
      getState,
      navigate,
      theme,
      isWalletCollapsed,
      setIsWalletCollapsed,
      syncWalletStatus,
      wallets,
      onWalletSync,
      deletedWallets,
      navigateWallet,
      getWalletState,
      dispatch,
      isWalletPage: location.pathname === routes.wallet.path,
    }),
    [
      strings,
      getState,
      navigate,
      theme,
      isWalletCollapsed,
      setIsWalletCollapsed,
      syncWalletStatus,
      wallets,
      onWalletSync,
      deletedWallets,
      navigateWallet,
      getWalletState,
      dispatch,
      location.pathname,
    ],
  );

  return (
    <SidebarContext.Provider value={ctx}>{children}</SidebarContext.Provider>
  );
};

export function useSidebar(): SidebarContextInterface {
  return React.useContext(SidebarContext);
}
