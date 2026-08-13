import { Box, BoxProps } from '@chakra-ui/react';
import { Tooltip } from '../../../Tooltip';
import { FC, useState } from 'react';

import BsFileEarmark from '../../../icons/bootstrap/BsFileEarmark';
import BsFolder from '../../../icons/bootstrap/BsFolder';
import BsFolder2Open from '../../../icons/bootstrap/BsFolder2Open';
import { TFilesystemItem } from '../types/filesystem';

interface IFilesystemItemProps {
  item: TFilesystemItem;
  intendation: number;
  isChild?: boolean;
}
/**
 * A single item in the filesystem
 */
const FilesystemItem: FC<IFilesystemItemProps> = ({
  item,
  intendation,
  isChild
}) => {
  const isFolder = item.type === 'folder';

  const [showChildren, setShowChildren] = useState(
    isFolder && (item.defaultOpen ?? true)
  );
  const toggleShowChildren = () => setShowChildren(!showChildren);
  // Tooltip settings.
  //
  // `tooltipProps` used to be assembled here in v2's prop shape and then never
  // passed to anything: the element below spells its own props out. It is gone
  // rather than ported, along with the `TooltipProps` type it was annotated
  // with, which v3 does not export at the top level.
  const tooltipText =
    typeof item.tooltip === 'string' ? item.tooltip : item.tooltip?.text;

  // Icon settings
  let IconComp;
  let props: BoxProps = { transition: 'opacity 0.2s ease-in-out' };
  if (isFolder) {
    props = {
      ...props,
      cursor: 'pointer',
      _hover: { ...props._hover, opacity: 0.7 }
    };
    IconComp = showChildren ? BsFolder2Open : BsFolder;
  } else {
    props.cursor = tooltipText ? 'pointer' : 'default';
    IconComp = BsFileEarmark;
  }

  // Colorization settings
  if (item.isSelected) {
    const color = `components.filesystem.selected.color.${
      item.lowContrast ? 'lowContrast' : 'default'
    }`;
    props = {
      ...props,
      color,
      fill: color
    };
  } else {
    const color = `components.filesystem.color.${
      item.lowContrast ? 'lowContrast' : 'default'
    }`;
    props = {
      ...props,
      color,
      fill: color
    };
  }

  if (item.lowContrast) {
    props = {
      ...props,
      opacity: 0.5,
      _hover: {
        ...props._hover,
        opacity: 1
      }
    };
  }

  if (isChild) {
    props = {
      ...props,
      position: 'relative',
      _before: {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: intendation * -3,
        transform: 'translateY(-50%)',
        height: '1px',
        width: 2,
        bg: 'components.filesystem.borderColor'
      }
    };
  }

  const itemContent = (
    <Box w="fit-content">
      <IconComp
        boxSize="14px"
        mr={2}
        fill="components.filesystem.icon.color.default"
        color="components.filesystem.icon.color.default"
      />
      {item.name}
    </Box>
  );

  return (
    <Box ml={intendation * 3} mb={1}>
      <Box
        {...props}
        onClick={toggleShowChildren}
        key={0}
        mb={1}
        // color={item.isSelected ? 'components.filesystem.selected.color' : 'components.filesystem.color'}
      >
        {tooltipText && tooltipText.length ? (
          <Tooltip
            content={tooltipText}
            openDelay={500}
            contentProps={{ borderRadius: 'md' }}>
            {itemContent}
          </Tooltip>
        ) : (
          itemContent
        )}
      </Box>
      {item.type === 'folder' && showChildren && (
        <Box
          borderLeft="1px solid"
          borderColor="leftNav.accordion.panel.borderLeftColor"
        >
          {item.children?.map((child, i) => (
            <FilesystemItem
              item={child}
              intendation={intendation + 1}
              key={i}
              isChild
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export interface IFileSystemProps {
  structure: TFilesystemItem[];
}
/**
 * Filesystem component for displaying filesystem structures.
 */
const Filesystem: FC<IFileSystemProps> = ({ structure }) => {
  return (
    <Box
      mt="8"
      w="fit-content"
      px={5}
      py={3}
      border="1px solid"
      borderColor="components.filesystem.borderColor"
      borderRadius="md"
      color="shared.text.default"
      fontSize="sm"
      _hover={{
        boxShadow: 'base'
      }}
      transition="box-shadow 0.2s ease-in-out"
    >
      {structure &&
        Array.isArray(structure) &&
        structure?.map((item, i) => (
          <FilesystemItem item={item} intendation={0} key={i} />
        ))}
    </Box>
  );
};
Filesystem.defaultProps = {
  structure: [
    {
      name: 'src',
      type: 'folder',
      defaultOpen: true,
      children: [
        {
          name: 'features',
          type: 'folder',
          defaultOpen: true,
          children: [
            {
              name: 'index.tsx',
              type: 'file',
              isSelected: true
            }
          ]
        },
        {
          name: 'apples.tsx',
          type: 'file',
          tooltip: {
            text: 'This is a tooltip'
          }
        },
        {
          name: 'bananas.tsx',
          type: 'file'
        },
        {
          name: 'strawberries.tsx',
          type: 'file'
        }
      ]
    }
  ]
};

export default Filesystem;
