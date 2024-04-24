import {Box, Text, Image, chakra} from '@chakra-ui/react'
import {FC} from 'react'
import {useNewsPages} from '../../../hooks/use-news-pages'
import PortfolioGrid from './PortfolioGrid'
import PortfolioSlider from './PortfolioSlider'
import { useJaenProducts } from '../../../hooks/use-products'
import { PageProvider, useField } from '@atsnek/jaen'

interface INewsSlidesProps {
  productIndex: any
  showNewsTitle?: boolean
}

const NewsSlider: FC<INewsSlidesProps> = ({productIndex, showNewsTitle}) => {
  const cmsmedia = useField<any>("media_nodes", 'IMA:MEDIA_NODES').value
    //cmsMediaPage//.jaenPage.jaenFields?.['media_nodes']?.['IMA:MEDIA_NODES']

  const {products} = useJaenProducts(productIndex, cmsmedia)

  return (
    <Box as="section">
      <PortfolioGrid
        products={products}
        display={{base: 'none', sm: 'grid'}}
        mt="16"
      />

      {/* Form mobile */}
      {/* <PortfolioSlider index={index} display={{base: 'block', sm: 'none'}} /> */}
    </Box>
  )
}

const Portfolio: any = () => {
  const index = useNewsPages()

  return (
    <PageProvider jaenPage={{id: 'JaenPage /cms/media/'}}>
      <NewsSlider productIndex={index} />
    </PageProvider>
  )

}

export default Portfolio