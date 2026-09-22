import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
  UnlinkIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Field, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Separator } from '~/components/ui/separator';
import { Toggle } from '~/components/ui/toggle';
import { cn } from '~/lib/utils';

export interface IRichTextEditorProps {
  id?: string;
  value?: string;
  onChange: (html: string) => void;
  label?: string;
  description?: string;
  errors?: { message?: string }[];
}

const EDITOR_CLASS =
  'prose prose-sm max-w-none min-h-40 px-3 py-2 text-sm outline-none dark:prose-invert';
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const ALIGNMENTS = ['left', 'center', 'justify', 'right'] as const;

const extensions = [
  StarterKit.configure({ link: false }),
  Link.configure({ openOnClick: false }),
  TextAlign.configure({ types: ['heading', 'paragraph'] })
];

const alignmentIcons = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  justify: AlignJustifyIcon,
  right: AlignRightIcon
} as const satisfies Record<(typeof ALIGNMENTS)[number], React.ComponentType>;

const ToolbarToggle = ({
  isActive = false,
  label,
  onClick,
  children
}: {
  isActive?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Toggle
    size="sm"
    pressed={isActive}
    aria-label={label}
    onPressedChange={onClick}
    onMouseDown={event => {
      event.preventDefault();
    }}
  >
    {children}
  </Toggle>
);

const Toolbar = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();

  const setLink = () => {
    const previousUrl: unknown = editor.getAttributes('link').href;
    const url = window.prompt('URL', typeof previousUrl === 'string' ? previousUrl : '');
    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
      <ToolbarToggle
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </ToolbarToggle>
      <ToolbarToggle
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </ToolbarToggle>
      <ToolbarToggle
        label="Underline"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </ToolbarToggle>
      <ToolbarToggle
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon />
      </ToolbarToggle>
      <ToolbarToggle
        label="Clear formatting"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormattingIcon />
      </ToolbarToggle>
      <Separator orientation="vertical" className="mx-1 h-6" />
      {HEADING_LEVELS.map(level => (
        <ToolbarToggle
          key={level}
          label={`Heading ${level}`}
          isActive={editor.isActive('heading', { level })}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          <span className="text-xs font-bold">H{level}</span>
        </ToolbarToggle>
      ))}
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarToggle
        label="Bullet list"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </ToolbarToggle>
      <ToolbarToggle
        label="Ordered list"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </ToolbarToggle>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarToggle label="Link" isActive={editor.isActive('link')} onClick={setLink}>
        <LinkIcon />
      </ToolbarToggle>
      <ToolbarToggle label="Unlink" onClick={() => editor.chain().focus().unsetLink().run()}>
        <UnlinkIcon />
      </ToolbarToggle>
      <Separator orientation="vertical" className="mx-1 h-6" />
      {ALIGNMENTS.map(alignment => {
        const Icon = alignmentIcons[alignment];

        return (
          <ToolbarToggle
            key={alignment}
            label={`Align ${alignment}`}
            isActive={editor.isActive({ textAlign: alignment })}
            onClick={() => editor.chain().focus().setTextAlign(alignment).run()}
          >
            <Icon />
          </ToolbarToggle>
        );
      })}
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarToggle
        label={t('common.undo', { defaultValue: 'Undo' })}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <UndoIcon />
      </ToolbarToggle>
      <ToolbarToggle
        label={t('common.redo', { defaultValue: 'Redo' })}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RedoIcon />
      </ToolbarToggle>
    </div>
  );
};

/**
 * HTML editor with a formatting toolbar. Emits the document as HTML.
 */
const RichTextEditor = ({
  id,
  value,
  onChange,
  label,
  description,
  errors = []
}: IRichTextEditorProps) => {
  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: EDITOR_CLASS, ...(id && { id }) } },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    }
  });

  const isInvalid = errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className={cn('rounded-md border border-input', isInvalid && 'border-destructive')}>
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

/**
 * Read-only rendering of editor HTML.
 */
export const RichTextViewer = ({ value }: { value: string }) => {
  const editor = useEditor({
    extensions,
    content: value,
    editable: false,
    immediatelyRender: false,
    editorProps: { attributes: { class: EDITOR_CLASS } }
  });

  return <EditorContent editor={editor} />;
};

export default RichTextEditor;
