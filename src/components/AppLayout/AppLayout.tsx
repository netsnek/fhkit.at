import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import React, { FC, ReactNode, useMemo } from 'react';
import TopNav from '../navigation/TopNav';
import AltTopNav from '../navigation/AltTopNav';

import { useAuth, useCMSManagementContext } from '@atsnek/jaen';
import { useLocation } from '@reach/router';
import { MenuStructureContext } from '../../contexts/menu-structure';
import { createPageTree } from '../../utils/navigation';
import CommunityLayout from './CommunityLayout';
import DocsLayout from './DocsLayout';
import Footer from './Footer';
import { GridPattern } from '../GridPattern';

interface AppLayoutProps {
  children?: React.ReactNode;
  isDocs?: boolean;
  path: string;
  footer?: FC;
}

/**
 * The global layout component.
 * This should not be directly used in pages, but used in gatsby.
 */
const AppLayout: FC<AppLayoutProps> = ({ children, isDocs, path, footer }) => {
  const cmsManager = useCMSManagementContext();
  const location = useLocation();
  const topNavDisclosure = useDisclosure(); // for the top nav mobile drawer
  const { isAuthenticated } = useAuth();
  const currentUserId = '1';

  // This generates the menu structure from the page tree that is used over the whole app by accessing the context.
  const menuStructure = useMemo(
    () => createPageTree(cmsManager, location.pathname),
    [cmsManager, path]
  );

  const FooterComp = footer ?? Footer;

  let childrenElmnt: ReactNode = null;

  const isCommunity = ['/experiments', '/experiments/'].includes(path);

  if (isDocs) {
    childrenElmnt = (
      <DocsLayout path={path} isCommunity={isCommunity}>
        {children}
      </DocsLayout>
    );
  } else if (isCommunity) {
    childrenElmnt = <CommunityLayout>{children}</CommunityLayout>;
  } else {
    childrenElmnt = children;
  }

  return (
    <>
      <MenuStructureContext.Provider value={{ menuStructure }}>
      <Box
          as="main"
          minW="210px"
          h="max(100%, 100vh)"
          minH="100vh">
            {/* {path === "/" && <GridPattern
              position="absolute"
              insetX="0"
              top="-14" // In Chakra UI the values are in base 4 pixels, '-14' here might not directly translate. Adjust accordingly.
              zIndex={-10}
              h="1000px" // It's preferable to use responsive units or percentages depending on your design.
              w="full"
              bgColor="white"
              fill="rgba(149, 156, 177, 0.1)"
              // Stroke and mask-image are not directly supported through Chakra props. Consider inline styles or additional CSS.
              sx={{
                // This demonstrates how to apply more complex styles not directly available as Chakra props:
                stroke: "rgba(149, 156, 177, 0.1)", // example variable, adjust as necessary
                maskImage:
                  "linear-gradient(to bottom left, white 40%, transparent 50%)",
              }}
              yOffset={-96}
              interactive
            />} */}
          {!isAuthenticated && path !== "/" && <TopNav path={path} />}
          {!isAuthenticated && path === "/" && <AltTopNav path={path} />}
          {childrenElmnt}
        </Box>
      </MenuStructureContext.Provider>
      <FooterComp />
    </>
  );
};

export default AppLayout;
