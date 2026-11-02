"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DropdownContent, DropdownItem, DropdownSeparator } from "@/components/ds/dropdown";
import {
  RICH_EDITOR_COLORS,
  RICH_EDITOR_TEXT_COLOR,
  RichEditorBox,
  RichEditorButton,
  RichEditorColorMenu,
  RichEditorColorPanel,
  RichEditorColorRow,
  RichEditorDivider,
  RichEditorToolbar,
  type RichEditorButtonType,
  type RichEditorColor,
} from "@/components/ds/rich-editor";
import { TooltipPanel } from "@/components/ds/tooltip";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  BulletListIcon,
  CheckIcon,
  CommentIcon,
  ItalicIcon,
  LinkIcon,
  MentionIcon,
  MoreIcon,
  NumberListIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

// ---- The grid of types and states ----

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "active", label: "Active" },
  { id: "disabled", label: "Disabled (proposed)" },
] as const;

const TYPES: { id: RichEditorButtonType; label: string }[] = [
  { id: "text", label: "Text" },
  { id: "dropdown", label: "Dropdown" },
  { id: "color", label: "Color" },
  { id: "icon", label: "Icon" },
];

const force = (state: string) => (state === "hover" || state === "focus" ? state : undefined);

/** One button of each type, as the grid shows it. */
function Sample({ type, state }: { type: RichEditorButtonType; state: string }) {
  const common = { active: state === "active", disabled: state === "disabled", "data-force": force(state), tooltip: false } as const;
  if (type === "text") return <RichEditorButton type="text" label="Heading" {...common}>Header</RichEditorButton>;
  if (type === "dropdown") return <RichEditorButton type="dropdown" label="Align" icon={<AlignLeftIcon />} {...common} />;
  if (type === "color") return <RichEditorButton type="color" label="Text colour" color="blue" {...common} />;
  return <RichEditorButton type="icon" label="Bold" icon={<BoldIcon />} {...common} />;
}

// ---- What the menus offer (the page lists none; short real words) ----

const HEADINGS = ["Header", "Subheader", "Body"] as const;
type Heading = (typeof HEADINGS)[number];

/** Sizes are the Paragraph styles of that size (typography.md). */
const SIZES = [
  { id: "12px", type: "text-paragraph-xs" },
  { id: "14px", type: "text-paragraph-sm" },
  { id: "16px", type: "text-paragraph-md" },
  { id: "18px", type: "text-paragraph-lg" },
] as const;
type Size = (typeof SIZES)[number]["id"];

const ALIGNS = [
  { id: "left", label: "Left", Icon: AlignLeftIcon, command: "justifyLeft" },
  { id: "center", label: "Centre", Icon: AlignCenterIcon, command: "justifyCenter" },
  { id: "right", label: "Right", Icon: AlignRightIcon, command: "justifyRight" },
  { id: "justify", label: "Justify", Icon: AlignJustifyIcon, command: "justifyFull" },
] as const;
type Align = (typeof ALIGNS)[number]["id"];

const FORMATS = ["bold", "italic", "underline", "strikeThrough", "insertUnorderedList", "insertOrderedList"] as const;
type Format = (typeof FORMATS)[number];

/** A menu of choices: the Dropdown's rows, the pick with a check on the right
 *  (as in a Select, dropdown.md). */
function PickMenu<T extends string>({
  options,
  value,
  onPick,
  onCloseAutoFocus,
}: {
  options: readonly { id: T; label?: string; icon?: React.ReactNode }[];
  value: T;
  onPick: (id: T) => void;
  onCloseAutoFocus?: (e: Event) => void;
}) {
  return (
    <DropdownContent width="content" onCloseAutoFocus={onCloseAutoFocus}>
      {options.map((o) => (
        <DropdownItem
          key={o.id}
          label={o.label ?? o.id}
          picture={o.icon}
          rightIcon={o.id === value ? <CheckIcon /> : undefined}
          onSelect={() => onPick(o.id)}
        />
      ))}
    </DropdownContent>
  );
}

// ---- Every control, working ----

/** The toolbar's controls with their state. Given the writing area, they also
 *  change its text (a plain contentEditable): bold, italic, underline,
 *  strikethrough, the lists, alignment, size, colour, undo and redo. The
 *  heading menu only changes its word: the page gives no heading styles. */
function useControls(editor?: React.RefObject<HTMLDivElement | null>) {
  const [on, setOn] = useState<Partial<Record<Format, boolean>>>({});
  const [heading, setHeading] = useState<Heading>(editor ? "Body" : "Header");
  const [size, setSize] = useState<Size>("14px");
  const [align, setAlign] = useState<Align>("left");
  const [color, setColor] = useState<RichEditorColor>("gray");
  const saved = useRef<Range | null>(null);
  const pending = useRef<(() => void) | null>(null);

  /** Reads the formats where the text is selected, and keeps the selection for the menus. */
  const read = useCallback(() => {
    const area = editor?.current;
    const sel = document.getSelection();
    if (!area || !sel || !sel.rangeCount || !area.contains(sel.anchorNode)) return;
    saved.current = sel.getRangeAt(0).cloneRange();
    setOn(Object.fromEntries(FORMATS.map((f) => [f, document.queryCommandState(f)])));
    setAlign(ALIGNS.find((a) => document.queryCommandState(a.command))?.id ?? "left");
    const at = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement;
    const inside = (n: Element | null | undefined) => (n && area.contains(n) ? n : null);
    setSize((inside(at?.closest("[data-size]"))?.getAttribute("data-size") as Size | null) ?? "14px");
    setColor((inside(at?.closest("[data-color]"))?.getAttribute("data-color") as RichEditorColor | null) ?? "gray");
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    document.addEventListener("selectionchange", read);
    return () => document.removeEventListener("selectionchange", read);
  }, [editor, read]);

  /** Back to the text, with its selection. */
  const restore = () => {
    const area = editor?.current;
    if (!area) return false;
    area.focus();
    const sel = document.getSelection();
    if (saved.current && sel) {
      sel.removeAllRanges();
      sel.addRange(saved.current);
    }
    return true;
  };
  const command = (name: string, value?: string) => {
    if (!restore()) return;
    document.execCommand(name, false, value);
    read();
  };
  /** Puts the selected words in a span with a type or colour class. */
  const wrap = (key: "size" | "color", value: string, className: string) => {
    if (!restore()) return;
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.dataset[key] = value;
    span.className = className;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    const picked = document.createRange();
    picked.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(picked);
    read();
  };
  const clear = () => {
    if (!restore()) return;
    document.execCommand("removeFormat");
    const sel = document.getSelection();
    const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
    editor?.current?.querySelectorAll("[data-size], [data-color]").forEach((n) => {
      if (range?.intersectsNode(n)) n.replaceWith(...Array.from(n.childNodes));
    });
    read();
  };

  // On the writing box, buttons never take the focus from the text, and a
  // menu's pick waits for the menu to close, then goes back to the text.
  const keep = editor ? (e: React.MouseEvent) => e.preventDefault() : undefined;
  const later = (run: () => void) => {
    if (editor) pending.current = run;
  };
  const backToText = editor
    ? (e: Event) => {
        e.preventDefault();
        restore();
        pending.current?.();
        pending.current = null;
      }
    : undefined;

  const toggle = (f: Format) => (editor ? command(f) : setOn((o) => ({ ...o, [f]: !o[f] })));
  const format = (f: Format, label: string, icon: React.ReactNode) => (
    <RichEditorButton label={label} icon={icon} active={!!on[f]} onMouseDown={keep} onClick={() => toggle(f)} />
  );
  const AlignIcon = ALIGNS.find((a) => a.id === align)?.Icon ?? AlignLeftIcon;

  return {
    heading: (
      <RichEditorButton
        type="text"
        label="Heading"
        menu={<PickMenu options={HEADINGS.map((id) => ({ id }))} value={heading} onPick={setHeading} onCloseAutoFocus={backToText} />}
      >
        {heading}
      </RichEditorButton>
    ),
    size: (
      <RichEditorButton
        type="text"
        label="Size"
        menu={
          <PickMenu
            options={SIZES}
            value={size}
            onPick={(id) => {
              setSize(id);
              later(() => wrap("size", id, SIZES.find((s) => s.id === id)?.type ?? ""));
            }}
            onCloseAutoFocus={backToText}
          />
        }
      >
        {size}
      </RichEditorButton>
    ),
    marks: (
      <>
        {format("bold", "Bold", <BoldIcon />)}
        {format("italic", "Italic", <ItalicIcon />)}
        {format("underline", "Underline", <UnderlineIcon />)}
        {format("strikeThrough", "Strikethrough", <StrikethroughIcon />)}
      </>
    ),
    align: (
      <RichEditorButton
        type="dropdown"
        label="Align"
        icon={<AlignIcon />}
        menu={
          <PickMenu
            options={ALIGNS.map((a) => ({ id: a.id, label: a.label, icon: <a.Icon /> }))}
            value={align}
            onPick={(id) => {
              setAlign(id);
              later(() => command(ALIGNS.find((a) => a.id === id)?.command ?? "justifyLeft"));
            }}
            onCloseAutoFocus={backToText}
          />
        }
      />
    ),
    lists: (
      <>
        {format("insertUnorderedList", "Bulleted list", <BulletListIcon />)}
        {format("insertOrderedList", "Numbered list", <NumberListIcon />)}
      </>
    ),
    color: (
      <RichEditorButton
        type="color"
        label="Text colour"
        color={color}
        menu={
          <RichEditorColorMenu
            value={color}
            onValueChange={(c) => {
              setColor(c);
              later(() => wrap("color", c, RICH_EDITOR_TEXT_COLOR[c]));
            }}
            onCloseAutoFocus={backToText}
          />
        }
      />
    ),
    // Comment and Link open panels the page does not draw, so they do nothing yet.
    comment: <RichEditorButton label="Comment" icon={<CommentIcon />} onMouseDown={keep} />,
    link: <RichEditorButton label="Link" icon={<LinkIcon />} onMouseDown={keep} />,
    mention: (
      <RichEditorButton label="Mention" icon={<MentionIcon />} onMouseDown={keep} onClick={editor ? () => command("insertText", "@") : undefined} />
    ),
    more: (
      <RichEditorButton
        label="More"
        icon={<MoreIcon />}
        menu={
          <DropdownContent width="content" onCloseAutoFocus={backToText}>
            <DropdownItem label="Undo" shortcut="⌘Z" onSelect={() => later(() => command("undo"))} />
            <DropdownItem label="Redo" shortcut="⇧⌘Z" onSelect={() => later(() => command("redo"))} />
            <DropdownSeparator />
            <DropdownItem label="Clear formatting" onSelect={() => later(clear)} />
          </DropdownContent>
        }
      />
    ),
  };
}

// ---- The toolbar's sets ----

type SetId = "01" | "02" | "03" | "04";

const SETS: { id: SetId; label: string }[] = [
  { id: "01", label: "01: everything" },
  { id: "02", label: "02: the heading and size menus" },
  { id: "03", label: "03: bold, italic, underline, strikethrough, alignment" },
  { id: "04", label: "04: comment, link, mention" },
];

function SetToolbar({ set, more }: { set: SetId; more?: boolean }) {
  const c = useControls();
  const s02 = (
    <>
      {c.heading}
      {c.size}
    </>
  );
  const s03 = (
    <>
      {c.marks}
      {c.align}
    </>
  );
  const s04 = (
    <>
      {c.comment}
      {c.link}
      {c.mention}
    </>
  );
  return (
    <RichEditorToolbar aria-label={more ? `Set ${set} with More` : `Set ${set}`}>
      {set === "01" ? (
        <>
          {s02}
          <RichEditorDivider />
          {s03}
          <RichEditorDivider />
          {s04}
        </>
      ) : set === "02" ? (
        s02
      ) : set === "03" ? (
        s03
      ) : (
        s04
      )}
      {more && (
        <>
          <RichEditorDivider />
          {c.more}
        </>
      )}
    </RichEditorToolbar>
  );
}

// ---- The toolbar on a writing box ----

function EditorExample() {
  const editor = useRef<HTMLDivElement>(null);
  const c = useControls(editor);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-space-8">
      <RichEditorBox
        editorRef={editor}
        textLabel="Message"
        toolbar={
          <>
            {c.heading}
            {c.size}
            <RichEditorDivider />
            {c.marks}
            {c.align}
            <RichEditorDivider />
            {c.lists}
            {c.color}
            <RichEditorDivider />
            {c.link}
            {c.mention}
            <RichEditorDivider />
            {c.more}
          </>
        }
      />
      <span className="text-paragraph-xs text-text-soft-400">
        The Character Counter under the text is a slot: the Text Area does not offer its counter on its own yet.
      </span>
    </div>
  );
}

/** A short toolbar row for the still writing boxes. */
function BoxRow() {
  return (
    <>
      <RichEditorButton label="Bold" icon={<BoldIcon />} tooltip={false} />
      <RichEditorButton label="Italic" icon={<ItalicIcon />} tooltip={false} />
      <RichEditorButton label="Underline" icon={<UnderlineIcon />} tooltip={false} />
      <RichEditorButton label="Strikethrough" icon={<StrikethroughIcon />} tooltip={false} />
    </>
  );
}

function ColorTry() {
  const c = useControls();
  return <RichEditorToolbar aria-label="Text colour">{c.color}</RichEditorToolbar>;
}

export function RichEditorSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: write, select words, then use the toolbar">
        <EditorExample />
      </Group>

      <Group label="The toolbar, every set, without and with More (every menu opens)">
        <div className="flex flex-col gap-space-16">
          {SETS.map((s) => (
            <div key={s.id} className="flex flex-wrap items-start gap-space-24">
              <Labelled label={s.label}>
                <SetToolbar set={s.id} />
              </Labelled>
              <Labelled label={`${s.label}, with More`}>
                <SetToolbar set={s.id} more />
              </Labelled>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Buttons, every type and state">
        <div className="grid grid-cols-[repeat(5,max-content)] items-start gap-x-space-32 gap-y-space-16">
          {TYPES.map((t) =>
            STATES.map((s) => (
              <Labelled key={`${t.id}-${s.id}`} label={`${t.label}, ${s.label}`}>
                <Sample type={t.id} state={s.id} />
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Hover shows the button's name in the Tooltip (X-Small, Dark, above)">
        <div className="flex flex-wrap items-end gap-space-24 pt-space-8">
          <Labelled label="Bold, Hover, with its tooltip">
            <div className="flex flex-col items-center gap-space-10">
              <TooltipPanel size="xs" variant="dark" tail="bottom-center">
                Bold
              </TooltipPanel>
              <RichEditorButton label="Bold" icon={<BoldIcon />} data-force="hover" tooltip={false} />
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="Colour dots in the Color button">
        <div className="flex flex-wrap items-start gap-space-24">
          {RICH_EDITOR_COLORS.map((c) => (
            <Labelled key={c.id} label={c.label}>
              <RichEditorButton type="color" label={`Text colour, ${c.label}`} color={c.id} tooltip={false} />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="The colour menu (Yellow, Purple, Sky, Pink and Teal wait for their hues)">
        <div className="flex flex-wrap items-start gap-space-32">
          <Labelled label="Blue, Hover; Red, Focus (proposed)">
            <RichEditorColorPanel>
              {RICH_EDITOR_COLORS.map((c) => (
                <RichEditorColorRow
                  key={c.id}
                  color={c.id}
                  data-force={c.id === "blue" ? "hover" : c.id === "red" ? "focus" : undefined}
                />
              ))}
            </RichEditorColorPanel>
          </Labelled>
          <Labelled label="Try it: open the colour menu">
            <ColorTry />
          </Labelled>
        </div>
      </Group>

      <Group label="The writing box, at rest and in focus">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="At rest">
            <RichEditorBox className="w-100" textLabel="At rest" toolbar={<BoxRow />} />
          </Labelled>
          <Labelled label="Focus">
            <RichEditorBox className="w-100" textLabel="Focus" toolbar={<BoxRow />} data-force="focus" />
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
