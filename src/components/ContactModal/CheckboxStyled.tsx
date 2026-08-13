import { Checkbox } from '@chakra-ui/react';
import { forwardRef } from 'react';

const bgColor = '#EDEDF0';
const controlColor = '#4C589E';
const focusColor = '#B4BBE2';

const defaultClasses = ({ radius = '1px', controlRadius = '1px' }) => {
  return {
    h: '40px',
    px: '12px',
    w: 'fit-content',
    _checked: {
      bg: bgColor,
      h: '40px',
      px: '12px',
      borderRadius: radius
    },
    "span[class*='checkbox__control']:not([data-disabled])": {
      borderColor: controlColor,
      borderRadius: controlRadius,
      _checked: {
        bg: controlColor,
        borderColor: controlColor
      },
      _focus: {
        boxShadow: `0 0 0 2px ${focusColor}`,
        _checked: {
          boxShadow: `0 0 0 2px ${focusColor}`
        }
      },
      _after: {
        transitionProperty: 'all',
        // v2's `durations.normal`. v3 renamed the scale away, so 200ms is
        // spelled out rather than resolving to nothing.
        transitionDuration: '200ms',
        content: `""`,
        position: 'absolute',
        width: '0px',
        height: '0px',
        bg: `transparent`,
        borderRadius: radius,
        zIndex: -1
      }
    },
    _hover: {
      "span[class*='checkbox__control']:not([data-disabled])": {
        _after: {
          width: '40px',
          height: '40px',
          bg: bgColor,
          borderColor: controlColor
        }
      }
    }
  };
};

export interface CheckboxStyledProps
  extends Omit<Checkbox.RootProps, 'onChange'> {
  roundedFull?: boolean;
  rounded?: boolean;
  spacing?: Checkbox.RootProps['gap'];
  /**
   * Called with the new checked state.
   *
   * Named `onChange` because that is what react-hook-form's `Controller` hands
   * a field, and it takes a plain boolean rather than v3's
   * `{checked: CheckedState}` so the form stores `true`/`false` and its
   * `required` rule can judge it.
   */
  onChange?: (checked: boolean) => void;
}

export const CheckboxStyled = forwardRef<HTMLInputElement, CheckboxStyledProps>(
  (
    { children, spacing = '1rem', rounded, roundedFull, onChange, ...props },
    ref
  ) => {
    let classes = defaultClasses({});

    if (roundedFull) {
      classes = defaultClasses({ radius: '99px', controlRadius: '99px' });
    }

    if (rounded) {
      classes = defaultClasses({ radius: '8px', controlRadius: '2px' });
    }

    return (
      <Checkbox.Root
        gap={spacing}
        css={classes}
        // v2's Checkbox reported through `onChange` on the input and read
        // `isChecked`. v3's root reports through `onCheckedChange` and reads
        // `checked`, and `checked` is a CheckedState: `true`, `false` or
        // `"indeterminate"`. The caller only ever wants a boolean, so the
        // indeterminate case is folded into false here rather than at every
        // call site.
        onCheckedChange={details => onChange?.(details.checked === true)}
        {...props}
      >
        <Checkbox.HiddenInput ref={ref} />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>{children}</Checkbox.Label>
      </Checkbox.Root>
    );
  }
);
