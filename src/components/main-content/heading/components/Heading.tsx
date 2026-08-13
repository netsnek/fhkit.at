import { Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps,
  HeadingProps,
  ResponsiveValue,
  ThemeTypings,
} from '@chakra-ui/react';
import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { IMainContentComponentBaseProps } from '../../types/mainContent';
import { Link } from 'gatsby-plugin-jaen';
import FaHashtag from '../../../icons/fontawesome/FaHashtag';

// Font sizes for the different heading variants
export const variantFontSizes = {
  h1: '36',
  h2: '30',
  h3: '24',
  h4: '20',
  h5: '18',
  h6: '16'
};

const variantLinkFontSizes = {
  h1: '30',
  h2: '24',
  h3: '18',
  h4: '16',
  h5: '14',
  h6: '12'
};

export interface IHeadingProps
  extends IMainContentComponentBaseProps,
    HeadingProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
  noAnchor?: boolean;
  customSpacing?: ChakraHeadingProps['mt'];
  noSpacing?: boolean;
  activeLink?: boolean;
  setActiveLink?: () => void;
  children?: ReactNode;
}

/**
 * Component for displaying different heading variants and sizes.
 */
const Heading: FC<IHeadingProps> = ({
  baseProps,
  variant = 'h2',
  id,
  noAnchor,
  customSpacing,
  noSpacing,
  activeLink,
  setActiveLink,
  children,
  ...compProps
}) => {
  let props: ChakraHeadingProps = {};
  if (variant === 'h2') {
    props = {
      ...props,
      borderBottom: '1px solid',
      borderColor: 'components.separator.borderColor',
      pb: 2
    };
  }

  /**
   * Handles the click event on the heading link.
   *
   */
  const handleClick = () => {
    if (!activeLink && setActiveLink) setActiveLink();
  };

  return (
    <ChakraHeading
      {...baseProps}
      {...props}
      as={variant}
      id={id}
      /**
       * A recipe size, not a fontSize prop, and the difference is load-bearing.
       *
       * v2 merged the styleConfig and the style props into one object before
       * serialising it, so a scalar `fontSize` replaced the recipe's whole
       * responsive value and the rule carried a single `font-size: 36px`.
       *
       * v3 runs the recipe through css() FIRST, which turns the default size's
       * `fontSize: ['3xl', null, '4xl']` into a flat entry plus an
       * `@media (min-width: 48rem)` key, and only then merges the style props.
       * A prop only overwrites the unconditional entry, so from 768px up the
       * recipe won it straight back and every docs heading grew to 4xl. The six
       * h1-h6 sizes live in headingRecipe for exactly this reason; a caller can
       * still override with `fontSize`, because there is no media rule left for
       * it to lose to.
       */
      size={variant}
      // mt={!noSpacing ? customSpacing ?? baseProps?.marginTop : 0}
      // mb="4"
      _hover={{
        '& a': {
          opacity: 1
        }
      }}
      {...compProps}
    >
      {children}
      {!noAnchor && id && (
        <Link
          to={`#${id}`}
          aria-label={`Link to ${children}`}
          position="relative"
          ml={1}
          opacity={activeLink ? 1 : 0}
          color="components.heading.link.color.default"
          fontSize={`${variantLinkFontSizes[variant]}px`}
          lineHeight={Number(variantLinkFontSizes[variant]) + 5 + 'px'}
          verticalAlign="top"
          onClick={handleClick}
        >
          <FaHashtag />
        </Link>
      )}
    </ChakraHeading>
  );
};
Heading.defaultProps = {
  baseProps: {
    mt: 8
  }
};

export default Heading;
