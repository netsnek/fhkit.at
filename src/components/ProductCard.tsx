import {
  AspectRatio,
  Badge,
  Box,
  BoxProps,
  Flex,
  HStack,
  Image,
  Spacer,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { Link as GatsbyLink } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import React from 'react';
import { v1 as uuidv1 } from 'uuid';

//import { useWholesaleUser } from '../../../hooks/use-wholesale-user'

import { css } from '@emotion/react';
import { Field } from '@atsnek/jaen';

const borderColor = (color?: string) => (color ? color : '#f77f00');
const transformWidth = (width?: string) =>
  width ? 'scaleX(1.' + width.split('%')[0] + ')' : 'scaleX(1.3)';
const borderlinWidth = (width?: string) => (width ? width : '30%');

export const cardStyle = (
  borderline?: boolean,
  bwidth?: string,
  color?: string,
  left?: boolean
) => css`
  .pcard {
    display: block;
    position: relative;
    border-collapse: collapse;
    text-decoration: none;
    transition: all 150ms;
    z-index: 1;

    * {
      text-decoration: none;
    }

    .borderline {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      right: 0%;
      border-collapse: collapse;
      text-decoration: none;

      &:before {
        box-sizing: border-box;
        transition: all 150ms;
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        left: 50%;
        margin-left: -50%;
        top: 0%;
        border-color: rgba(255, 255, 255, 0);
        border-style: solid;
        border-width: 0 2px;
        border-radius: var(--chakra-radii-2xl);
        background-color: #fff;
        z-index: 1;
      }

      &:after {
        box-sizing: border-box;
        transition: all 150ms;
        position: absolute;
        content: '';
        width: 50%;
        height: 100%;
        left: 50%;
        margin-left: -25%;
        top: 0;
        border-color: rgba(255, 255, 255, 0);
        border-style: solid;
        border-width: 2px 0;
        border-radius: var(--chakra-radii-2xl);
      }
    }

    .bspacer {
      ${left ? 'left: 0' : 'right: 0'}
    }

    .imgline {
      opacity: 0;
      z-index: 1;
      top: 0;
      ${left ? 'right: calc(100% * (1/1.3));' : 'left: calc(100% * (1/1.3));'}
      width: calc(${borderlinWidth(bwidth)} * (1/1.3));
    }

    &:hover {
      transform: scale(1.03);
      z-index: 2;
    }

    &:hover .borderline {
      position: absolute;
      top: 0;
      animation: ${left ? 'scale-up-hor-left' : 'scale-up-hor-right'} 200ms
        cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
      ${borderline ? '' : 'animation: none;'}
    }

    &:hover .borderline:after {
      width: 100%;
      margin-left: -50%;
      border-color: ${borderColor(color)};
    }

    &:hover .borderline:before {
      height: calc(100% - 4px);
      top: 2px;
    }
    &:hover .imgline {
      ${borderline ? '' : 'display: none;'}
      opacity: 1;
      animation: opacity-up-hor 400ms ease-in 0ms 1 normal none;
    }
    .radioimg {
      display: none;
    }
    .radioimg + .preview {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      opacity: 0;
      height: 100%;
      width: 100%;
      transition: all 350ms;
    }
    .radioimg:checked + .preview {
      opacity: 1;
    }
    .radioimg + .main {
      opacity: 0;
      transition: all 350ms;
    }
    .radioimg:checked + .main {
      opacity: 1;
    }
  }

  @keyframes opacity-up-hor {
    0% {
      opacity: 0;
    }
    70% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes scale-up-hor-right {
    0% {
      transform: scaleX(1.03);
      transform-origin: 0% 0%;
    }
    100% {
      transform: ${transformWidth(bwidth)};
      transform-origin: 0% 0%;
    }
  }

  @keyframes scale-up-hor-left {
    0% {
      transform: scaleX(1.03);
      transform-origin: 100% 0%;
    }
    100% {
      transform: ${transformWidth(bwidth)};
      transform-origin: 100% 0%;
    }
  }
`;

export interface ProductCardProps {
  product: any; // Replace ShopifyProduct with your product type
  borderline?: boolean;
  left?: boolean;
  bwidth?: string;
  bcolor?: string;
  prefixPath?: string;
}

export const ProductCard = ({
  product,
  borderline,
  left,
  bwidth,
  bcolor,
  prefixPath
}: ProductCardProps) => {
  const prefixPathTrimmed = prefixPath
    ? prefixPath.trim().replace(/\/+$/, '')
    : '';
  const path = `${prefixPathTrimmed}/${product.handle}`;

  const radioRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Replace getProductTags with your logic
  const tags = product.tags || [];

  // Replace getFormattedProductPrices with your logic
  const prices = {
    priceFormatted: product.price,
    compareAtPriceFormatted: product.compareAtPrice,
    discountFormatted: product.discount
  };

  const isWholesale = true; //useWholesaleUser()

  // Adapt taxable logic based on your product structure
  const taxable = isWholesale ? false : product.taxable;

  const cardId = uuidv1();

  if (product.media.length === 0) {
    borderline = false;
  }
  borderline = true;

  const coloredBadges: Array<{ name: string; color: string; bg: string }> = [];

  if (
    new Date(product.createdAt).getTime() >
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ) {
    coloredBadges.push({ name: 'Neu', color: 'white', bg: 'brand.500' });
  }

  if (prices.discountFormatted) {
    coloredBadges.push({
      name: prices.discountFormatted,
      color: 'white',
      bg: 'agt.red'
    });
  }

  console.log('faaaak', product.media.slice(0, 3));

  return (
    <VStack
      as={GatsbyLink}
      to={path}
      display={'block'}
      css={cardStyle(borderline, bwidth, bcolor, left)}
      boxSize={'full'}
      cursor="pointer"
      // bg="red"
      textAlign={{
        base: 'center',
        md: 'left'
      }}
    >
      <Box
        className="pcard"
        position="relative"
        cursor="pointer"
        bg="primary"
        px={{ base: '1', md: '2', lg: '3' }}
        py="5"
        // h={'full'}
        minH={'full'}
        borderRadius="2xl"
        // boxShadow="lg"
        // border="1px"
        // borderColor="#f9f9f9"
        // mt="3"
      >
        <Box position="relative">
          <AspectRatio ratio={10 / 9}>
            <>
              <input
                type="radio"
                className="radioimg"
                name={'imgbox-' + cardId}
                id={'imgbox-' + cardId + '-' + 0}
                key={0}
                ref={el => (radioRef.current[0] = el)}
                readOnly
                checked
              ></input>
              <ImageBoxWithTags
                image={product.featuredMedia?.image}
                tags={coloredBadges}
                className="main"
              />
            </>
          </AspectRatio>

          {product.media.slice(0, 3).map((media: any, index: number) => (
            <Box key={index}>
              {index !== 0 && (
                <Box>
                  <input
                    type="radio"
                    className="radioimg"
                    name={'imgbox-' + cardId}
                    id={'imgbox-' + cardId + '-' + index}
                    ref={el => (radioRef.current[index] = el)}
                  />
                  <ImageBoxWithTags
                    image={media.image}
                    tags={coloredBadges}
                    className="preview"
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>

        <Text fontSize="sm" noOfLines={1}>
          {tags.otherString}
        </Text>
        <Text fontWeight="semibold">{product.title}</Text>
        <Text fontWeight="normal">{product.description}</Text>
        {/*{product.price}
        <Text fontSize="xs" color="gray.600" textAlign={'center'}>
          {taxable ? 'inkl.' : 'exkl.'} Ust.
        </Text>*/}
        <Spacer
          position="absolute"
          className="bspacer"
          w="0"
          h="90%"
          top="5%"
          borderLeft="1px"
          borderColor="#f9f9f9"
          transform="scale(0.97)"
        />
        <Box
          className="borderline"
          cursor="pointer"
          bg={useColorModeValue('white', 'gray.700')}
          px={{ base: '1', md: '2', lg: '3' }}
          py="5"
          // h={'full'}
          // minH={'full'}
          borderRadius="2xl"
          border="1px"
          borderColor="#f9f9f9"
          boxShadow="sm"
        >
          <VStack
            className="imgline"
            position="absolute"
            opacity="0"
            boxSize={'full'}
            py="calc(var(--chakra-space-5) - 2px)"
            px="1"
          >
            {product.media.slice(0, 3).map((media: any, index: number) => (
              <label htmlFor={'imgbox-' + cardId + '-' + index} key={index}>
                <Box
                  transform="scale(0.97)"
                  borderBottom="1px"
                  borderColor="#f9f9f9"
                  _hover={{ borderColor: 'agt.red' }}
                  onMouseOver={() => (radioRef.current[index]!.checked = true)}
                  onMouseLeave={() => (radioRef.current[0]!.checked = true)}
                >
                  {/* <GatsbyImage
                    onDragStart={e => e.preventDefault()}
                    draggable="false"
                    image={media.image.gatsbyImageData}
                    alt={media.image.altText || ''}
                  /> */}
                  <Image
                    onDragStart={e => e.preventDefault()}
                    draggable="false"
                    src={media.image.src}
                    alt={media.image.altText || '-'}
                    style={{
                      height: 'auto',
                      width: 'full',
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />
                  {/* {media.image.defaultValue && (
                    <Field.Image
                      //onDragStart={e => e.preventDefault()}
                      //draggable="false"
                      //src={image.gatsbyImageData.images.fallback?.src}
                      //sizes={image.gatsbyImageData.images.fallback?.sizes}
                      //srcSet={image.gatsbyImageData.images.fallback?.srcSet}
                      name={media.image.name} //{media.image.name}
                      isDisabled
                      defaultValue={media.image.defaultValue}
                      alt={media.image.altText || 'Product Image'}
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center'
                      }}
                    />
                  )} */}
                </Box>
              </label>
            ))}
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
};

function ImageBoxWithTags(
  props: {
    image?: {
      src: string;
      gatsbyImageData: IGatsbyImageData;
      altText: string | null;
      //gatsbyImageData: IGatsbyImageData
    };
    tags: Array<{ name: string; color: string; bg: string }>;
  } & BoxProps
) {
  // Box with image as background and tags on bottom
  const { image, tags } = props;

  return (
    <Box overflow="hidden" position="relative" {...props}>
      {image ? (
        <Image
          onDragStart={e => e.preventDefault()}
          draggable="false"
          src={image.src}
          alt={image.altText || '-'}
          style={{
            height: 'auto',
            width: 'full',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      ) : (
        'no image'
      )}
      {/* <Field.Image
          //onDragStart={e => e.preventDefault()}
          //draggable="false"
          //src={image.gatsbyImageData.images.fallback?.src}
          //sizes={image.gatsbyImageData.images.fallback?.sizes}
          //srcSet={image.gatsbyImageData.images.fallback?.srcSet}
          name={"image.id"}
          isDisabled
          defaultValue={image.src}
          alt={image.altText || '-'}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        /> */}
      <Flex position="absolute" top="0" left="0" right="0" p={2}>
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="solid"
            fontSize="sm"
            fontWeight="semibold"
            rounded="md"
            px={2}
            mr={2}
            color={tag.color}
            bgColor={tag.bg}
            textTransform="none"
          >
            {tag.name}
          </Badge>
        ))}
      </Flex>
    </Box>
  );
}

// const ProductPrices = ({
//   prices
// }: {
//   prices: ReturnType<typeof getFormattedProductPrices>
// }) => {
//   if (prices.compareAtPriceFormatted) {
//     return (
//       <HStack
//         wrap="wrap"
//         justifyContent={{
//           base: 'center',
//           md: 'flex-start'
//         }}>
//         <Text
//           fontSize="sm"
//           fontWeight="semibold"
//           color="gray.600"
//           textDecoration={'line-through !important'}>
//           {prices.compareAtPriceFormatted}
//         </Text>
//         <Text fontSize="sm" fontWeight="bold" color="red.500" ml={2}>
//           {prices.priceFormatted}
//         </Text>
//       </HStack>
//     )
//   }

//   return (
//     <Box fontSize="sm" fontWeight="semibold" mb={2}>
//       <Text>{prices.priceFormatted}</Text>
//     </Box>
//   )
// }
