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

  // Every route test below is written against the unprefixed path, so /docs
  // and /ja/docs pick the same layout. Comparing the raw pathname sent every
  // non-German page down the marketing branch.
  const route = stripLocalePrefix(path, prefix);

  const docsPaths = ['/docs', '/experiments'];

  const isDocs = docsPaths.some(docsPath => route.startsWith(docsPath));

  if (route.startsWith('/admin')) {
    return children;
  }

  return (
    <CMSManagement>
      <ContactModalProvider location={{ pathname: path, search: '' }}>
        <AppLayout footer={Footer} isDocs={isDocs} path={route}>
          {children}
        </AppLayout>
      </ContactModalProvider>
    </CMSManagement>
  );
};

export default Layout;
