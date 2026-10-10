import { ReactNode } from 'react';

export type TLinkData = {
  name: ReactNode;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  /**
   * Leave the app with a full page load instead of Gatsby's client-side
   * navigation. See the Sign In entry in TopNav for why /login/ needs it.
   */
  reload?: boolean;
};
