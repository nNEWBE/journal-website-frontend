import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
    };
  }
}

export const ManuscriptPageBreak = Node.create({
  name: "pageBreak",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      { tag: 'div[data-type="page-break"]' },
      { tag: "hr.manuscript-page-break" },
      { tag: "div.page-break" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "page-break",
        class: "manuscript-page-break-divider select-none",
      }),
      [
        "span",
        { class: "manuscript-page-break-badge" },
        "Page Break",
      ],
    ];
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent([
              { type: this.name },
              { type: "paragraph" },
            ])
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setPageBreak(),
    };
  },
});
