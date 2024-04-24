import {
  Box,
  GridProps,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'
import {Field, usePageContext} from '@atsnek/jaen'
import {Link} from 'gatsby'
import {FC} from 'react'
import {ProductCard} from '../../ProductCard'
import { IJaenProduct } from '../../../hooks/use-products'
import React from 'react'

// expand with GridProps
interface IPortfolioGridProps extends GridProps {
  products: IJaenProduct[]
}

const PortfolioGrid: FC<IPortfolioGridProps> = ({products, ...props}) => {

  return (
    <Grid
      templateColumns={{base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'}}
      gap={6}
      {...props}>
      {products.map((product, index) => {

        console.log('my full index', index)
        console.log('!!!product!!!', product)
        return(
          <ProductCard key={index} product={product} />
        )
      })}
    </Grid>
  )
}

export default PortfolioGrid

