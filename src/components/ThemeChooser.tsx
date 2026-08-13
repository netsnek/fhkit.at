import { CheckIcon, MoonIcon, SunIcon } from './icons/chakra';
import { ColorMode, DarkMode, LightMode, useColorMode } from 'jaen';
import { Button,
  ButtonProps,
  Icon,
  IconProps,
  Menu,
  MenuProps,
  Portal,
} from '@chakra-ui/react';
import { FC, ReactNode, memo } from 'react';

interface IThemeChooserProps {
  menuProps?: Partial<MenuProps>;
  buttonProps?: Partial<ButtonProps>;
  buttonIconProps?: IconProps;
  buttonContent?: ReactNode;
  forceMenuColorMode?: ColorMode;
}

/**
 * The theme toggle component including a menu with the available theme options.
 */
const ThemeChooser: FC<IThemeChooserProps> = ({
  menuProps,
  buttonProps,
  buttonIconProps,
  buttonContent,
  forceMenuColorMode
}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const isLightColorMode = colorMode === 'light';

  const menuList = (() => {
    const list = (
      <Portal><Menu.Positioner><Menu.Content>
            <MemoizedColorModeMenuItems
              currentColorMode={colorMode}
              toggleColorMode={toggleColorMode}
            />
          </Menu.Content></Menu.Positioner></Portal>
    );
    if (!forceMenuColorMode) {
      return list;
    }

    if (forceMenuColorMode === 'dark') {
      return <DarkMode>{list}</DarkMode>;
    }
    return <LightMode>{list}</LightMode>;
  })();

  return (
    <Menu.Root
      id="navbar-color-mode-menu"
      {...menuProps}
      lazyMount
      unmountOnExit
      positioning={{
        placement: 'top'
      }}>
      <Menu.Trigger asChild><Button
          size="sm"
          flexGrow={1}
          variant="ghost-hover"
          textAlign="left"
          color="shared.text.default"
          {...buttonProps}>
          <Icon as={isLightColorMode ? SunIcon : MoonIcon} {...buttonIconProps} />
          {buttonContent}
        </Button></Menu.Trigger>
      {menuList}
    </Menu.Root>
  );
};

const colorModes = ['Light', 'Dark', 'System'];
//TODO: Fix system color mode toggle (doesnt work - doesnt stay in sync with system)
/**
 * Memoized color mode menu items.
 */
const MemoizedColorModeMenuItems = memo<{
  currentColorMode: ColorMode;
  toggleColorMode: () => void;
}>(
  ({ currentColorMode, toggleColorMode }) => {
    return (
      <>
        {colorModes.map((mode, i) => {
          const isCurrentColorMode =
            currentColorMode === mode.toLocaleLowerCase();
          return (
            <Menu.Item
              key={i}
              position="relative"
              disabled={isCurrentColorMode}
              onSelect={!isCurrentColorMode ? toggleColorMode : undefined}
              // `value` is the item's DOM identity, not a label: zag builds the
              // element id as `${menuId}/${value}` and resolves onSelect by
              // getElementById. The codemod stamped the literal 'item-0' on
              // every row of this map, so all of them shared one id and only
              // the first was reachable.
              value={mode.toLocaleLowerCase()}>
              {mode}
              {isCurrentColorMode && (
                <Icon
                  as={CheckIcon}
                  position="absolute"
                  right={3}
                  top="50%"
                  transform="translateY(-50%)"
                  boxSize="10px" />
              )}
            </Menu.Item>
          );
        })}
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.currentColorMode === nextProps.currentColorMode
);

export default ThemeChooser;
