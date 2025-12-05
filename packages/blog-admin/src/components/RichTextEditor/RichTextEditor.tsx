import React, { useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Toolbar } from './Toolbar';
import styles from './RichTextEditor.module.css';
import 'draft-js/dist/Draft.css';

interface Props {
  value?: string;
  onChange?: (html: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      try {
        const contentBlock = htmlToDraft(value);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
            contentBlock.entityMap
          );
          return EditorState.createWithContent(contentState);
        }
      } catch (error) {
        console.error('Failed to parse HTML:', error);
      }
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    if (value !== undefined && value !== getCurrentHtml()) {
      try {
        const contentBlock = htmlToDraft(value || '');
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
            contentBlock.entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        console.error('Failed to parse HTML:', error);
      }
    }
  }, [value]);

  const getCurrentHtml = (): string => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    return draftToHtml(rawContentState);
  };

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
    const html = draftToHtml(convertToRaw(newState.getCurrentContent()));
    onChange?.(html);
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div className={styles.editorWrapper}>
      <Toolbar
        editorState={editorState}
        onToggleInlineStyle={toggleInlineStyle}
        onToggleBlockType={toggleBlockType}
      />
      <div className={styles.editorContainer}>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="请输入文章内容..."
          spellCheck={true}
        />
      </div>
    </div>
  );
};
