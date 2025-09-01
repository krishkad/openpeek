import { Editor, EditorContent } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  UnderlineIcon,
  UnlinkIcon,
} from "lucide-react"; // you can install @heroicons/react or replace with your icon library
import { ReactNode } from "react";

export default function ModernEmailEditor({
  editor,
}: {
  editor: Editor | null;
}) {
  // const editorr = useEditor({
  //   extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
  //   content: "<p>Start writing your email here...</p>",
  //   immediatelyRender: false,
  // });

  if (!editor) {
    return null;
  }

  // A reusable toolbar button component
  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active: boolean;
    title: string;
    children: ReactNode;
  }) => (
    <button
      onClick={onClick}
      aria-label={title}
      title={title}
      className={`p-2 rounded-md transition-colors duration-150 
        ${active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"}
        focus:outline-none focus:ring-2 focus:ring-blue-500`}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className="w-full font-sans">
      <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-md shadow-sm">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl + B)"
        >
          <BoldIcon className="w-5 h-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl + I)"
        >
          <ItalicIcon className="w-5 h-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl + U)"
        >
          <UnderlineIcon className="w-5 h-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <ListIcon className="w-5 h-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrderedIcon className="w-5 h-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Enter the URL");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
          active={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon className="w-5 h-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove Link"
          active={editor.isActive("remove-link")}
        >
          <UnlinkIcon className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="border border-gray-300 rounded-md p-4 min-h-[300px] prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        spellCheck={true}
        placeholder="Email here..."
      />
    </div>
  );
}
