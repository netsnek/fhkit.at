import { LayoutProps } from 'jaen';
import { useLocation } from '@reach/router';
import { CMSManagement } from 'gatsby-plugin-jaen';
import AppLayout from '../../components/AppLayout';
import Footer from '../../components/sections/Footer';
import { ContactModalProvider } from '../../services/contact';
import { stripLocalePrefix, usePageLocale } from '../../contexts/locale';

const Layout: React.FC<LayoutProps> = ({ children, pageProps }) => {
  const path = useLocation().pathname;
  const { prefix } = usePageLocale();

  // Every route test below is written against the unprefixed path, so / and
  // /ja/ pick the same top bar. Comparing the raw pathname sent every
  // non-German page down the wrong branch.
  const route = stripLocalePrefix(path, prefix);

  if (route.startsWith('/admin')) {
    return children;
  }

  return (
    <CMSManagement>
      <ContactModalProvider location={{ pathname: path, search: '' }}>
        <AppLayout footer={Footer} path={route}>
          {children}
        </AppLayout>
      </ContactModalProvider>
    </CMSManagement>
  );
};

export default Layout;
