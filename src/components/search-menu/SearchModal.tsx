import { Input,
  InputGroup,
  Spinner,
  VStack,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import {
  Dispatch,
  FC,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef
} from 'react';
import TbSearch from '../icons/tabler/TbSearch';
import { useIntl } from 'react-intl';

interface ISearchModalProps {
  defaultQuery?: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  searchResultItems: ReactNode[];
  setSearchQuery: (query: string) => void;
  handleNavigate(isUp: boolean): void;
  openActiveItem: () => void;
}

const SearchModal: FC<ISearchModalProps> = ({
  defaultQuery,
  isLoading,
  isOpen,
  onClose,
  searchResultItems,
  setSearchQuery,
  handleNavigate,
  openActiveItem
}) => {
  const intl = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleNavigate(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleNavigate(true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openActiveItem();
    }
  };

  return (
    <Dialog.Root open={isOpen} size='full' onOpenChange={e => {
      if (!e.open) {
        onClose();
      }
    }}>
      <Portal>

        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            top="10px"
            m={0}
            w={{ base: '95vw', md: '75vw' }}
            h="fit-content"
            minH={0}
            borderRadius="lg">
            <Dialog.Body px={4} overflow="hidden" color="shared.text.default">
              <InputGroup
                size="sm"
                startElement={isLoading ? <Spinner boxSize="3" /> : <TbSearch />}
                startElementProps={{ pointerEvents: 'none' }}>
                <Input
                  ref={inputRef}
                  placeholder={intl.formatMessage({id: 'SearchPlaceholder', defaultMessage: 'Suchen'})}
                  size="sm"
                  borderRadius="lg"
                  onValueChange={e => {
                    setSearchQuery(e.target.value);
                  }}
                  defaultValue={defaultQuery}
                  onKeyDown={handleKeyDown} />
              </InputGroup>
              <VStack
                mt={3}
                alignItems="start"
                fontSize="sm"
                css={{
                  '& .sd-search-outer-section::-webkit-scrollbar-thumb': {
                    borderRadius: 'full',
                    backgroundColor: 'shared.scrollbar.thumb.bgColor',
                    '&:hover': {
                      backgroundColor: 'shared.scrollbar.thumb.hover.bgColor'
                    },
                    transition: 'background-color 0.2s ease-in-out'
                  },

                  '& .sd-search-outer-section::-webkit-scrollbar': {
                    width: '4px',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {!isLoading && searchResultItems}
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>

      </Portal>
    </Dialog.Root>
  );
};

export default SearchModal;
