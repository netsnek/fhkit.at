'use client';

import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react';
import { Link } from 'gatsby-plugin-jaen';

interface Props {
  children: React.ReactNode;
}

export const Testimonial = (props: Props) => {
  const {children} = props

  return <Box>{children}</Box>
}

export const TestimonialContent = (props: Props) => {
  const {children} = props

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      mt="5"
      p={8}
      rounded={'xl'}
      //align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
      {children}
    </Stack>
  )
}

export const TestimonialHeading = (props: Props) => {
  const {children} = props

  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  )
}

export const TestimonialText = (props: Props) => {
  const {children} = props

  return (
    <Text
      //textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  )
}

export const TestimonialAvatar = ({
  src,
  name,
  title
}: {
  src: string
  name: string
  title: string
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} mb={2} objectFit={'contain'} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}
