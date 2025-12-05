import React from 'react';
import { Button, Divider, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { EditorState } from 'draft-js';
import styles from './RichTextEditor.module.css';

interface Props {
  editorState: EditorState;
  onToggleInlineStyle: (style: string) => void;
  onToggleBlockType: (blockType: string) => void;
}

export const Toolbar: React.FC<Props> = ({
  editorState,
  onToggleInlineStyle,
  onToggleBlockType,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const isInlineStyleActive = (style: string) => currentStyle.has(style);
  const isBlockTypeActive = (type: string) => blockType === type;

  return (
    <div className={styles.toolbar}>
      <Button.Group>
        <Tooltip title="粗体">
          <Button
            size="small"
            icon={<BoldOutlined />}
            type={isInlineStyleActive('BOLD') ? 'primary' : 'default'}
            onClick={() => onToggleInlineStyle('BOLD')}
          />
        </Tooltip>
        <Tooltip title="斜体">
          <Button
            size="small"
            icon={<ItalicOutlined />}
            type={isInlineStyleActive('ITALIC') ? 'primary' : 'default'}
            onClick={() => onToggleInlineStyle('ITALIC')}
          />
        </Tooltip>
        <Tooltip title="下划线">
          <Button
            size="small"
            icon={<UnderlineOutlined />}
            type={isInlineStyleActive('UNDERLINE') ? 'primary' : 'default'}
            onClick={() => onToggleInlineStyle('UNDERLINE')}
          />
        </Tooltip>
        <Tooltip title="代码">
          <Button
            size="small"
            icon={<CodeOutlined />}
            type={isInlineStyleActive('CODE') ? 'primary' : 'default'}
            onClick={() => onToggleInlineStyle('CODE')}
          />
        </Tooltip>
      </Button.Group>

      <Divider type="vertical" />

      <Button.Group>
        <Tooltip title="标题 1">
          <Button
            size="small"
            type={isBlockTypeActive('header-one') ? 'primary' : 'default'}
            onClick={() => onToggleBlockType('header-one')}
          >
            H1
          </Button>
        </Tooltip>
        <Tooltip title="标题 2">
          <Button
            size="small"
            type={isBlockTypeActive('header-two') ? 'primary' : 'default'}
            onClick={() => onToggleBlockType('header-two')}
          >
            H2
          </Button>
        </Tooltip>
        <Tooltip title="标题 3">
          <Button
            size="small"
            type={isBlockTypeActive('header-three') ? 'primary' : 'default'}
            onClick={() => onToggleBlockType('header-three')}
          >
            H3
          </Button>
        </Tooltip>
      </Button.Group>

      <Divider type="vertical" />

      <Button.Group>
        <Tooltip title="无序列表">
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            type={isBlockTypeActive('unordered-list-item') ? 'primary' : 'default'}
            onClick={() => onToggleBlockType('unordered-list-item')}
          />
        </Tooltip>
        <Tooltip title="有序列表">
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            type={isBlockTypeActive('ordered-list-item') ? 'primary' : 'default'}
            onClick={() => onToggleBlockType('ordered-list-item')}
          />
        </Tooltip>
        <Tooltip title="引用">
          <Button
            size="small"
            type={isBlockTypeActive('blockquote') ? 'primary' : 'default'}
            onClick={() => onToggleBlockType('blockquote')}
          >
            &quot;
          </Button>
        </Tooltip>
        <Tooltip title="代码块">
          <Button
            size="small"
            type={isBlockTypeActive('code-block') ? 'primary' : 'default'}
            onClick={() => onToggleBlockType('code-block')}
          >
            {'</>'}
          </Button>
        </Tooltip>
      </Button.Group>
    </div>
  );
};
