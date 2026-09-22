import { PluginKey } from '@tiptap/pm/state';
import { Node, ReactRenderer } from '@tiptap/react';
import { Suggestion, type SuggestionOptions } from '@tiptap/suggestion';
import tippy, { type GetReferenceClientRect, type Instance } from 'tippy.js';

import SuggestionDropdown, {
  type ISuggestionDropdownRef,
  type ISuggestionItem
} from './SuggestionDropdown';

export interface IMentionSuggestionOptions {
  /**
   * Labels offered after the trigger character, read on every keystroke.
   */
  getItems: () => ISuggestionItem[];
}

interface IMentionOptions extends IMentionSuggestionOptions {
  suggestion: Omit<SuggestionOptions<ISuggestionItem, ISuggestionItem>, 'editor'>;
}

type TClientRect = (() => DOMRect | null) | null | undefined;

const toReferenceClientRect =
  (clientRect: TClientRect): GetReferenceClientRect =>
  () =>
    clientRect?.() ?? new DOMRect();

/**
 * Inserts the picked label as plain text when the user types `@`.
 */
export const MentionSuggestion = Node.create<IMentionOptions>({
  name: 'mentionSuggestion',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,
  addOptions() {
    return {
      getItems: () => [],
      suggestion: {
        char: '@',
        allowSpaces: true,
        allowedPrefixes: null,
        pluginKey: new PluginKey('mentionSuggestion'),
        command: ({ editor, range, props }) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          const isSpaceNext = nodeAfter?.text?.startsWith(' ');
          const insertRange = isSpaceNext ? { ...range, to: range.to + 1 } : range;

          editor
            .chain()
            .focus()
            .insertContentAt(insertRange, [{ type: 'text', text: props.label }])
            .run();
        },
        allow: ({ editor, range }) =>
          editor.can().insertContentAt(range, { type: 'mentionSuggestion' }),
        render: () => {
          let renderer: ReactRenderer<ISuggestionDropdownRef> | undefined;
          let popup: Instance | undefined;

          return {
            onStart: props => {
              renderer = new ReactRenderer(SuggestionDropdown, { props, editor: props.editor });
              [popup] = tippy('body', {
                getReferenceClientRect: toReferenceClientRect(props.clientRect),
                appendTo: () => document.body,
                content: renderer.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start'
              });
            },
            onUpdate: props => {
              renderer?.updateProps(props);
              popup?.setProps({ getReferenceClientRect: toReferenceClientRect(props.clientRect) });
            },
            onKeyDown: props => {
              if (props.event.key === 'Escape') {
                popup?.hide();
                return true;
              }

              return Boolean(renderer?.ref?.onKeyDown(props));
            },
            onExit: () => {
              popup?.destroy();
              renderer?.destroy();
            }
          };
        }
      }
    };
  },
  renderText: ({ node }) => String(node.attrs.label),
  addProseMirrorPlugins() {
    const { getItems, suggestion } = this.options;

    return [
      Suggestion({
        editor: this.editor,
        ...suggestion,
        items: ({ query }) =>
          getItems().filter(({ label }) => label.toLowerCase().includes(query.toLowerCase()))
      })
    ];
  }
});
