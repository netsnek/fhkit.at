import {useJaenPageIndex, usePageContext, PageProvider} from '@atsnek/jaen'
import {IGatsbyImageData} from 'gatsby-plugin-image'
import {useMemo} from 'react'

export interface IJaenProduct {
  variants: Array<{
    id: string
    shopifyId: string
    taxable: boolean
    sku: string
    compareAtPrice: number | null
    price: number
    availableForSale: boolean
  }>
  hasOnlyDefaultVariant?: boolean
  id: string
  shopifyId: string
  handle: string
  description: string
  descriptionHtml: string
  title: string
  tags: Array<string>
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT'
  totalInventory: number | null
  createdAt: string
  vendor: string
  productType: string
  media: Array<{
    id: string
    image: {
      src: string
      gatsbyImageData: IGatsbyImageData
      altText: string | null
    }
  }>
  featuredMedia: {
    id: string
    image: {
      src: string
      gatsbyImageData: IGatsbyImageData | null
      altText: string | null
    }
  } | null
  metafields: Array<{
    key: string
    value: string
    namespace: string
  }>
  index?: any
  sections?: any
}

// Limit products count to 3 (sort by date)
export const useJaenProducts = (
  productIndex: any,
  cmsmedia: any,
  options?: {unlimited?: boolean}
) => {
  const index = productIndex

  // override index children to exclude a blog page if it is the current page
  const {jaenPage} = usePageContext()

  // const globalMedia = (cms.childPages.find(
  //   child => child.id === 'JaenPage /cms/media/'
  // )?.jaenFields || {
  //   'IMA:MEDIA_NODES': {
  //     media_nodes: {
  //       value: {}
  //     }
  //   }
  // })['IMA:MEDIA_NODES'].media_nodes.value

  const globalMedia = cmsmedia

  const products: IJaenProduct[] = index.childPages
    .filter((child: { id: string }) => child.id !== jaenPage.id)
    .map((jaenPage: { id: any; slug: any; jaenPageMetadata: { description: any; title: any; blogPost: { date: any }; image: any }; mediaNodes: any[]; sections: any[] }) => ({
      variants: [
        {
          id: 'VariantId',
          shopifyId: 'your-shopify-id',
          taxable: true,
          sku: 'SKU123',
          compareAtPrice: null,
          price: 29.99,
          availableForSale: true
        }
      ], // Assuming you have at least one default variant
      hasOnlyDefaultVariant: true,
      id: jaenPage.id,
      shopifyId: 'your-shopify-id',
      handle: "products/" + jaenPage.slug || 'none',
      description: jaenPage.jaenPageMetadata?.description || '',
      descriptionHtml: jaenPage.jaenPageMetadata?.description || '',
      title: jaenPage.jaenPageMetadata?.title || '',
      tags: ['New', 'T-Shirt', 'Summer'],
      status: 'ACTIVE' as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
      totalInventory: 100, // Assuming available inventory
      createdAt: jaenPage.jaenPageMetadata?.blogPost?.date || '',
      vendor: 'VendorName',
      productType: 'ProductType',
      media: jaenPage.sections
      ?.find(section => section.fieldName === 'productImageSection')
      ?.items.map((item: { jaenFields: any; id: any; altText: any }) => {

        const imageId = (item.jaenFields || {
          'IMA:ImageField': {
            image: {
              value: {}
            }
          }
        })['IMA:ImageField'].image.value

        return {
          id: imageId,
          image: {
            original: globalMedia[imageId]?.url || "",
            src: globalMedia[imageId]?.preview.url || "",
            gatsbyImageData: null, // or provide a valid IGatsbyImageData object
            altText: globalMedia[imageId]?.altText || ""
          }
        }
      }) || [],
      featuredMedia: jaenPage.sections
      ?.find(section => section.fieldName === 'productImageSection')
      ?.items.map((item: { jaenFields: any; id: any; altText: any }) => {

        const imageId = (item.jaenFields || {
          'IMA:ImageField': {
            image: {
              value: {}
            }
          }
        })['IMA:ImageField'].image.value

        return {
          id: imageId,
          image: {
            original: globalMedia[imageId]?.url || "",
            src: globalMedia[imageId]?.preview.url || "",
            gatsbyImageData: null, // or provide a valid IGatsbyImageData object
            altText: globalMedia[imageId]?.altText || ""
          }
        }
      })?.[0] || null,
      metafields: [], // Assuming empty: provide actual values based on your setup
      index: index,
      gmedia: globalMedia,
      sections: jaenPage.sections
        ?.find(section => section.fieldName === 'productImageSection')
        ?.items.map((item: { jaenFields: any; id: any; altText: any }) => {

          const imageId = (item.jaenFields || {
            'IMA:ImageField': {
              image: {
                value: {}
              }
            }
          })['IMA:ImageField'].image.value

          return {
            item,
            id: item.id,
            image: {
              field: (item.jaenFields || {
                'IMA:ImageField': {
                  image: {
                    value: {}
                  }
                }
              })['IMA:ImageField'],
              id: imageId,
              url: globalMedia[imageId]?.url,
              preview: globalMedia[imageId]?.preview.url,
              gatsbyImageData: null, // or provide a valid IGatsbyImageData object
              altText: item.altText
            }
          }
        })
    }))
    // Limit if options limit is set
    .slice(0, options?.unlimited ? undefined : 5)

  const {featuredProducts, moreProducts} = useMemo(() => {
    const featuredProducts = products.length > 0 ? products[0] : null
    const moreProducts = products.slice(1)
    return {featuredProducts, moreProducts}
  }, [products])

  return {
    ...index,
    products,
    featuredProducts,
    moreProducts
  }
}
