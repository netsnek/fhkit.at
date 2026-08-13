/**
 * The site's component recipes.
 *
 * Two different things live in this file and it is worth keeping them apart.
 *
 * Some recipes are ports of `components/*.ts`, the v2 `ComponentStyleConfig`
 * objects this theme has always carried. Those were pruned to what a call site
 * can actually select, counted rather than guessed: every `variant="..."`
 * string in the tsx files was collected, and the one dynamic case was read by
 * hand, because a literal grep misses it. That case is `Callouts.tsx:16`, which
 * renders `<Alert variant={type}>` with `type` defaulting to 'default', so all
 * four Alert variants are live even though only some appear as literals.
 *
 * Dropped entirely, each with zero call sites: Button's invisible,
 * ghost-hover-opacity, outline-hover-filled, pq-outline, pq-ghost, filledGreen,
 * filledYellow and filledRed; Link's hover-opacity, right-bottom-nav and
 * pq-footer; Menu's search-result; and the whole of the Input, InputGroup,
 * Textarea, Checkbox, Switch and Avatar configs, whose only variants are
 * `ghost`, `rounded`, `privacy`, `brand` and `square` and none of the five is
 * selected anywhere. The nine `variant="ghost"` uses in the site are all
 * Buttons, where ghost is a v3 built-in.
 *
 * The rest of the file restores a v2 built-in that this site never overrode and
 * therefore never wrote down. Those are here because v3 changed the default
 * underneath untouched call sites, which is a change nothing in the diff would
 * otherwise account for.
 *
 * Token paths are untouched. v3 resolves tokens by path, so every
 * `components.button.ghost.hover.bgColor` string here means what it did.
 */
import { defineRecipe, defineSlotRecipe } from '@chakra-ui/react';

/**
 * The six sizes the docs headings select, and why they are sizes at all.
 *
 * `main-content/heading` picks its size with a `fontSize` STYLE PROP, one flat
 * value per level, out of its own `variantFontSizes` map. That worked in v2,
 * which merged the styleConfig and the style props into one object before
 * serialising it, so a scalar prop replaced the styleConfig's whole responsive
 * `fontSize` and the emitted rule carried a single `font-size: 36px` with no
 * media query.
 *
 * v3 does not merge in that order. `cva()` runs the recipe through `css()`
 * first, which turns the default size's `fontSize: ['3xl', null, '4xl']` into a
 * flat entry plus an `@media screen and (min-width: 48rem)` key, and only then
 * are the style props merged on top. A style prop is prop-first while the
 * serialised recipe is condition-first, so the two never collide: the prop
 * overwrites the unconditional entry and the recipe's media rule wins again
 * from 768px up. Every docs heading would grow to 4xl on a tablet.
 *
 * A recipe variant has no such problem, because variants are merged as raw
 * style objects before the single `css()` call. `Heading.tsx` passes `size`
 * instead of `fontSize`, and a caller can still override with a `fontSize` prop
 * because there is no longer a media rule for it to lose to.
 *
 * `lineHeight` stays responsive because v2's did: the docs heading never
 * overrode it, so it kept size xl's `[1.33, null, 1.2]`.
 */
const docsHeadingSizes = Object.fromEntries(
  Object.entries({ h1: 36, h2: 30, h3: 24, h4: 20, h5: 18, h6: 16 }).map(
    ([level, px]) => [
      level,
      // A fresh array per level. `mergeWith` assigns array references straight
      // through and then mutates them in place on the next merge, so a shared
      // literal would be a live wire between the six entries.
      { fontSize: `${px}px`, lineHeight: [1.33, null, 1.2] }
    ]
  )
);

/**
 * The two non-docs headings that size themselves with a `fontSize` prop.
 *
 * Same mechanism as `docsHeadingSizes`, same remedy, two call sites.
 *
 * `card`        TestimonialHeading, the three partner cards on the home page.
 *               v2 rendered 20px throughout with the default size's own 1.33
 *               and 1.2 leading, because the prop replaced only the fontSize.
 *               v3 reads 36px from 768px up.
 * `menu-group`  SearchResultSection's group label inside the search overlay.
 *               v2: 12px throughout. v3: 36px from 768px up, a twelve-pixel
 *               label at thirty-six, reachable with the `/` key on any page.
 */
const siteHeadingSizes = {
  card: { fontSize: 'xl', lineHeight: [1.33, null, 1.2] },
  'menu-group': { fontSize: '12px', lineHeight: [1.33, null, 1.2] }
};

/**
 * v2's Heading size scale, restored.
 *
 * v2 mapped `size="md"` to fontSize xl (1.25rem); v3 maps it to textStyle md,
 * which is 1rem. Eleven headings in this site pass `size="md"` and every one of
 * them would quietly shrink by a fifth. The scale is v2's own, read off
 * `theme.components.Heading.sizes`.
 */
export const headingRecipe = defineRecipe({
  base: { fontFamily: 'heading', fontWeight: 'bold' },
  variants: {
    size: {
      '4xl': { fontSize: ['6xl', null, '7xl'], lineHeight: 1 },
      '3xl': { fontSize: ['5xl', null, '6xl'], lineHeight: 1 },
      '2xl': { fontSize: ['4xl', null, '5xl'], lineHeight: [1.2, null, 1] },
      xl: { fontSize: ['3xl', null, '4xl'], lineHeight: [1.33, null, 1.2] },
      lg: { fontSize: ['2xl', null, '3xl'], lineHeight: [1.33, null, 1.2] },
      md: { fontSize: 'xl', lineHeight: 1.2 },
      sm: { fontSize: 'md', lineHeight: 1.2 },
      xs: { fontSize: 'sm', lineHeight: 1.2 },
      ...docsHeadingSizes,
      ...siteHeadingSizes
    }
  }
});

/**
 * v2's stock Container was `{w: '100%', mx: 'auto', maxW: 'prose', px: '4'}`, a
 * flat 16px gutter at every width. v3's is `px: {base: '4', md: '6', lg: '8'}`,
 * so the gutter grows to 24px at md and to 32px at this site's pinned lg
 * (992px). The site registered no Container styleConfig, which is why nothing
 * in the diff mentions `px`: the default moved underneath twelve untouched call
 * sites.
 *
 * The responsive default is also unreachable by a prop, for the reason spelled
 * out on `docsHeadingSizes`. Restoring the scalar removes the `@media` keys and
 * prop overrides behave the way they did in v2 again.
 */
export const containerRecipe = defineRecipe({
  base: { px: '4' }
});

/**
 * The site's three live Button variants, plus the parts of v2's base and size
 * scale that v3 moved.
 *
 * `fontWeight`  v2's base was `semibold`, v3's is `medium`. Every button label
 *               in the site got one step lighter.
 * `borderWidth` v2's base had none. v3 adds 1px of transparent border to every
 *               button, which is 2px of width and 2px of height v2 never paid.
 * `lineHeight`  v2's base was 1.2. v3 keeps 1.2 in the base but then puts a
 *               `textStyle` in every size, and a textStyle carries its own
 *               line-height as a length, so the base loses.
 * `fontSize`    the same textStyle carries a size. v3's `md` is 14px where v2's
 *               was 16px, so every button that does not name a size shrank.
 * `gap`         v2 declared none and spaced icons with the `chakra-button__icon`
 *               span's own `margin-inline-end: 0.5rem`. The codemod turns every
 *               `leftIcon`/`rightIcon` into a plain child, so that span is gone
 *               and the margin with it. 8px is what v2 rendered.
 *
 * `h`, `minW` and `px` are v2's too: v3 moved xs from 6 to 8, sm from 8 to 9
 * and lg from 12 to 11, and shifted their paddings with them.
 */
export const buttonRecipe = defineRecipe({
  base: { fontWeight: 'semibold', borderWidth: 0 },
  variants: {
    /**
     * `textStyle: ''` is load-bearing, not leftover.
     *
     * A textStyle is expanded late and the expansion beats a `lineHeight`
     * declared beside it in the same object. Its `fontSize` does not win that
     * fight, which is the confusing part: setting only fontSize and lineHeight
     * gives v2's size with v3's leading. Blanking the textStyle first is what
     * lets both values through.
     */
    size: {
      lg: {
        textStyle: '',
        h: '12',
        minW: '12',
        fontSize: 'lg',
        px: '6',
        gap: 2,
        lineHeight: 1.2
      },
      md: {
        textStyle: '',
        h: '10',
        minW: '10',
        fontSize: 'md',
        px: '4',
        gap: 2,
        lineHeight: 1.2
      },
      sm: {
        textStyle: '',
        h: '8',
        minW: '8',
        fontSize: 'sm',
        px: '3',
        gap: 2,
        lineHeight: 1.2
      },
      xs: {
        textStyle: '',
        h: '6',
        minW: '6',
        fontSize: 'xs',
        px: '2',
        gap: 2,
        lineHeight: 1.2
      }
    },
    variant: {
      // v2's config added nothing to `solid` but the capitalisation, so the
      // rest of the variant stays v3's built-in.
      solid: { textTransform: 'capitalize' },
      /**
       * Every background below is spelled `bg`, not the `bgColor` v2 wrote,
       * and that is the whole reason these variants behave.
       *
       * v2 emitted declarations in source order: the variant's
       * `background-color` first, a call site's `bg` prop after it, and the
       * later shorthand won. v3's engine sorts the final declarations by
       * property, shorthands before longhands, so that a longhand can refine a
       * shorthand. A recipe's `background-color` is therefore emitted AFTER a
       * call site's `background` and quietly beats it, and a `bg` prop can
       * never override a `bgColor` recipe whatever the call site says.
       *
       * v3's own button recipe uses `bg` for exactly this reason. Matching it
       * also collapses the two rival declarations into one: `bg` here lands on
       * the same key as the default recipe's `bg` and replaces it, instead of
       * the pair sitting in the rule together.
       */
      'ghost-hover': {
        textTransform: 'capitalize',
        bg: 'transparent',
        opacity: 0.7,
        _hover: { bg: 'components.button.ghost.hover.bgColor', opacity: 1 },
        _focus: { bg: 'components.button.ghost.hover.bgColor', opacity: 1 }
      },
      'ghost-hover-outline': {
        textTransform: 'capitalize',
        bg: 'transparent',
        // v2 wrote `border: '1px solid'` with a separate borderColor. The base
        // above sets borderWidth 0 for every other variant, so this one asks
        // for it back explicitly.
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        color: 'components.button.ghostHoverOutline.color',
        _hover: {
          borderColor: 'components.button.ghostHoverOutline.hover.borderColor',
          color: 'components.button.ghostHoverOutline.hover.color'
        },
        _disabled: {
          opacity: 0.5,
          _hover: {
            borderColor: 'transparent',
            color: 'components.button.ghostHoverOutline.color'
          }
        },
        transition:
          'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out'
      },
      'pq-solid': {
        textTransform: 'capitalize',
        bg: 'brand.500',
        color: 'white',
        px: 5,
        borderRadius: 'lg',
        _hover: {
          transform: 'scale(1.05)',
          boxShadow: '3px 3px 10px rgba(2, 116, 192, 0.5)'
        },
        transition:
          'background-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
      }
    }
  }
});

/**
 * v2's Link base, restored where v3 diverges, plus the site's one live variant.
 *
 * `color`. v2's Link base was `color: 'inherit'` and the site never overrode
 * it, so every link on every page took the body colour. v3 dropped the base
 * declaration and moved colour into the variants: both `plain`, which is the
 * default variant and therefore what an unadorned `<Link>` selects, and
 * `underline` set `color: colorPalette.fg`. On its own that would be invisible,
 * because the variable resolves to nothing and an invalid custom property
 * leaves an inherited property inherited. Registering `html { colorPalette }`
 * in system.ts gives it a value, and every default-variant link in the site
 * would turn brand in one step.
 *
 * `hover-theme` does not need the same treatment. Chakra's variants are
 * exclusive within a group, so a link that selects it never picks up `plain`,
 * and it declares no colour of its own.
 *
 * `display`, `gap` and `alignItems`. v2's Link base declared none of the three,
 * so an `<a>` stayed inline and laid its children out in the normal flow. v3's
 * base is `display: inline-flex` with `gap: 1.5` and `alignItems: center`. The
 * last two are reset in their own right rather than left to be made inert by
 * `display: inline`, because a call site that sets its own display brings them
 * back to life.
 */
export const linkRecipe = defineRecipe({
  base: { display: 'inline', gap: 0, alignItems: 'normal' },
  variants: {
    variant: {
      plain: { color: 'inherit' },
      underline: { color: 'inherit' },
      'hover-theme': {
        _hover: { color: 'components.link._hover.color' },
        transition: 'color 0.1s ease-in-out'
      }
    }
  }
});

export const skeletonRecipe = defineRecipe({
  base: { borderRadius: 'md' }
});

/**
 * v2's UnorderedList and OrderedList, as a recipe.
 *
 * Both components are gone in v3 and the MDX renderer reaches for
 * `<List.Root as="ul">` instead. That is the right replacement for the markup
 * but it is not the same component: v2's UnorderedList was
 * `<List as="ul" styleType="initial" marginStart="1em">`, so the indent was
 * part of the component, not of the call site. Every bulleted list in the docs
 * loses 16px of indent when the component does.
 *
 * `display` is the second half. A plain `<ul>` is a block box and v2 left it
 * alone; v3's root is `display: flex` with `flexDirection: column`.
 *
 * A flat `marginInlineStart` rather than one scoped to `&:is(ul, ol)`, so a
 * call site can still override it with a prop.
 */
export const listSlotRecipe = defineSlotRecipe({
  slots: ['root', 'item', 'indicator'],
  base: {
    root: { display: 'block', marginInlineStart: '1em' }
  }
});

/**
 * v2's Kbd base, in the four places v3's differs. Measured on the shortcut
 * badge in the search input, which is the only Kbd the site renders.
 *
 * v2 sized the glyph relative to its context with `fontSize: '0.8em'` and
 * `px: '0.4em'`, and left `lineHeight: 'normal'`. v3 sets none of the three, so
 * the badge inherits the button's full size and line box and shrinks its
 * padding to a flat 4px. `wordSpacing` is v3's own addition.
 */
export const kbdRecipe = defineRecipe({
  base: {
    fontSize: '0.8em',
    lineHeight: 'normal',
    px: '0.4em',
    wordSpacing: 'normal'
  },
  // v3 gave Kbd a size axis v2 did not have, and every entry sets a textStyle
  // and a fixed height. Both have to go for the base above to be reachable.
  variants: {
    size: Object.fromEntries(
      ['sm', 'md', 'lg'].map(size => [size, { textStyle: '', height: 'auto' }])
    )
  }
});

/**
 * v2's Divider is v3's Separator, and it lost the one declaration the site
 * relies on: v2's baseStyle was `{opacity: 0.6, borderColor: 'inherit'}`, v3's
 * is `{display: 'block', borderColor: 'border'}`. The colour resolves to the
 * same grey in both, so only the opacity moved, and it moved on all seven
 * dividers that do not name their own.
 */
export const separatorRecipe = defineRecipe({
  base: { opacity: 0.6 }
});

/**
 * v2's Breadcrumb declared almost nothing: one base slot, `link`, carrying
 * `color: 'inherit'`. Everything the crumbs looked like came from the page
 * around them. v3's recipe is opinionated where v2's was empty:
 *
 *   list.color    `fg.muted`, so the separator chevrons darken.
 *   size.md.list  `textStyle: sm`, and a v3 textStyle is a pair, so it brings
 *                 `lineHeight: 1.25rem` where v2 inherited the unitless 1.5.
 *   size.md.list  `gap: 1.5` (6px). v2 had no gap and spaced the crumbs with
 *                 `mx` on the separator from Breadcrumb's `spacing` prop, which
 *                 defaults to 0.5rem. 8px on each side is `gap: 2`.
 *
 * `separator.opacity` is v3's too; v2's separator had none.
 *
 * `gap` and `lineHeight` sit in the size variant, not in `base`, because v3
 * declares both inside `size` and a variant is applied after the base it would
 * otherwise be overriding. All three sizes get the same pair because v2 had no
 * size axis here at all.
 */
export const breadcrumbSlotRecipe = defineSlotRecipe({
  slots: [
    'link',
    'currentLink',
    'item',
    'list',
    'root',
    'ellipsis',
    'separator'
  ],
  base: {
    list: { color: 'inherit' },
    separator: { color: 'inherit', opacity: 1 }
  },
  variants: {
    size: Object.fromEntries(
      ['sm', 'md', 'lg'].map(size => [
        size,
        { list: { gap: 2, lineHeight: 1.5 } }
      ])
    )
  }
});

export const tooltipSlotRecipe = defineSlotRecipe({
  slots: ['content'],
  base: {
    content: {
      borderRadius: 'md',
      bgColor: 'components.tooltip.bgColor',
      color: 'shared.text.default'
    }
  }
});

/**
 * v2's `container` slot is v3's `root`. All four variants are reachable through
 * `<Alert variant={type}>` in Callouts.tsx, which is the whole point of the
 * component: docs pages render callouts by type.
 */
export const alertSlotRecipe = defineSlotRecipe({
  slots: ['root', 'title', 'description', 'indicator', 'content'],
  variants: {
    variant: Object.fromEntries(
      ['default', 'info', 'warning', 'error'].map(kind => [
        kind,
        {
          root: {
            border: '1px solid',
            bgColor: `components.callout.${kind}.container.bgColor`,
            borderColor: `components.callout.${kind}.container.borderColor`,
            color: `components.callout.${kind}.container.color`
          }
        }
      ])
    )
  }
});

/**
 * v2's item/button/panel are v3's item/itemTrigger/itemContent.
 *
 * The `textAlign` and `fontSize` declarations are the site's own, ported
 * unchanged. Everything else restores a v2 base that v3 either dropped or
 * replaced, and none of it was written down in v2 for the usual reason: the
 * site never overrode it, so there was nothing to port.
 *
 * v2's accordion `button` base was `{fontSize: 'md', px: 4, py: 2}` and its
 * `panel` base `{pt: 2, px: 4, pb: 5}`. v3 keeps `py` but moves it into the
 * `size` variant, drops `px` from every variant except two, moves the panel's
 * padding onto the `itemBody` inside it, and adds `fontWeight: medium` and
 * `gap: 3` to the trigger that v2 never had.
 *
 * `lineHeight` is the one that moves the nav. v3's default `size` is `md`,
 * whose itemTrigger is `{textStyle: 'md', ...}`, and `textStyle: md` is a pair:
 * fontSize md AND lineHeight 1.5rem. This variant is applied after `size` and
 * its `fontSize: 'sm'` wins the first half, so the trigger ends up as 14px text
 * in a 24px line box where v2 inherited the unitless 1.5 and computed 21px. A
 * unitless value here restores the recomputation.
 *
 * `itemIndicator` needs two things v2 got for free. Its colour, because v3
 * paints the chevron `fg.subtle` where v2's AccordionIcon inherited. And
 * `display: flex`, because v2 put the rotation straight on the square glyph
 * while v3 wraps it in a block-level indicator whose height is the line box, so
 * a rectangle spins and lands the glyph off its own centre.
 */
export const accordionSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'item',
    'itemTrigger',
    'itemContent',
    'itemBody',
    'itemIndicator'
  ],
  variants: {
    variant: {
      leftNav: {
        root: { fontSize: 'sm' },
        item: { borderWidth: 0 },
        itemTrigger: {
          textAlign: 'left',
          fontSize: 'sm',
          lineHeight: 1.5,
          fontWeight: 'normal',
          px: 4,
          gap: 0
        },
        itemContent: {
          paddingTop: 0,
          paddingRight: 0,
          fontSize: 'sm',
          /**
           * v2's `reduceMotion`, and the 4px it was quietly worth.
           *
           * PageDirectory passes `reduceMotion` to v2's Accordion on purpose: a
           * panel toggled while the nav is hidden measures an open height of 0
           * and gets stuck expanded but invisible. v3 has no such prop and
           * drives the collapse from the recipe instead, so the guard is
           * reinstated here by taking the animation away.
           *
           * `overflow` is the half that shows up in a screenshot. v3 pairs the
           * animation with `overflow: hidden`, which makes itemContent a block
           * formatting context, and a BFC traps the margins of the items inside
           * it. With no animation left to clip, visible is both correct and
           * free.
           */
          overflow: 'visible',
          _open: { animationName: 'none' },
          _closed: { animationName: 'none' }
        },
        itemBody: { paddingTop: 0, paddingRight: 0, paddingLeft: 4 },
        itemIndicator: { color: 'inherit', display: 'flex' }
      }
    }
  }
});

/**
 * `theme-hover` has no literal call site but is the default variant, so it
 * reaches both menus in the site. `search-result` was the other half of the v2
 * config and has none: the search menu never selected it.
 */
export const menuSlotRecipe = defineSlotRecipe({
  slots: ['content', 'item', 'itemGroupLabel'],
  variants: {
    variant: {
      'theme-hover': {
        item: {
          _hover: {
            bgColor: 'leftNav.bottomNav.menu.item.active.bgColor',
            color: 'leftNav.bottomNav.menu.item.active.textColor'
          },
          _focus: {
            bgColor: 'leftNav.bottomNav.menu.item.active.bgColor',
            color: 'leftNav.bottomNav.menu.item.active.textColor'
          },
          transition:
            'background-color 0.1s ease-in-out, color 0.1s ease-in-out'
        }
      }
    }
  },
  defaultVariants: { variant: 'theme-hover' }
});
