import { createStore } from '@tanstack/react-store';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useEffect, useMemo, useState } from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';

import type { ISuggestionItem } from './SuggestionDropdown';
import { MentionSuggestion } from './mention-suggestion';

export interface IExpressionEditorProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  /**
   * JSON object of objects. Every `outer.inner` key pair becomes a `@`
   * suggestion.
   */
  hint?: string;
  errors?: { message?: string }[];
}

const EDITOR_CLASS =
  'min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Suggestion labels from a hint payload shaped `{ outer: { inner: ... } }`.
 */
export const buildHintItems = (hint?: string): ISuggestionItem[] => {
  if (!hint) return [];

  try {
    const parsed: unknown = JSON.parse(hint);
    if (!isRecord(parsed)) return [];

    return Object.entries(parsed).flatMap(([outerKey, inner]) =>
      isRecord(inner)
        ? Object.keys(inner).map(innerKey => ({ label: `${outerKey}.${innerKey}` }))
        : []
    );
  } catch {
    return [];
  }
};

/**
 * Plain text editor with `@` completion for the keys named in `hint`.
 */
const ExpressionEditor = ({
  id,
  value,
  onChange,
  label,
  description,
  hint,
  errors = []
}: IExpressionEditorProps) => {
  const [itemsStore] = useState(() => createStore<ISuggestionItem[]>([]));
  const extensions = useMemo(
    () => [StarterKit, MentionSuggestion.configure({ getItems: () => itemsStore.state })],
    [itemsStore]
  );
  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: EDITOR_CLASS, ...(id && { id }) } },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getText());
    }
  });

  const items = useMemo(() => buildHintItems(hint), [hint]);
  const isInvalid = errors.length > 0;

  useEffect(() => {
    itemsStore.setState(() => items);
  }, [items, itemsStore]);

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <EditorContent editor={editor} />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default ExpressionEditor;
