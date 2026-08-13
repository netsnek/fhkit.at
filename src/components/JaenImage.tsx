import { Field } from 'jaen';
import { ImageFieldProps } from 'jaen';
import { Steps, Box } from '@chakra-ui/react';
import { FC } from 'react';

interface IImageProps {
  name: string;
  defaultValue: string;
  alt?: string;
}

/**
 * Component for displaying an jaen image
 */
export const JaenImage: FC<IImageProps & ImageFieldProps> = ({
  name,
  defaultValue,
  alt,
  ...props
}: any) => {
  if (!name) {
    name = `image-${(Math.random() + 1).toString(36).substring(7)}`;
  }

  return (
    <Box {...props}>
      <Field.Image name={name} defaultValue={defaultValue} alt={alt} />
    </Box>
  );
};

JaenImage.defaultProps = {
  //@ts-expect-error
  name: () => `image-${(Math.random() + 1).toString(36).substring(7)}`,
  defaultValue: 'https://via.placeholder.com/150'
};

export default JaenImage;
