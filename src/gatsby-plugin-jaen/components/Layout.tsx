import { LayoutProps } from '@atsnek/jaen';
import { useLocation } from '@reach/router';
import { CMSManagement } from 'gatsby-plugin-jaen';
import AppLayout from '../../components/AppLayout';
import Footer from '../../components/sections/Footer';
import { ContactModalProvider } from '../../services/contact';

const Layout: React.FC<LayoutProps> = ({ children, pageProps }) => {
  const path = useLocation().pathname;

  const docsPaths = ['/docs', '/experiments'];

  const isDocs = docsPaths.some(docsPath => path.startsWith(docsPath));

  if (path.startsWith('/admin')) {
    return children;
  }

  return (
    <CMSManagement>
      <ContactModalProvider location={{ pathname: path, search: '' }}>
        <AppLayout footer={Footer} isDocs={isDocs} path={path}>
          {children}
        </AppLayout>
      </ContactModalProvider>
    </CMSManagement>
  );
};

export default Layout;
