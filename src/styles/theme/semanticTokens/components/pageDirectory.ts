/**
 * Moved out of `theme/components/`, which held v2 `ComponentStyleConfig`
 * objects and is gone. This was never one of those: it is a semantic-token
 * subtree, and `semanticTokens.ts` has always imported it as such.
 */
const smtPageDirectoryComponent = {
  section: {
    title: {
      color: {
        default: 'theme.500',
        _dark: 'theme.600'
      }
    }
  }
};

export default smtPageDirectoryComponent;
