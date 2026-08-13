/**
 * THE SHADOW POINT.
 *
 * gatsby-plugin-jaen fixes this path. A system exported from anywhere else
 * would silently orphan itself and leave the CMS chrome on jaen's own default.
 *
 * What a shadow must export changed in v3. It is no longer a theme object but
 * a SystemContext from createSystem(), and gatsby-plugin-jaen asserts that with
 * `isValidSystem` before using it, then reads `theme.tokens.colors.brand` and
 * `theme.semanticTokens.colors.brand` off it to colour the CMS.
 *
 * The same export is also what the site's own routes mount, through the branch
 * in gatsby-plugin-jaen's Layout, so this one line decides both.
 *
 * Until now this file was a four-line stub that extended Chakra's base theme
 * with a brand ramp and ignored src/styles/theme entirely. See the header of
 * the file it now points at for what that changes.
 */
import { system } from '../../styles/theme/system';

export default system;
