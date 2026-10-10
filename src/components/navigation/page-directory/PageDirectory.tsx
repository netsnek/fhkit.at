import { useAuth } from 'jaen';
import { Accordion, Box, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { FC, Fragment, useMemo, useState } from 'react';
import {
  createPageTree,
  getExpandedMenuItemIndices
} from '../../../utils/navigation';
import { NavMenuItem, NavMenuSection } from '../../../utils/navigation/types';
import { generateMenuItem } from './utils/pageDirectory';

interface PageDirectoryProps {
  data: ReturnType<typeof createPageTree>;
  isExpanded?: boolean;
  isMobile?: boolean;
  closeMobileDrawer?: () => void;
  path?: string;
}
/**
 * The page directory component that shows the documentation structure.
 */
const PageDirectory: FC<PageDirectoryProps> = ({
  data,
  isExpanded = true,
  isMobile = false,
  closeMobileDrawer,
  path
}) => {
  // Calculate the default expanded indices for the accordion
  const defaultExpandedIdx = useMemo(() => {
    return data.menu ? getExpandedMenuItemIndices(data.menu) : [];
  }, [data.activeIdx]);

  // Keep track of the items that have been expanded by the user
  const [expandedIdx, setExpandedIdx] = useState<number[]>(defaultExpandedIdx);
  const { isAuthenticated } = useAuth();
  const isSmallScreen = useBreakpointValue(
    { base: true, md: false },
    { fallback: 'false' }
  );

  const updateExpandedIdx = (idx: number, mode: 'toggle' | 'set') => {
    const isIncluded = expandedIdx.includes(idx);
    if (mode === 'toggle' && isIncluded) {
      setExpandedIdx(expandedIdx.filter(i => i !== idx));
      return;
    }
    if (!isIncluded) setExpandedIdx([...expandedIdx, idx]);
  };

  const baseMenuItems: NavMenuSection[] = [
    {
      name: 'More',
      icon: <FaLink />,
      items: [
        {
          name: 'Netsnek',
          href: '/'
        }
      ]
    }
  ];

  if (path === '/') {
    baseMenuItems.unshift({
      name: 'Navigation',
      items: [
        {
          name: 'Documentation',
          href: '/docs'
        }
      ]
    });
  }

  if (isSmallScreen && !isAuthenticated) {
    // The same full page load as the top bar's entry, for the same reason:
    // signinRedirect throws outside jaen's sign-in routes.
    const item = {
      name: 'Sign In',
      href: '/login/',
      reload: true
    };
    const section = baseMenuItems.find(bmi => bmi.name === 'Navigation');

    if (section) {
      section.items.unshift(item);
    } else {
      baseMenuItems.unshift({
        name: 'Navigation',
        items: [item]
      });
    }
  }

  let menuRootExpandedIdx = 0;

  return (
    <Accordion.Root
      id="left-nav-accordion"
      visibility={isExpanded ? 'visible' : 'hidden'}
      opacity={isExpanded ? 1 : 0}
      w={isExpanded ? '100%' : 'max-content'}
      multiple
      css={{
        // Remove border from last accordion item
        '& .chakra-accordion__item:last-child': {
          borderBottomWidth: 0
        }
      }}
      variant="leftNav"
      transition="opacity 0.2s ease-in-out, width 0.2s ease-in-out"
      mb={isMobile ? 12 : undefined}
      value={expandedIdx}
    >
      {[...data.menu, ...baseMenuItems].map((section, i) => (
        <Fragment key={i}>
          {section.name && (
            <HStack
              key={0}
              gap={2}
              ml={4}
              mt={i === 0 ? 0 : 9}
              fontSize="sm"
              fontWeight="bold"
              {...section.styling}
              color="components.pageDirectory.section.title.color"
              opacity={1}
            >
              <Text>{section.name}</Text>
              {section.icon}
            </HStack>
          )}
          <Box key={1}>
            {section.items?.map((item: NavMenuItem) => {
              const res = generateMenuItem(
                item,
                isMobile,
                updateExpandedIdx,
                menuRootExpandedIdx,
                closeMobileDrawer
              );
              menuRootExpandedIdx = res.idx++;
              return res.item;
            })}
          </Box>
        </Fragment>
      ))}
    </Accordion.Root>
  );
};

export default PageDirectory;
