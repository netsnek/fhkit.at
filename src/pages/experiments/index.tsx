import { sq } from '@/clients/social';
import { PageConfig, PageProps } from 'jaen';

import { Box, Heading, SimpleGrid, Stack, VStack } from '@chakra-ui/react';
import { graphql } from 'gatsby';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'snek-query/react-hooks';
import PostCard from '../../components/post/PostCard';
import PostCardSkeleton from '../../components/post/PostCardSkeleton';
import PostList from '../../components/post/PostList';

export const POST_FETCH_LIMIT = 3;

const IndexPage: React.FC<PageProps> = () => {
  const intl = useIntl();
  const { data, isSafe, refetch } = useQuery(sq);

  return (
    <VStack>
      <Box
        borderRadius="xl"
        mt={10}
        p={1}
        background="blueGradient"
        // `background-size` was written as a JSX attribute, which React passes
        // straight to the DOM rather than to the style system, so the gradient
        // has never had a canvas to travel across. The token itself already
        // carries `300% 300%`, so the shorthand only needs its own scale here.
        backgroundSize="600% 600%"
        // The keyframe is declared on the system now; v3 dropped the
        // `keyframes` helper this used to build it with.
        animation="gradient-shift 5s ease 0s infinite"
        w="full"
      >
        <Box bgColor="shared.body.bgColor" borderRadius="xl">
          <Box
            position="absolute"
            transform="translateY(-50%)"
            bgColor="shared.body.bgColor"
            w="fit-content"
            px={3}
            ml={5}
            borderRadius="full"
          >
            <Heading as="h1" size="lg" color="shared.text.default">
              {intl.formatMessage({id: 'BlogFeatured', defaultMessage: 'Ausgewählte Beiträge'})}
            </Heading>
          </Box>
          {/* 
          <SimpleGrid
            columns={2}
            gap={4}
            p={5}
            w="full"
            display={isLoading ? 'grid' : 'none'}
          >
            <PostCard post={post} hideAuthor />;
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </SimpleGrid> */}

          <SimpleGrid
            columns={{
              base: 1,
              md: 2
            }}
            gap={4}
            p={5}
            w="full"
          >
            {data
              .allTrendingPost({ pagination: { first: 4 } })
              .nodes.map(post => {
                return <PostCard key={post.id} post={post} isSafe={isSafe} />;
              })}
          </SimpleGrid>

          {/* <PostList
              postData={featuredPosts}
              py={10}
              px={3}
              previewType="card"
              itemsPerPage={4}
              w="full"
              skeletonProps={{
                minW: '100%'
              }}
              toggleRating={toggleRating}
              togglePostPrivacy={togglePostPrivacy}
              deletePost={deletePost}
            /> */}
        </Box>
      </Box>
      <Stack py={10} px={3} w="full">
        <Heading as="h2" size="md">
          {intl.formatMessage({id: 'BlogLatest', defaultMessage: 'Neueste Beiträge'})}
        </Heading>

        <PostList />
      </Stack>
    </VStack>
  );
};

export default IndexPage;

export const pageConfig: PageConfig = {
  label: 'Experiments',
  icon: 'FaFlask',
  withoutJaenFrameStickyHeader: true,
  menu: {
    type: 'app',
    order: 200,
    group: 'photonq'
  }
};

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`;

export { Head } from '../../components/Head';
