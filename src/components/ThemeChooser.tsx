import { DarkMode, LightMode, useColorMode } from "./ui/color-mode";
import {
  Steps,
  Button,
  ButtonProps,
  ColorMode,
  Icon,
  IconProps,
  Menu,
  MenuProps,
  Portal,
} from '@chakra-ui/react';
import { FC, ReactNode, memo } from 'react';
import { LuCheck, LuMoon, LuSun } from 'react-icons/lu';

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
              value='item-0'>
              {mode}
              {isCurrentColorMode && (
                <Icon
                  as={LuCheck}
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
