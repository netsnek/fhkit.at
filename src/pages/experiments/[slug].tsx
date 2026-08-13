import { CheckIcon, DeleteIcon } from '../../components/icons/chakra';
import {
  PageConfig,
  PageProps,
  osg,
  useAuth,
  useNotificationsContext
} from 'jaen';
import { AspectRatio,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  Wrap,
  Icon,
} from '@chakra-ui/react';

import { FaImage } from '@react-icons/all-files/fa/FaImage';
import { FaRocket } from '@react-icons/all-files/fa/FaRocket';

import { sq } from '@/clients/social';
import { PrivacyInput } from '@/clients/social/src/schema.generated';
import { graphql, navigate } from 'gatsby';
import { Link } from 'gatsby-plugin-jaen';
import { useEffect, useMemo, useRef, useState } from 'react';
import { asEnumKey } from 'snek-query';
import { useLazyQuery } from 'snek-query/react-hooks';
import UncontrolledMdxEditor from '../../components/mdx-editor/UncontrolledMdxEditor';
import { useTOCContext } from '../../contexts/toc';
import PostCardRating from '../../components/post/PostCardRating';
import { TextControl } from '../../components/TextControl';

const DocsPage: React.FC<PageProps> = ({ params }) => {
  const notify = useNotificationsContext();

  const [_, { data, isLoading, refetch, isSafe }] = useLazyQuery(sq);

  const toc = useTOCContext();

  useEffect(() => {
    refetch();
  }, [params.slug]);

  const post = data.post({ where: { slug: params.slug } });

  const [values, setValues] = useState({
    title: post.title,
    summary: post.summary,
    content: post.content
  });

  useEffect(() => {
    setValues({
      title: post.title,
      summary: post.summary,
      content: post.content
    });
  }, [post]);

  useEffect(() => {
    if (values.content) {
      try {
        toc.setValue(JSON.parse(values.content));
      } catch {
        toc.setValue(undefined);
      }
    } else {
      toc.setValue(undefined);
    }
  }, [values.content]);

  const hasChanges = useMemo(() => {
    return (
      isSafe &&
      ((values.title !== undefined && values.title !== post.title) ||
        (values.summary !== undefined && values.summary !== post.summary) ||
        (values.content !== undefined && values.content !== post.content))
    );
  }, [values, post, isSafe]);

  const [isSaving, setIsSaving] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isImageUploading, setIsImageUploading] = useState(false);

  const parsedContent = useMemo(() => {
    try {
      return JSON.parse(values.content || '');
    } catch {
      return undefined;
    }
  }, [values.content]);

  return (
    <Stack key={post.id} gap={4}>
      <Card.Root variant="outline" display={post.isOwner ? 'block' : 'none'}>
        <Card.Body justifyContent="space-between" alignItems="center" asChild><Flex>
            {post.privacy === 'PRIVATE' ? (
              <Button
                variant='plain'
                fontWeight="normal"
                onClick={async () => {
                  const confirm = await notify.confirm({
                    title: 'Publish Experiment',
                    message: 'Are you sure you want to publish this experiment?'
                  });

                  if (confirm) {
                    const [_, errors] = await sq.mutate(m =>
                      m.postUpdate({
                        id: post.id,
                        values: {
                          privacy: asEnumKey(PrivacyInput, 'PUBLIC')
                        }
                      })
                    );

                    refetch();

                    if (errors) {
                      notify.toast({
                        title: 'Error',
                        status: 'error',
                        description:
                          'An error occurred while publishing the experiment.'
                      });
                    } else {
                      notify.toast({
                        title: 'Experiment Published',
                        status: 'success',
                        description:
                          'The experiment has been successfully published.'
                      });
                    }
                  }
                }}><FaRocket />Publish
                            </Button>
            ) : (
              <Button
                variant='plain'
                colorPalette="green"
                fontWeight="normal"
                color="gray.500"
                onClick={async () => {
                  const confirm = await notify.confirm({
                    title: 'Unpublish Experiment',
                    message: 'Are you sure you want to unpublish this experiment?'
                  });

                  if (confirm) {
                    const [_, errors] = await sq.mutate(m =>
                      m.postUpdate({
                        id: post.id,
                        values: {
                          privacy: asEnumKey(PrivacyInput, 'PRIVATE')
                        }
                      })
                    );

                    refetch();

                    if (errors) {
                      notify.toast({
                        title: 'Error',
                        status: 'error',
                        description:
                          'An error occurred while unpublishing the experiment.'
                      });
                    } else {
                      notify.toast({
                        title: 'Experiment Unpublished',
                        status: 'success',
                        description:
                          'The experiment has been successfully unpublished.'
                      });
                    }
                  }
                }}><Icon color="green.500" asChild><CheckIcon /></Icon>Published
                            </Button>
            )}

            <ButtonGroup flexDir={['column', 'row']}>
              <Button
                variant="outline"
                disabled={!hasChanges}
                loading={isSaving}
                onClick={async () => {
                  setIsSaving(true);

                  const [_, errors] = await sq.mutate(m =>
                    m.postUpdate({
                      id: post.id,
                      values: {
                        title: values.title,
                        summary: values.summary || undefined,
                        content: values.content || undefined
                      }
                    })
                  );

                  refetch();

                  setIsSaving(false);

                  if (errors) {
                    notify.toast({
                      title: 'Error',
                      status: 'error',
                      description:
                        'An error occurred while saving the experiment.'
                    });
                  } else {
                    notify.toast({
                      title: 'Experiment Saved',
                      status: 'success',
                      description: 'The experiment has been successfully saved.'
                    });
                  }
                }}
              >
                Save
              </Button>

              {hasChanges && (
                <Button
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => {
                    setValues({
                      title: post.title,
                      summary: post.summary,
                      content: post.content
                    });
                  }}
                >
                  Cancel
                </Button>
              )}

              <Input
                type="file"
                ref={imageInputRef}
                display="none"
                onValueChange={async e => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setIsImageUploading(true);
                    const { fileUrl } = await osg.uploadFile(file);

                    const [_, errors] = await sq.mutate(m =>
                      m.postUpdate({
                        id: post.id,
                        values: {
                          avatarURL: fileUrl
                        }
                      })
                    );

                    refetch();

                    if (errors) {
                      notify.toast({
                        title: 'Error',
                        status: 'error',
                        description:
                          'An error occurred while uploading the image.'
                      });
                    } else {
                      notify.toast({
                        title: 'Image Uploaded',
                        status: 'success',
                        description: 'The image has been successfully uploaded.'
                      });

                      setIsImageUploading(false);
                    }
                  }
                }}
              />

              <IconButton
                aria-label="Delete"
                variant="ghost"
                colorPalette="red"
                onClick={async () => {
                  const confirm = await notify.confirm({
                    title: 'Delete Experiment',
                    message: 'Are you sure you want to delete this experiment?'
                  });

                  if (confirm) {
                    const [_, errors] = await sq.mutate(m =>
                      m.postDelete({ id: post.id })
                    );

                    if (errors) {
                      notify.toast({
                        title: 'Error',
                        status: 'error',
                        description:
                          'An error occurred while deleting the experiment.'
                      });
                    } else {
                      notify.toast({
                        title: 'Experiment Deleted',
                        status: 'success',
                        description:
                          'The experiment has been successfully deleted.'
                      });

                      navigate(`/users/${post.user().id}`);
                    }
                  }
                }}><DeleteIcon /></IconButton>
            </ButtonGroup>
          </Flex></Card.Body>
      </Card.Root>

      <Skeleton loading={!isSafe} minH="50px">
        <Wrap justify="space-between" align="center">
          <TextControl
            key={values.title}
            text={values.title}
            onSubmit={title => {
              setValues({
                ...values,
                title
              });
            }}
            type="heading"
            editable={post.isOwner}
          />

          <HStack>
            <Text fontSize="sm" color="gray.600">
              {post.language}
            </Text>

            <PostCardRating
              id={post.id}
              likes={post.stars().totalCount || 0}
              hasRated={!!post.hasStarred}
              toggleRating={async (id: string) => {
                if (post.hasStarred === false) {
                  await sq.mutate(m => m.postStar({ postId: id }));
                } else if (post.hasStarred === true) {
                  await sq.mutate(m => m.postUnstar({ postId: id }));
                }
              }}
            />
          </HStack>
        </Wrap>
      </Skeleton>

      <Flex alignItems="center">
        <SkeletonCircle boxSize="unset" loading={!(isSafe)}>
          <Avatar.Root size="md"><Avatar.Fallback name={post.user().profile.displayName} /><Avatar.Image src={post.user().profile.avatarUrl || ''} /></Avatar.Root>
        </SkeletonCircle>

        <Box ml={2}>
          <SkeletonText loading={!(isSafe)}>
            <Link to={`/users/${post.user().id}`}>
              {post.user().profile.displayName}
            </Link>

            <Text fontSize="sm" color="gray.600">
              @{post.user().profile.userName} &bull;
              {post.createdAt !== post.updatedAt ? (
                <> Updated: {new Date(post.updatedAt).toLocaleString()}</>
              ) : (
                <> Created: {new Date(post.createdAt).toLocaleString()}</>
              )}
            </Text>
          </SkeletonText>
        </Box>
      </Flex>

      <SkeletonText loading={!(isSafe)}>
        <TextControl
          key={values.summary}
          text={values.summary || undefined}
          onSubmit={summary => {
            setValues({
              ...values,
              summary
            });
          }}
          type="text"
          editable={post.isOwner}
        />
      </SkeletonText>

      <HStack justifyContent="end" display={post.isOwner ? 'flex' : 'none'}>
        <IconButton
          variant="outline"
          aria-label="Upload Image"
          onClick={() => {
            imageInputRef.current?.click();
          }}><FaImage /></IconButton>
        <IconButton
          variant="ghost"
          colorPalette="red"
          loading={isImageUploading}
          aria-label="Delete Image"
          onClick={async () => {
            const confirm = await notify.confirm({
              title: 'Delete Image',
              message: 'Are you sure you want to delete the image?'
            });

            if (confirm) {
              const [_, errors] = await sq.mutate(m =>
                m.postUpdate({
                  id: post.id,
                  values: {
                    avatarURL: undefined
                  }
                })
              );

              refetch();

              if (errors) {
                notify.toast({
                  title: 'Error',
                  status: 'error',
                  description: 'An error occurred while deleting the image.'
                });
              } else {
                notify.toast({
                  title: 'Image Deleted',
                  status: 'success',
                  description: 'The image has been successfully deleted.'
                });
              }
            }
          }}><Icon color="red.500" asChild><DeleteIcon /></Icon></IconButton>
      </HStack>

      <Skeleton loading={!isSafe}>
        <AspectRatio
          _hover={
            post.isOwner
              ? {
                  cursor: 'pointer',
                  filter: 'brightness(0.8)',
                  outlineColor: 'brand.500',
                  outlineWidth: '2px',
                  outlineStyle: 'solid',
                  outlineOffset: '2px'
                }
              : {}
          }
          ratio={16 / 9}
          borderWidth="1px"
          borderRadius="lg"
          display={
            isSafe && !post.avatarURL && !post.isOwner ? 'none' : 'block'
          }
          cursor={post.isOwner ? 'pointer' : 'default'}
          onClick={() => {
            if (post.isOwner) {
              imageInputRef.current?.click();
            }
          }}
        >
          <Image src={post.avatarURL} alt="Post Image" />
        </AspectRatio>
      </Skeleton>

      {/* Placeholder for Editor Component */}
      <SkeletonText
        loading={!(isSafe)}
        lineClamp={15}
        gap="4"
        skeletonHeight="6"
      >
        <UncontrolledMdxEditor
          value={parsedContent}
          isEditing={post.isOwner}
          onUpdateValue={value => {
            toc.setValue(value);

            setValues({
              ...values,
              content: JSON.stringify(value)
            });
          }}
        />
      </SkeletonText>
    </Stack>
  );
};

export default DocsPage;

export const pageConfig: PageConfig = {
  label: 'Experiment',
  icon: 'FaFlask',
  withoutJaenFrameStickyHeader: true
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
