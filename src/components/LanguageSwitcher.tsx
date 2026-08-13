import {
  Button,
  ButtonProps,
  HStack,
  Image,
  Menu,
  VStack,
  useBreakpointValue,
  useDisclosure,
  Portal,
  Text,
  Dialog
} from '@chakra-ui/react';
import { ChevronDownIcon } from '../components/icons/chakra';
import { navigate } from 'gatsby';
import { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { DialogCloseButton } from './DialogCloseButton';

import { usePageLocale } from '../contexts/locale';
import { defaultLocale, locales } from '../locales/messages';

/**
 * Flags live in static/images/flags as 4:3 SVGs taken from the MIT-licensed
 * flag-icons set. The file is named after the LOCALE, not the country, so the
 * mapping stays in one place: en -> the British flag, ja -> the Japanese one,
 * and de -> the Austrian one, because this is an Austrian company writing
 * Austrian German and the German flag was claiming otherwise.
 *
 * A flag is a country, not a language, so it never appears alone — every entry
 * is captioned with the language's own name.
 */
const flagSrc = (locale: string): string => `/images/flags/${locale}.svg`;

/**
 * The language's name in that language ("Deutsch", "Slovenščina", "日本語"),
 * from Intl rather than a hardcoded table, so adding a locale to the site
 * needs no edit here. Falls back to the bare code if the runtime has no data.
 */
const autonym = (locale: string): string => {
  try {
    const names = new Intl.DisplayNames([locale], { type: 'language' });
    const name = names.of(locale);

    if (!name || name === locale) return locale.toUpperCase();

    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  } catch {
    return locale.toUpperCase();
  }
};

/**
 * v2 typed this off MenuButton, which the trigger was (`as={Button}`). v3 has
 * no MenuButton and the trigger is the Button itself, so the props the callers
 * pass through are Button's.
 */
export interface LanguageSwitcherProps extends ButtonProps {}

/**
 * Lists the five site locales and navigates to the current page in the
 * chosen locale. The target path comes from the page context's
 * `translations`; when the current page has no translation entry the
 * switcher falls back to the locale root (`/{prefix}/`, `/` for the
 * default locale).
 */
const LanguageSwitcher: FC<LanguageSwitcherProps> = props => {
  const { locale: currentLocale, translations } = usePageLocale();
  const intl = useIntl();

  // aria-label prefix; the button itself shows a flag, which reads to a
  // screen reader as nothing at all.
  const controlLabel = intl.formatMessage({
    id: 'LanguageSwitcherLabel',
    defaultMessage: 'Sprache'
  });

  const currentBase = currentLocale.split(/[-_]/)[0]?.toLowerCase();

  const labels = useMemo(
    () => Object.fromEntries(locales.map(locale => [locale, autonym(locale)])),
    []
  );

  const pathForLocale = (locale: string): string => {
    const translation = translations.find(
      entry => entry.locale.split(/[-_]/)[0]?.toLowerCase() === locale
    );

    if (translation) {
      return translation.path;
    }

    return locale === defaultLocale ? '/' : `/${locale}/`;
  };

  const { open, onOpen, onClose } = useDisclosure();

  /**
   * The trigger. On a phone it opens a dialog, so it carries no chevron:
   * that arrow promises a list unfolding right below the button, which is
   * not what happens there.
   */
  const trigger = (onClick?: () => void) => (
    <Button
      variant="solid"
      size="sm"
      minH="10"
      // On a phone every control in the bar is the same 40px square, the
      // search and the hamburger included, so this one matches instead of
      // being the odd wide one. From lg it takes its natural width again.
      w={{ base: 10, lg: 'auto' }}
      minW={{ base: 10, lg: 'auto' }}
      px={{ base: 0, lg: 3 }}
      borderRadius="xl"
      filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
      color="white"
      aria-label={`${controlLabel}: ${labels[currentBase] ?? currentBase}`}
      onClick={onClick}
      {...props}
    >
      {/* A flex child shrinks by default, which squeezed the flag out of
          its 4:3 shape in the narrow button. Fixing the basis and forbidding
          the shrink keeps the proportions. */}
      <Image
        src={flagSrc(currentBase)}
        alt=""
        aria-hidden="true"
        w="22px"
        h="16.5px"
        minW="22px"
        flexShrink={0}
        borderRadius="2px"
        objectFit="cover"
        display="block"
        boxShadow="0 0 0 1px rgba(0,0,0,0.12)"
      />
    </Button>
  );

  /** One language, as a row. Shared by the menu and the dialog. */
  const row = (locale: string) => {
    const isCurrent = locale === currentBase;

    return (
      <HStack gap={3} w="full">
        <Image
          src={flagSrc(locale)}
          alt=""
          aria-hidden="true"
          w="22px"
          h="16.5px"
          minW="22px"
          flexShrink={0}
          borderRadius="2px"
          objectFit="cover"
          boxShadow="0 0 0 1px rgba(0,0,0,0.12)"
        />
        <Text flex="1" textAlign="left">
          {labels[locale] ?? locale}
        </Text>
        {isCurrent ? <Text aria-hidden="true">✓</Text> : null}
      </HStack>
    );
  };

  const go = (locale: string) => {
    if (locale !== currentBase) void navigate(pathForLocale(locale));
  };

  // On a phone a dropdown opens as a small list pinned to a button in a
  // crowded header. A dialog gives the choice the whole screen, which is
  // what picking a language deserves on the device where it is hardest to
  // hit a target. The breakpoint is read with a fallback so server and
  // client agree on the first paint.
  const isMobile = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' }
  );

  if (isMobile) {
    return (
      <>
        {trigger(onOpen)}
        <Dialog.Root
          open={open}
          size="xs"
          placement="center"
          onOpenChange={e => {
            if (!e.open) {
              onClose();
            }
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              {/*
                v3's dialog size names each sit one step further up the sizes
                scale than v2's modal ones (xs -> sizes.sm here, where v2's xs
                was sizes.xs), so `size="xs"` alone would widen this sheet from
                20rem to 24rem. maxW pins v2's width back on top of the recipe.
              */}
              <Dialog.Content mx={4} maxW="xs" borderRadius="xl">
                <Dialog.Header fontSize="md">{controlLabel}</Dialog.Header>
                {/* Was a childless <Dialog.CloseTrigger/>, which draws no X
                    at all. See DialogCloseButton. */}
                <DialogCloseButton />
                <Dialog.Body pb={6}>
                  <VStack gap={1} align="stretch">
                    {locales.map(locale => (
                      <Button
                        key={locale}
                        variant="ghost"
                        justifyContent="flex-start"
                        h="12"
                        borderRadius="lg"
                        fontWeight={
                          locale === currentBase ? 'semibold' : 'normal'
                        }
                        onClick={() => {
                          onClose();
                          go(locale);
                        }}
                      >
                        {row(locale)}
                      </Button>
                    ))}
                  </VStack>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </>
    );
  }

  return (
    <Menu.Root
      lazyMount
      unmountOnExit
      positioning={{
        placement: 'bottom-end'
      }}
    >
      {/* Same size, padding, radius and colour as the search control and the
          contact button beside it, so the header reads as one row of
          controls rather than three different ones. */}
      <Menu.Trigger asChild>
        <Button
          variant="solid"
          size="sm"
          minH="10"
          px={3}
          borderRadius="xl"
          filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
          color="white"
          aria-label={`${controlLabel}: ${labels[currentBase] ?? currentBase}`}
          // v2 spaced the chevron with iconSpacing on the rightIcon wrapper.
          // The icon is a plain child now, so the same 1.5 has to come from
          // the flex gap, which size="sm" would otherwise set to 2.
          gap={1.5}
          {...props}
        >
          <Image
            src={flagSrc(currentBase)}
            alt=""
            aria-hidden="true"
            width="22px"
            height="16.5px"
            borderRadius="2px"
            objectFit="cover"
            display="block"
            boxShadow="0 0 0 1px rgba(0,0,0,0.12)"
          />
          <ChevronDownIcon boxSize={4} display="block" />
        </Button>
      </Menu.Trigger>
      {/* The header rows carry their own stacking context, and an in-place
          MenuList paints underneath them. A portal lifts the list out to the
          body, above everything. */}
      <Portal>
        <Portal>
          <Menu.Positioner>
            {/* v2's MenuList also set color and zIndex; v3's menu recipe
                already carries both, but not the width. */}
            <Menu.Content minW="12rem">
              {/*
                The value is the item's identity in v3, not decoration: zag
                builds the DOM id as `${menuId}/${value}` and resolves both the
                click listener and onSelect with getElementById. The codemod's
                literal "item-0" gave all five rows one id, so row one ran
                go() for every locale and rows two to five were inert.
              */}
              {locales.map(locale => (
                <Menu.Item
                  key={locale}
                  onSelect={() => go(locale)}
                  value={locale}
                >
                  {row(locale)}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Portal>
    </Menu.Root>
  );
};

export default LanguageSwitcher;
