import { FC } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";

import { FaShare } from "@react-icons/all-files/fa/FaShare";
import { FaShoppingBasket } from "@react-icons/all-files/fa/FaShoppingBasket";
// import {useBasket} from '../../../services/basket'
import { connectBlock, Field } from "@atsnek/jaen";
import MdxEditor from "./mdx-editor/MdxEditor";

// import {PhotoProvider} from '@atsnek/jaen'

const useBasket = () => {
  return {
    addProduct: () => {},
  };
};
// Example links - these would probably be fetched from a CMS or other data source
const links = [
  {
    name: "Question? Give us feedback",
    href: "/contact",
  },
  {
    name: "Edit this page on Jaen",
    href: "/cms/pages",
  },
];

export type JaenProduct = {
  handle: string;
  title: string;
  description: string;
  price: string;
  compareAtPrice: string;
  discount: string;
  tags: string[];
  taxable: boolean;
  createdAt: string;
  featuredMedia: {
    image: {
      name: string;
      defaultValue: string;
      altText: string;
    };
  };
  media: {
    image: {
      name: string;
      defaultValue: string;
      altText: string;
    };
  }[];
};

export interface IProductContentProps {}

const SliderItem = connectBlock(
  () => {
    return (
      <Box display={"flex"} justifyContent="center">
        <Box
          as={Field.Image}
          name="image"
          m="0"
          h="200px"
          w="full"
          //boxSize="sm"
          borderRadius="xl"
          overflow="hidden"
          isolation="isolate"
        />
      </Box>
    );
  },
  {
    name: "SliderItem",
    label: "SliderItem",
  }
);

export const ProductContent: FC<IProductContentProps> = () => {
  // const navTopOffset = useNavOffset()

  // This can be memoized since it doesn't change and switching pages re-renders most of the app anyway.
  // const MemoizedToc = memo(TableOfContent, () => false)

  return (
    <>
      <VStack mb={8} spacing={12} w="100%">
        <Flex direction={{ base: "column", lg: "row" }} w="100%">
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing="14"
            w="100%"
          >
            <Box pos="relative" w="100%">
              <Field.Section
                as={Stack}
                props={{
                  spacing: 4,
                  my: "8",
                  py: "0",
                  bg: "white",
                  px: "0",
                }}
                name="productImageSection"
                label="Inhalt"
                blocks={[SliderItem]}
              />
            </Box>
            <Stack
              spacing="8"
              w="100%"
              position={{ base: "relative", lg: "sticky" }}
              top={{
                base: "0",
                lg: 44,
              }}
              px={{ base: 0, md: 4 }}
              m={{ base: 0, md: 1 }}
              h="fit-content"
            >
              <ProductDetail wholesale={true} />
            </Stack>
          </Stack>
        </Flex>
      </VStack>
    </>
  );
};

// function Price({
//   prices
// }: {
//   prices: ReturnType<typeof getFormattedProductPrices>
// }) {
//   const {priceFormatted, compareAtPriceFormatted} = prices

//   if (compareAtPriceFormatted) {
//     // strike through price and put discount price on the right side
//     return (
//       <HStack>
//         <Text
//           fontWeight="semibold"
//           color="gray.600"
//           textDecoration="line-through">
//           {compareAtPriceFormatted}
//         </Text>

//         <Heading fontWeight="semibold" color="red.500">
//           {priceFormatted}
//         </Heading>
//       </HStack>
//     )
//   }

//   return (
//     <Heading size="md" fontWeight="semibold">
//       {priceFormatted}
//     </Heading>
//   )
// }

const ProductDetail = (props: {
  wholesale: boolean;
  // product: ProductPageData['shopifyProduct']
}) => {
  // const productMetatfields = getProductMetafields(props.product)

  const stepperStep = 1;
  const minQuantity = stepperStep;

  const [quantity, setQuantity] = React.useState(minQuantity);

  // const prices = getProductPrices(props.product, {
  //   isWholesale: props.wholesale
  // })

  let taxable = true;

  if (props.wholesale) {
    taxable = false;
  }

  // const tags = [getProductTags(props.product)]

  // const productTags = []

  // if (tags.categoryString) {
  //   productTags.push(tags.categoryString)
  // }

  // if (tags.otherString) {
  //   productTags.push(tags.otherString)
  // }

  // if (props.product.vendor !== '-') {
  //   productTags.push(`Hersteller: ${props.product.vendor}`)
  // }

  // if (props.product.productType && props.product.productType !== '-') {
  //   productTags.push(`Art: ${props.product.productType}`)
  // }

  const basket = useBasket();

  const addProductToBasket = () => {
    // basket.addProduct({
    //   variantId: props.product.variants[0].shopifyId,
    //   quantity,
    //   stepperQuantity: stepperStep,
    //   wholesalePrice: prices.wholesalePrice
    // })

    setQuantity(minQuantity);
  };

  const availableForSale = true;
  // const availableForSale =
  //   (props.product.variants[0].price || prices.wholesalePrice) &&
  //   props.product.variants[0].availableForSale

  return (
    <VStack align="left" spacing="4" divider={<StackDivider />}>
      <Stack>
        <Field.Text
          as={Heading}
          fontSize={{ base: "3xl", lg: "4xl" }}
          lineHeight={1}
          fontWeight="bold"
          textAlign="left"
          name="ProductName"
          defaultValue="Produkt Name"
        />

        {/* <Text color="gray.600">
          {tags.otherTags.map(tag => tag.split(':')[1]).join(', ')}
        </Text> */}

        {/* <ProductMoreDetail description={props.product.descriptionHtml} /> */}
      </Stack>

      {/* <Divider />

      {productTags.map((tag, index) => (
        <Box
          as="span"
          fontSize={'xs'}
          fontWeight={'hairline'}
          color="gray.600"
          mr={2}
          key={index}>
          {tag}
        </Box>
      ))} */}

      <Field.Text name="productDescription" />
      {/* <MdxEditor /> */}
      <Text fontSize="sm">
        Artikelnummer:{" "}
        <Text as="span" color="gray.600">
          000000000000
        </Text>
      </Text>

      <Stack>
        <Stack spacing="4" mt="4">
          <HStack>
            {/* <Price prices={prices} /> */}
            100,00 €
            {/* <Text fontSize="xs" color="gray.600">
              {taxable ? "inkl." : "exkl."} USt.
            </Text> */}
          </HStack>

          {availableForSale ? (
            <Text color="green" fontSize="sm">
              Verfügbar
            </Text>
          ) : (
            <Text color="red.500">Derzeit nicht verfügbar</Text>
          )}

          <HStack>
            <NumberInput
              size="lg"
              maxW={24}
              step={stepperStep}
              defaultValue={minQuantity}
              min={minQuantity}
              value={quantity}
              onChange={(valueString) => {
                setQuantity(parseInt(valueString));
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button
              // display={{
              //   base: 'none',
              //   md: 'flex'
              // }}
              size="lg"
              isDisabled={!availableForSale}
              fontWeight="semibold"
              textTransform="uppercase"
              onClick={addProductToBasket}
              leftIcon={<FaShoppingBasket />}
            >
              In den Warenkorb
            </Button>
          </HStack>
        </Stack>
      </Stack>

      <Flex alignItems="center" justifyContent="center" fontSize="xl">
        <Box mx="auto">
          <ShareText />
        </Box>
      </Flex>
    </VStack>
  );
};

function ShareText() {
  const value = typeof window !== "undefined" ? window.location.href : "";

  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Center
      color={hasCopied ? "red.500" : undefined}
      _hover={{
        color: hasCopied ? "red.400" : "red.300",
      }}
      verticalAlign="center"
      cursor="pointer"
    >
      <Icon as={FaShare} mr="2" />
      <Text fontWeight="semibold" onClick={onCopy}>
        Teilen
        {hasCopied && (
          <Text ml="2" fontWeight="thin">
            (Kopiert!)
          </Text>
        )}
      </Text>
    </Center>
  );
}

// const ImageThumbnailWrapItem = (props: {
//   media: SliderMedia
//   active: boolean
//   onClick: () => void
// }) => {
//   if (!props.media) {
//     return null
//   }

//   const {gatsbyImageData, altText} = props.media.image

//   return (
//     <WrapItem
//       boxSize={{base: '16', md: '20'}}
//       onClick={props.onClick}
//       cursor="pointer"
//       boxShadow={props.active ? 'inset 0px 4px 0px 0px #eb1933' : 'none'}
//       p={2}
//       mr={2}
//       mb={2}
//       _hover={{
//         bg: useColorModeValue('gray.300', 'gray.800')
//       }}
//       transition="ease-out">
//       <GatsbyImage
//         onDragStart={e => e.preventDefault()}
//         draggable="false"
//         image={gatsbyImageData}
//         alt={altText || 'Product image '}
//         style={{
//           height: '100%',
//           width: '100%',
//           objectFit: 'contain',
//           objectPosition: 'center'
//         }}
//       />
//     </WrapItem>
//   )
// }

const ImageSlider = (props: {
  featuredMedia: JaenProduct["featuredMedia"];
  media: JaenProduct["media"];
}) => {
  const media = props.media;

  return (
    <VStack>
      <Wrap
        overflow="hidden"
        bg={"white"}
        border="1px"
        borderColor="gray.100"
        justify="center"
      >
        {media.map((media, index) => (
          <Box key={index}>
            <Box cursor="zoom-in">
              {/* <GatsbyImage
                  image={media.image.gatsbyImageData}
                  alt={media.image.altText || 'Product Image'}
                  style={{
                    height: '100%',
                    width: '100%'
                  }}
                  objectFit="contain"
                /> 
                
                if (media.image.defaultValue) {
                */}
              {media.image.defaultValue && (
                <Field.Image
                  //onDragStart={e => e.preventDefault()}
                  //draggable="false"
                  //src={image.gatsbyImageData.images.fallback?.src}
                  //sizes={image.gatsbyImageData.images.fallback?.sizes}
                  //srcSet={image.gatsbyImageData.images.fallback?.srcSet}
                  name={media.image.name}
                  isDisabled
                  defaultValue={media.image.defaultValue}
                  alt={media.image.altText || "Product Image"}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
              )}
            </Box>
          </Box>
        ))}
      </Wrap>
    </VStack>
  );
};

// const ProductMoreDetail = (props: {description: string}) => {
//   const color = useColorModeValue('#000000', '#ffffff')

//   const html = replaceHexColorsInHTML(props.description, '#000000', color)

//   return (
//     <Box py="8">
//       <Box dangerouslySetInnerHTML={{__html: html}} />
//     </Box>
//   )
// }
