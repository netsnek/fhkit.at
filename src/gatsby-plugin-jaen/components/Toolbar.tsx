import { Steps, ChakraProvider } from '@chakra-ui/react';
import SearchMenu from '../../components/search-menu';
import { chromeSystem } from '../../styles/theme/system';

export interface ToolbarProps {}

/**
 * The single position where the site's tokens are provided inside jaen's frame.
 *
 * SearchMenu used to carry its own `<ThemeProvider theme={theme}>`, which in v2
 * re-provided variables and nothing else. In v3 a provider also emits the whole
 * token block every time it mounts, so keeping it at the one position that
 * actually needs it avoids duplicating that block on every page.
 *
 * `chromeSystem` rather than `system` on purpose: the Toolbar renders inside
 * jaen's frame and therefore on CMS routes too, and the full system would push
 * the site's html and body rules onto those, which v2 never did.
 */
export const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <ChakraProvider value={chromeSystem}>
      <SearchMenu />
    </ChakraProvider>
  );
};
