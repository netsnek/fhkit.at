import { ChevronLeftIcon, ChevronRightIcon } from '../icons/chakra';
import { Post, Query } from '@/clients/social/src/schema.generated';
import { Button,
  Collapsible,
  HStack,
  IconButton,
  Input,
  InputGroup,
  List,
  NativeSelect,
  Stack,
} from '@chakra-ui/react';
import { Link } from 'gatsby-plugin-jaen';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import PostCardSkeleton from './PostCardSkeleton';
import PostCard from './PostCard';
import { useLazyQuery, useQuery } from 'snek-query/react-hooks';
import { sq } from '@/clients/social';
import TbFilterDown from '../icons/tabler/TbFilterDown';
import TbFilterUp from '../icons/tabler/TbFilterUp';
import TbPlus from '../icons/tabler/TbPlus';
import { useAuth } from 'jaen';

interface PostListProps {
  userId?: string;
  useStars?: boolean;
  hideAuthor?: boolean;
}

const PostList: FC<PostListProps> = props => {
  const { isAuthenticated } = useAuth();

  const [_, { data, refetch, isSafe }] = useLazyQuery(sq);

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  const dateFromRef = useRef<HTMLInputElement>(null);
  const dateToRef = useRef<HTMLInputElement>(null);

  const [dateRange, setDateRange] = useState<
    | {
        from?: Date;
        to?: Date;
      }
    | undefined
  >(undefined);

  const [query, setQuery] = useState('');

  useEffect(() => {
    refetch();
  }, [query, props.userId, dateRange]);

  const [paginationCursor, setPaginationCursor] = useState<{
    before: string | undefined;
    after: string | undefined;
  }>({
    before: undefined,
    after: undefined
  });

  useEffect(() => {
    if (paginationCursor.after || paginationCursor.before) {
      refetch();
    }
  }, [paginationCursor]);

  const createdAt: {
    gte?: string;
    lte?: string;
  } = {};

  if (dateRange?.from) {
    createdAt['gte'] = dateRange.from.toISOString();
  }
  if (dateRange?.to) {
    createdAt['lte'] = dateRange.to.toISOString();
  }

  const allPosts = data.allPost({
    where:
      props.useStars && props.userId
        ? {
            stars: { some: { userId: props.userId } },
            createdAt: createdAt
          }
        : props.userId
        ? {
            userId: props.userId,
            createdAt: createdAt
          }
        : {
            createdAt: createdAt
          },
    query,
    pagination: {
      first: paginationCursor.before ? undefined : 1,
      last: paginationCursor.before ? 1 : undefined,
      after: paginationCursor.after,
      before: paginationCursor.before
    }
  });

  const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
    useMemo(() => {
      return {
        hasNextPage: allPosts.pageInfo.hasNextPage,
        hasPreviousPage: allPosts.pageInfo.hasPreviousPage,
        endCursor: allPosts.pageInfo.endCursor || undefined,
        startCursor: allPosts.pageInfo.startCursor || undefined
      };
    }, [allPosts]);

  const nextPage = () => {
    if (hasNextPage) {
      setPaginationCursor({
        after: endCursor,
        before: undefined
      });
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setPaginationCursor({
        after: undefined,
        before: startCursor
      });
    }
  };

  return (
    <Stack w="full">
      <HStack gap="3" w="full">
        <Input
          flex="1"
          placeholder="Find a experiment..."
          size="sm"
          borderRadius="lg"
          value={query}
          onValueChange={e => setQuery(e.target.value)} />

        <IconButton
          colorPalette="gray"
          size="sm"
          variant="outline"
          aria-label={'Toggle advanced search filter visibility'}
          onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}>{isAdvancedSearchOpen ? <TbFilterDown /> : <TbFilterUp />}</IconButton>

      </HStack>

      <Collapsible.Root open={isAdvancedSearchOpen} style={{ width: '75%' }}>
        <Collapsible.Content>
          <HStack gap={5} w="full">
            {/*
              v3's InputGroup takes exactly ONE child and puts the addons on
              `startAddon`/`endAddon`. The v2 markup packed two inputs and two
              addons in as siblings, which throws Children.only during SSR, so
              the pair becomes two groups sharing one row.
            */}
            {!!setDateRange && (
              <>
              <InputGroup
                size="sm"
                startAddon="Date from"
                startAddonProps={{ borderLeftRadius: 'lg' }}>
                <Input
                  ref={dateFromRef}
                  type="date"
                  onValueChange={e => {
                    const date = e.currentTarget.valueAsDate;

                    if (!date) {
                      setDateRange({
                        ...dateRange,
                        from: undefined
                      });
                    } else {
                      setDateRange({
                        ...dateRange,
                        from: isNaN(date.getTime()) ? undefined : date
                      });
                    }
                  }}
                />
              </InputGroup>
              <InputGroup size="sm" startAddon="Date to">
                <Input
                  ref={dateToRef}
                  type="date"
                  css={{
                    borderRightRadius: 'lg'
                  }}
                  onValueChange={e => {
                    const date = e.currentTarget.valueAsDate;

                    if (!date) {
                      setDateRange({
                        ...dateRange,
                        to: undefined
                      });
                    } else {
                      date.setHours(23);
                      date.setMinutes(59);
                      date.setSeconds(59);
                      date.setMilliseconds(999);

                      setDateRange({
                        ...dateRange,
                        to: isNaN(date.getTime()) ? undefined : date
                      });
                    }
                  }}
                />
              </InputGroup>
              </>
            )}
          </HStack>
        </Collapsible.Content>
      </Collapsible.Root>

      <List.Root gap={3}>
        {allPosts.nodes.map((post, idx) => (
          <PostCard
            key={idx}
            post={post}
            hideAuthor={props.hideAuthor}
            isSafe={isSafe}
          />
        ))}
      </List.Root>

      <HStack justifyContent="center">
        <Button
          variant="ghost-hover-outline"
          size="sm"
          borderRadius="lg"
          disabled={!hasPreviousPage}
          onClick={previousPage}><ChevronLeftIcon />Previous
                  </Button>
        <Button
          variant="ghost-hover-outline"
          size="sm"
          borderRadius="lg"
          disabled={!hasNextPage}
          onClick={nextPage}>Next
                  <ChevronRightIcon /></Button>
      </HStack>
    </Stack>
  );
};

export default PostList;
