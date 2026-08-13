import { Portal, Tooltip as ChakraTooltip } from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';

export interface TooltipProps extends ChakraTooltip.RootProps {
  /** The tooltip text. v2 called this `label`. */
  content: ReactNode;
  /** The element the tooltip is attached to. */
  children: ReactNode;
  showArrow?: boolean;
  portalled?: boolean;
  contentProps?: ChakraTooltip.ContentProps;
}

/**
 * v2's single `<Tooltip label>` element, rebuilt on v3's parts.
 *
 * v3 split Tooltip into Root, Trigger, Positioner, Content and Arrow, and the
 * codemod rewrites every call site to `@/components/ui/tooltip`, the Chakra
 * CLI snippet. This site does not use the snippets: jaen owns the provider and
 * pulling in `components/ui/*` would mean a second set of primitives beside the
 * ones the theme already styles. The wrapper lives here instead, with the API
 * the codemod expects, so the three call sites read the way they did in v2.
 *
 * `asChild` on the trigger is what keeps the DOM the same shape as v2's: the
 * trigger becomes the child element rather than wrapping it in another button,
 * which would nest an IconButton inside a button in AltTopNav.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      content,
      children,
      showArrow,
      portalled = true,
      contentProps,
      ...rest
    } = props;

    const positioner = (
      <ChakraTooltip.Positioner>
        <ChakraTooltip.Content ref={ref} {...contentProps}>
          {showArrow && (
            <ChakraTooltip.Arrow>
              <ChakraTooltip.ArrowTip />
            </ChakraTooltip.Arrow>
          )}
          {content}
        </ChakraTooltip.Content>
      </ChakraTooltip.Positioner>
    );

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        {portalled ? <Portal>{positioner}</Portal> : positioner}
      </ChakraTooltip.Root>
    );
  }
);
