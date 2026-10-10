import { Box, Collapsible, Flex, Spacer } from '@chakra-ui/react';
import React, { FC } from 'react';
import PageDirectory from './page-directory/PageDirectory';
import NavbarControls from './NavbarControls';
import { Global } from '@emotion/react';
import useNavOffset from '../../hooks/use-nav-offset';
import { useMenuStructureContext } from '../../contexts/menu-structure';
import { useLocation } from '@reach/router';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * The mobile navigation drawer.
 * This is used for mobile devices and contains the site's menu.
 */
const MobileNavDrawer: FC<MobileNavDrawerProps> = ({
  isOpen,
  onOpen,
  onClose
}) => {
  const { menuStructure } = useMenuStructureContext();
  const navOffset = useNavOffset();
  const { pathname } = useLocation();

  return (
    <>
      <Global
        styles={{
          body: {
            overflow: isOpen ? 'hidden' : 'auto'
          }
        }}
      />
      <Box position="fixed" top={`calc(64px)`} left={0} zIndex={3}>
        <Collapsible.Root open={isOpen}>
          <Collapsible.Content>
            <Flex
              direction="column"
              w="100vw"
              h={`calc(100vh - ${navOffset})`}
              bg="shared.body.bgColor"
              pt={9}
              px={9}
              overflowY="scroll"
            >
              <Box>
                <PageDirectory
                  isMobile
                  closeMobileDrawer={onClose}
                  data={menuStructure}
                  path={pathname}
                />
              </Box>
              <Spacer />
              <NavbarControls isMobile />
            </Flex>
          </Collapsible.Content>
        </Collapsible.Root>
      </Box>
    </>
  );
};

export default MobileNavDrawer;
