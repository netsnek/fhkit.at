import { CheckIcon, CloseIcon, EditIcon } from './icons/chakra';
import { ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Text,
  Textarea,
  useEditableContext,
} from '@chakra-ui/react';

export const TextControl: React.FC<{
  text?: string;
  onSubmit: (text: string) => void;
  type: 'heading' | 'text';
  editable: boolean;
}> = props => {
  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps
    } = useEditableContext();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton {...getSubmitButtonProps()} aria-label="Edit"><CheckIcon /></IconButton>
        <IconButton variant="outline" {...getCancelButtonProps()} aria-label="Close"><CloseIcon /></IconButton>
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton variant="ghost" size="sm" {...getEditButtonProps()} aria-label="Edit"><EditIcon /></IconButton>
      </Flex>
    );
  }

  return (
    <Editable.Root
      as={HStack}
      textAlign={props.type === 'heading' ? 'center' : 'left'}
      defaultValue={props.text}
      onValueCommit={props.onSubmit}
      fontSize={props.type === 'heading' ? '4xl' : undefined}
      fontWeight={props.type === 'heading' ? 'bold' : 'normal'}>
      <Editable.Preview as={props.type === 'heading' ? Heading : Text} />
      {/* Here is the custom input */}
      {props.type === 'heading' ? (
        <Input as={EditableInput} />
      ) : (
        <Textarea as={EditableTextarea} />
      )}
      {props.editable && <EditableControls />}
    </Editable.Root>
  );
};
