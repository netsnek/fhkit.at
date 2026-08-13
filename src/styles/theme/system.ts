/**
 * fhkit.at's Chakra v3 system, in two flavours.
 *
 * `system` is what the site's own routes mount, through the branch in
 * gatsby-plugin-jaen's Layout. It carries the site's global styles.
 *
 * `chromeSystem` is the same tokens with no globals, and it exists for
 * SearchMenu, which is mounted through the Toolbar shadow INSIDE jaen's frame
 * and therefore also renders on CMS routes. v2 gave it a bare <ThemeProvider>,
 * which re-provided variables and nothing else. In v3 a provider is also the
 * global-style emitter, so handing SearchMenu the full `system` would push the
 * site's html and body rules onto every CMS route, which v2 never did.
 *
 * ONE THING CHANGES BEHAVIOUR HERE, and it is deliberate. In v2 this theme was
 * only ever mounted by SearchMenu's own <ThemeProvider>. The theme the rest of
 * the site ran on was the four-line stub in src/gatsby-plugin-jaen/theme/theme.ts,
 * which extended Chakra's base theme with a brand ramp and nothing else. So the
 * ~50 dotted token references in the JSX — `color="shared.text.default"`,
 * `borderBottomColor="topNav.borderColor"`, `color="pq.shared.section.color"` —
 * resolved on the six pages that render SearchMenu and silently fell back to an
 * inherited value on the other twelve. The literal string `topNav.borderColor`
 * is visible in the pre-migration build's HTML.
 *
 * Wiring the shadow to this system, the way netsnek.com has always had it, makes
 * those tokens resolve everywhere. That is what the theme was written for, and
 * it is the only way SearchMenu keeps its own appearance once its ThemeProvider
 * is gone. Colours on the twelve pages that never resolved them do change.
 *
 * Why the prefix stays `chakra`: several `defaultValue` strings in the sections
 * hard-code `var(--chakra-colors-brand-500)` for their accent marks. jaen takes
 * the `jaen` prefix instead. Two systems with disjoint prefixes cannot collide
 * whatever selector they land on, which is what replaces v2's cssVarsRoot
 * scoping.
 */
import { Steps, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import themeColors from './colors';
import themeFonts from './fonts';
import {
  accordionSlotRecipe,
  alertSlotRecipe,
  breadcrumbSlotRecipe,
  buttonRecipe,
  containerRecipe,
  headingRecipe,
  kbdRecipe,
  linkRecipe,
  listSlotRecipe,
  menuSlotRecipe,
  separatorRecipe,
  skeletonRecipe,
  tooltipSlotRecipe
} from './recipes';
import themeSemanticTokens from './semanticTokens/semanticTokens';
import { toV3SemanticTokens } from './semanticTokens/to-v3';

/**
 * The base colour scales the semantic layer references. These must be
 * registered before anything else, because an unresolvable `{colors.x.y}` is
 * not an error in v3: it emits `--var: colors\.x\.y`, a well-formed declaration
 * full of garbage. Miss `flat.se.green` or `gray.550` and a dozen tokens die
 * without a word.
 */
type TokenTree = { value: string } | { [key: string]: TokenTree };

const toTokenScale = (value: unknown): TokenTree =>
  typeof value === 'string'
    ? { value }
    : Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [
          k,
          toTokenScale(v)
        ])
      );

/**
 * fhkit.at's brand, which is NOT the orange scale in colors.ts.
 *
 * `colors.ts` carries the PhotonQ template's orange under both `brand` and
 * `theme`, and the site has never rendered the first of them. The theme shadow
 * overrode `brand` with Chakra's blackAlpha ramp and a hard `#0A0A0A` at 500,
 * and that near-black is what every build since has emitted and what the live
 * site shows. The ramp is reproduced here rather than inherited, because the
 * shadow that used to produce it is now a one-line re-export of this file.
 *
 * `theme.*` keeps the orange and stays available; a handful of tokens resolve
 * through it, which is what the "use theme instead of brand" comment in
 * colors.ts is about.
 */
const brandScale = {
  50: { value: 'rgba(0, 0, 0, 0.04)' },
  100: { value: 'rgba(0, 0, 0, 0.06)' },
  200: { value: 'rgba(0, 0, 0, 0.08)' },
  300: { value: 'rgba(0, 0, 0, 0.16)' },
  400: { value: 'rgba(0, 0, 0, 0.24)' },
  500: { value: '#0A0A0A' },
  600: { value: 'rgba(0, 0, 0, 0.48)' },
  700: { value: 'rgba(0, 0, 0, 0.64)' },
  800: { value: 'rgba(0, 0, 0, 0.80)' },
  900: { value: 'rgba(0, 0, 0, 0.92)' }
};

/**
 * The eight slots `colorPalette` resolves against, filled for `brand`.
 *
 * `html { colorPalette: 'brand' }` below is this migration's replacement for
 * v2's `withDefaultColorScheme({colorScheme: 'brand'})`, and on its own it is
 * inert: it maps the numeric ramp and nothing else, while every v3 recipe reads
 * the eight NAMED slots. Each of those references would emit
 * `var(--chakra-colors-color-palette-solid)` against a variable no rule defines.
 * A missing custom property is invalid at computed-value time, not an error, so
 * tsc and gatsby build stay green while solid buttons lose their contrast
 * colour, Tabs lose their indicator and every focus ring loses its colour.
 *
 * The light half of each slot is what v2's brand-schemed component produced,
 * read off @chakra-ui/theme rather than chosen:
 *
 *   solid     Button variantSolid  bg         mode(`${c}.500`, `${c}.200`)
 *   contrast  Button variantSolid  color      mode('white', 'gray.800')
 *   fg        Button variantGhost  color      mode(`${c}.600`, `${c}.200`)
 *   subtle    Button variantGhost  _hover.bg  mode(`${c}.50`,  transparentize…)
 *   muted     Button variantGhost  _active.bg mode(`${c}.100`, transparentize…)
 *
 * Two caveats, stated rather than glossed. The dark halves of `subtle` and
 * `muted` are NOT v2's: v2 used `transparentize(`${c}.200`, 0.12/0.24)`, an
 * alpha blend with no token spelling, and the 800/900 steps here are the
 * nearest opaque equivalent. `emphasized` and `border` have no v2 origin at
 * all. All three follow jaen's foundations/semantic-tokens.ts.
 *
 * Following jaen is not only for consistency: gatsby-plugin-jaen's system.ts
 * reads `semanticTokens.colors.brand` off THIS system through the theme shadow
 * and merges it into the CMS's own, where it overwrites jaen's eight slots. Any
 * value that diverges here silently re-colours the CMS chrome.
 *
 * The ramp stops at 900 because blackAlpha does, so `subtle` cannot reach for
 * the 950 that v3's own palettes use.
 */
const brandColorPalette = {
  solid: { value: { base: '{colors.brand.500}', _dark: '{colors.brand.200}' } },
  contrast: { value: { base: '{colors.white}', _dark: '{colors.gray.800}' } },
  fg: { value: { base: '{colors.brand.600}', _dark: '{colors.brand.200}' } },
  muted: { value: { base: '{colors.brand.100}', _dark: '{colors.brand.800}' } },
  subtle: { value: { base: '{colors.brand.50}', _dark: '{colors.brand.900}' } },
  emphasized: {
    value: { base: '{colors.brand.600}', _dark: '{colors.brand.300}' }
  },
  border: { value: { base: '{colors.brand.500}', _dark: '{colors.brand.400}' } },
  focusRing: {
    value: { base: '{colors.brand.500}', _dark: '{colors.brand.200}' }
  }
};

/**
 * v2's font stack, pinned.
 *
 * `fonts.ts` is empty, which in v2 meant "use @chakra-ui/theme's default", the
 * `-apple-system` system stack. v3's default is the same stack with `Inter`
 * prepended, a face the site never loads and never asked for, and v3
 * additionally hands `fonts.body` to `html` through the preflight, so the
 * change is not confined to elements that name the token. These three values
 * are @chakra-ui/theme's, verbatim. The site's own `fonts.ts` still wins if it
 * ever stops being empty.
 */
const v2Fonts = {
  heading: {
    value:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  },
  body: {
    value:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  },
  mono: {
    value:
      'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
  }
};

export const siteConfig = defineConfig({
  cssVarsPrefix: 'chakra',
  // dist/jaen.css still ships Tailwind's unlayered preflight, and an unlayered
  // normal declaration beats every cascade layer regardless of specificity.
  // Comes back out once the Tailwind bundle is gone.
  disableLayers: true,
  theme: {
    // v3 moved lg from 62em (992px) to 1024px. Pinned, or every responsive
    // array in the site shifts at a width nobody chose.
    breakpoints: {
      sm: '480px',
      md: '768px',
      lg: '992px',
      xl: '1280px',
      '2xl': '1536px'
    },
    tokens: {
      // The two helpers produce the shape v3 wants but cannot prove it to
      // TypeScript: Recursive<TokenSchema> is a conditional type over the
      // literal keys of the input, and both trees are built at runtime from
      // plain objects.
      /**
       * v2's `black`, pinned, then the site's own scales, then the brand ramp
       * the shadow used to supply.
       *
       * @chakra-ui/theme's `black` was `#000000`; v3's is `#09090B`. colors.ts
       * does not declare the token, so every `black` call site would silently
       * move three per cent off the value v2 painted. `white` is `#FFFFFF` in
       * both and is left to the default.
       */
      colors: {
        black: { value: '#000000' },
        ...toTokenScale(themeColors),
        brand: brandScale
      } as never,
      fonts: { ...v2Fonts, ...toTokenScale(themeFonts) } as never,
      /**
       * v2's `borders` scale, pinned.
       *
       * v3 renamed it to xs/sm/md/lg/xl and dropped the pixel keys, so
       * `border="1px"` no longer resolves. The literal `1px` is emitted
       * instead, which resets border-style to its initial `none` and paints
       * nothing, and v3's preflight `border-style: solid` on `*` loses to the
       * shorthand. The site writes `border="1px solid"` and `borderTop="1px
       * solid"` in a dozen places, plus `border` inside the Alert recipe.
       */
      borders: {
        '1px': { value: '1px solid' },
        '2px': { value: '2px solid' },
        '4px': { value: '4px solid' },
        '8px': { value: '8px solid' }
      },
      sizes: {
        /**
         * v3 dropped the `container.*` namespace, and an unresolvable size is
         * not an error: maxW would receive the literal string and the section
         * would go full-bleed. v2's four values.
         */
        container: {
          sm: { value: '640px' },
          md: { value: '768px' },
          lg: { value: '1024px' },
          xl: { value: '1280px' }
        }
      }
    },
    semanticTokens: {
      colors: {
        ...(toV3SemanticTokens(themeSemanticTokens.colors) as object),
        // `brand` is not one of the roots the site's own tree declares
        // (components, blueGradient, modals, pages, views, features, shared,
        // topNav, leftNav, main, rightNav, footer, pq), so this adds rather
        // than overwrites.
        brand: brandColorPalette
      } as never
    },
    recipes: {
      button: buttonRecipe,
      container: containerRecipe,
      heading: headingRecipe,
      kbd: kbdRecipe,
      link: linkRecipe,
      separator: separatorRecipe,
      skeleton: skeletonRecipe
    },
    slotRecipes: {
      accordion: accordionSlotRecipe,
      alert: alertSlotRecipe,
      breadcrumb: breadcrumbSlotRecipe,
      list: listSlotRecipe,
      menu: menuSlotRecipe,
      tooltip: tooltipSlotRecipe
    }
  }
});

/**
 * jaen's provider owns the reset and the shared `*` rules, and it is mounted on
 * every route. Stripping them from the base config here keeps the site's
 * provider emitting only what the site itself declares.
 */
const {
  globalCss: _jaenOwnsGlobals,
  preflight: _jaenOwnsPreflight,
  ...base
} = defaultConfig;

/** Mounted on site routes. Carries the site's globals. */
export const system = createSystem(
  base,
  siteConfig,
  defineConfig({
    preflight: false,
    globalCss: {
      /**
       * v2's reset, written out, because v3's is not a drop-in replacement.
       *
       * jaen's provider used to apply its reset to the whole document and now
       * scopes it to the CMS frame, which is correct: a CMS has no business
       * restyling the site around it. That leaves the site to supply its own,
       * and the honest one to supply is the one v2 actually had.
       *
       * The difference is one declaration and it is not cosmetic. v3's
       * preflight adds `font: inherit` to the universal rule. SVG presentation
       * attributes are author-origin with zero specificity, so they lose to any
       * CSS declaration at all: every inline SVG that sizes its text with a
       * `font-size` attribute has it overridden by the inherited 16px. This
       * site draws its logo, the Neurons background and six partner marks that
       * way.
       *
       * @chakra-ui/css-reset's own rule, verbatim.
       */
      '*, *::before, *::after': {
        borderWidth: '0',
        borderStyle: 'solid',
        boxSizing: 'border-box',
        wordWrap: 'break-word'
      },

      /**
       * The replacement for `withDefaultColorScheme({colorScheme: 'brand'})`,
       * which v3 dropped with no equivalent.
       *
       * This is the largest silent-failure risk in the migration. It is why the
       * site source contains almost no `colorScheme` prop at all: every Button,
       * Input, Checkbox and Switch was brand by default. Without this line they
       * all revert to v3's grey, and both tsc and gatsby build stay green while
       * they do it.
       */
      html: { colorPalette: 'brand' },
      /**
       * v2's body rule, restored.
       *
       * On v2 site routes this came from `<GlobalStyle/>` inside the site's own
       * emotion ThemeProvider, rendering @chakra-ui/theme's default
       * `styles.global.body`.
       *
       * `fontFamily` is the one that matters most. Without it the site inherits
       * the `html { font-family: ... }` that jaen's preflight sets, which is
       * jaen's own face, on every word of every site route.
       *
       * `chakra-body-bg` is `{white, _dark: gray.800}`, which is exactly what
       * `shared.body.bgColor` already is. `chakra-body-text` is
       * `{gray.800, _dark: whiteAlpha.900}`, which `shared.text.default` is NOT
       * — its dark half is gray.400. That token stays as it is, because several
       * components read it and read it in v2 too; the body takes v2's pair
       * directly instead.
       *
       * lineHeight is not restored: v2 set `lineHeights.base` (1.5) here, and
       * v3's preflight already puts 1.5 on `html`.
       */
      body: {
        fontFamily: 'body',
        bg: 'shared.body.bgColor',
        color: { base: 'gray.800', _dark: 'whiteAlpha.900' },
        transitionProperty: 'background-color',
        // v2's `durations.normal`. v3's scale renamed it away (fastest, faster,
        // fast, moderate, slow, slower, slowest), so the value is spelled out.
        transitionDuration: '200ms'
      }
    }
  })
);

/** The v3 spelling of v2's bare <ThemeProvider>: tokens, no globals. */
export const chromeSystem = createSystem(base, siteConfig);
