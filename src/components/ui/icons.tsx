"use client";

/**
 * The product's icons (Nitesh, 14 Oct 2026): Hugeicons, Stroke Rounded, the
 * free MIT set (@hugeicons/core-free-icons with @hugeicons/react), the
 * library his Noera reference uses, matched shape by shape
 * (8Bit Product/design-system/inspiration/icon-match). One semantic name per
 * use, so changing an icon is one line here. The chat home and the rail use
 * these; the rest of the product is still on lucide.
 */
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  MoreVerticalIcon,
  ArrowUpRight01Icon,
  DashboardSquare02Icon,
  AiChipIcon,
  Key01Icon,
  Route01Icon,
  SecurityCheckIcon,
  UserMultipleIcon,
  UserAccountIcon,
  UserShield01Icon,
  Dollar01Icon,
  Activity01Icon,
  PaintBoardIcon,
  SlidersHorizontalIcon,
  BrainIcon,
  HelpCircleIcon,
  Analytics01Icon,
  ArrowDown01Icon,
  Layers01Icon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowUp02Icon,
  Calendar03Icon,
  Copy01Icon,
  ArrowExpand01Icon,
  Delete02Icon,
  GridViewIcon,
  Home01Icon,
  InformationCircleIcon,
  Mail01Icon,
  Notification01Icon,
  PinIcon as PinGlyph,
  SquareLock02Icon,
  StarIcon as StarGlyph,
  Sun03Icon,
  Tick02Icon,
  CreditCardIcon,
  ViewIcon,
  ViewOffSlashIcon,
  SmileIcon,
  SlackIcon as SlackGlyph,
  GithubIcon as GithubGlyph,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  Moon02Icon,
  ListViewIcon,
  UserIcon as UserGlyph,
  Atom01Icon,
  Attachment01Icon,
  BarChartIcon,
  BookOpen01Icon,
  BubbleChatIcon,
  Cancel01Icon,
  ChartIncreaseIcon,
  DashboardSpeed01Icon,
  DashboardSquare01Icon,
  Database01Icon,
  File01Icon,
  FlashIcon,
  Image01Icon,
  Mic01Icon,
  MicOff01Icon,
  PencilEdit02Icon,
  PieChartIcon,
  Plug01Icon,
  PlusSignIcon,
  Search01Icon,
  SidebarLeftIcon,
  Table01Icon,
  Upload01Icon,
  UserGroupIcon,
  WorkflowSquare03Icon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  AlertCircleIcon,
  UnavailableIcon,
  CancelCircleIcon,
  CircleIcon as CircleGlyph,
  MinusSignIcon,
  UnfoldMoreIcon,
  ArrowUp01Icon,
  Settings02Icon,
  MagicWand01Icon,
  MoreHorizontalIcon,
  FilterIcon as FilterGlyph,
  FilterVerticalIcon,
  ArrowDown02Icon,
  Download01Icon,
  Comment01Icon,
  GlobalIcon,
  Building03Icon,
  CornerDownLeftIcon,
  Logout01Icon,
  Clock01Icon,
  Loading03Icon,
  CloudUploadIcon,
  FavouriteIcon,
  ColorPickerIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyLeftIcon,
  Link01Icon,
  AtIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  // The Workflow Studio's step cards and canvas toolbar (21 Oct 2026).
  RoboticIcon,
  AiBrain01Icon,
  GitBranchIcon,
  UserCheck01Icon,
  Message01Icon,
  ComputerTerminal01Icon,
  SourceCodeIcon,
  SearchList01Icon,
  Note01Icon,
  LifebuoyIcon,
  Download04Icon,
  FileSearchIcon,
  Undo02Icon,
  Redo02Icon,
  CenterFocusIcon,
  ArrangeIcon,
  Cursor02Icon,
  HandIcon,
  ThumbsUpIcon as ThumbsUpGlyph,
  ThumbsDownIcon as ThumbsDownGlyph,
  StopIcon as StopGlyph,
  ArrowMoveDownRightIcon,
  PlayIcon as PlayGlyph,
  Rocket01Icon,
  WorkHistoryIcon,
  RepeatIcon,
  CellsIcon,
} from "@hugeicons/core-free-icons";

/** Hugeicons draw a 1.5 stroke on a 24 grid, which thins to 1px at the
 *  rail's 16px; 1.75 holds about 1.2px there, Noera's weight. */
const STROKE = 1.75;

export type IconProps = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  /** Accepted for lucide parity; every icon here is aria-hidden already. */
  "aria-hidden"?: React.AriaAttributes["aria-hidden"];
};

export type Icon = React.ComponentType<IconProps>;

function icon(svg: IconSvgElement, name: string): Icon {
  function Glyph({ size = 16, className, style, strokeWidth = STROKE }: IconProps) {
    return (
      <HugeiconsIcon
        icon={svg}
        size={size}
        strokeWidth={strokeWidth}
        className={className}
        style={style}
        aria-hidden
        // Names the glyph in the DOM, for tests and for anyone inspecting.
        data-icon={name}
      />
    );
  }
  Glyph.displayName = name;
  return Glyph;
}

// The rail and the chat home.
export const NewChatIcon = icon(PencilEdit02Icon, "NewChatIcon");
/** Unified: one core with everything in orbit, not the AI sparkle every
 *  tool uses (and a nod to the neutrino). */
export const UnifiedIcon = icon(Atom01Icon, "UnifiedIcon");
export const KnowledgeIcon = icon(BookOpen01Icon, "KnowledgeIcon");
export const DataStudioIcon = icon(Analytics01Icon, "DataStudioIcon");
export const WorkflowsIcon = icon(WorkflowSquare03Icon, "WorkflowsIcon");
export const CanvasIcon = icon(DashboardSquare01Icon, "CanvasIcon");
export const ChatIcon = icon(BubbleChatIcon, "ChatIcon");
export const SidebarIcon = icon(SidebarLeftIcon, "SidebarIcon");
export const SearchIcon = icon(Search01Icon, "SearchIcon");

// The composer and its tray.
export const AttachIcon = icon(Attachment01Icon, "AttachIcon");
/** The composer's add button and the two things its menu adds (Nitesh,
 *  17 Oct 2026: a plus in place of the paper clip). */
export const AddIcon = icon(PlusSignIcon, "AddIcon");
export const PhotoIcon = icon(Image01Icon, "PhotoIcon");
export const FileIcon = icon(File01Icon, "FileIcon");
/** Voice (17 Oct 2026): the composer's microphone, and muted. */
export const MicIcon = icon(Mic01Icon, "MicIcon");
export const MicOffIcon = icon(MicOff01Icon, "MicOffIcon");
export const SendIcon = icon(ArrowUp02Icon, "SendIcon");
export const ConnectIcon = icon(Plug01Icon, "ConnectIcon");
export const CloseIcon = icon(Cancel01Icon, "CloseIcon");
export const ExpandIcon = icon(ArrowExpand01Icon, "ExpandIcon");

// The design system's components (components/ds/) and their Components page.
export const ChevronLeftIcon = icon(ArrowLeft01Icon, "ChevronLeftIcon");
export const BackIcon = icon(ArrowLeft02Icon, "BackIcon");
export const ChevronRightIcon = icon(ArrowRight01Icon, "ChevronRightIcon");
export const ChevronDownIcon = icon(ArrowDown01Icon, "ChevronDownIcon");
/** Pagination's First and Last (pagination.md). */
export const ChevronDoubleLeftIcon = icon(ArrowLeftDoubleIcon, "ChevronDoubleLeftIcon");
export const ChevronDoubleRightIcon = icon(ArrowRightDoubleIcon, "ChevronDoubleRightIcon");
/** The Segmented Control's examples (segmented-control.md): Light or Dark, Grid or List. */
export const MoonIcon = icon(Moon02Icon, "MoonIcon");
export const ListIcon = icon(ListViewIcon, "ListIcon");
export const CopyIcon = icon(Copy01Icon, "CopyIcon");
export const CheckIcon = icon(Tick02Icon, "CheckIcon");
export const InfoIcon = icon(InformationCircleIcon, "InfoIcon");
/** The Text Input's types (text-input.md): Card, Password's show and hide, Emoji. */
export const CardIcon = icon(CreditCardIcon, "CardIcon");
export const EyeIcon = icon(ViewIcon, "EyeIcon");
export const EyeOffIcon = icon(ViewOffSlashIcon, "EyeOffIcon");
export const EmojiIcon = icon(SmileIcon, "EmojiIcon");
/** Stand-in logos for the Integration Switch's examples (switch.md). */
export const SlackIcon = icon(SlackGlyph, "SlackIcon");
export const GithubIcon = icon(GithubGlyph, "GithubIcon");
export const UserIcon = icon(UserGlyph, "UserIcon");
export const MailIcon = icon(Mail01Icon, "MailIcon");
export const LockIcon = icon(SquareLock02Icon, "LockIcon");
export const CalendarIcon = icon(Calendar03Icon, "CalendarIcon");
export const HomeIcon = icon(Home01Icon, "HomeIcon");
export const GridIcon = icon(GridViewIcon, "GridIcon");
export const StarIcon = icon(StarGlyph, "StarIcon");
export const PinIcon = icon(PinGlyph, "PinIcon");
export const DeleteIcon = icon(Delete02Icon, "DeleteIcon");
export const BellIcon = icon(Notification01Icon, "BellIcon");
export const SunIcon = icon(Sun03Icon, "SunIcon");
/** Status Badge marks (badge.md) and the Password Strength conditions (key-components.md). */
export const CheckCircleIcon = icon(CheckmarkCircle02Icon, "CheckCircleIcon");
export const AlertIcon = icon(Alert02Icon, "AlertIcon");
export const ErrorIcon = icon(AlertCircleIcon, "ErrorIcon");
export const NoEntryIcon = icon(UnavailableIcon, "NoEntryIcon");

/** A filled mark on the Figma's own 16 grid, for the one place the Figma
 *  draws solid icons instead of Hugeicons' line: the Status Badge
 *  (design-system/icons/icons.md, "The one exception"). The mark inside is
 *  cut out of the shape, so it shows the badge behind it, as in the Figma. */
function solid(d: string, name: string): Icon {
  function Glyph({ size = 16, className, style }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className} style={style} aria-hidden data-icon={name}>
        <path d={d} fillRule="evenodd" clipRule="evenodd" />
      </svg>
    );
  }
  Glyph.displayName = name;
  return Glyph;
}

/** The Status Badge's five marks, copied from the Figma's Status Badge [1.1]
 *  vectors (24 Oct 2026, Nitesh: "exactly match the way the badge looks,
 *  including the icons"): a disc with a tick, a triangle with "!", a disc
 *  with "!", a disc with "i", a disc with a slash. */
export const StatusCompletedIcon = solid(
  "M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z",
  "StatusCompletedIcon",
);
export const StatusPendingIcon = solid(
  "M8.49364 2.6216L13.9236 12.1351C13.9737 12.2228 14 12.3222 14 12.4234C14 12.5246 13.9737 12.6241 13.9236 12.7117C13.8736 12.7994 13.8017 12.8721 13.715 12.9227C13.6283 12.9734 13.5301 13 13.43 13H2.57C2.46995 13 2.37165 12.9734 2.285 12.9227C2.19835 12.8721 2.12639 12.7994 2.07636 12.7117C2.02634 12.6241 2 12.5246 2 12.4234C2 12.3222 2.02634 12.2228 2.07637 12.1351L7.50636 2.6216C7.5564 2.53395 7.62835 2.46117 7.715 2.41057C7.80165 2.35997 7.89995 2.33333 8 2.33333C8.10005 2.33333 8.19835 2.35997 8.285 2.41057C8.37165 2.46117 8.4436 2.53395 8.49364 2.6216ZM7.42998 10.1171V11.2703H8.57002V10.1171H7.42998ZM7.42998 6.08106V8.96395H8.57002V6.08106H7.42998Z",
  "StatusPendingIcon",
);
export const StatusFailedIcon = solid(
  "M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4 9.8V11H8.6V9.8H7.4ZM7.4 5V8.6H8.6V5H7.4Z",
  "StatusFailedIcon",
);
export const StatusInformationIcon = solid(
  "M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4 7.4V11H8.6V7.4H7.4ZM7.4 5V6.2H8.6V5H7.4Z",
  "StatusInformationIcon",
);
export const StatusDisabledIcon = solid(
  "M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM5.9138 5.0654C5.58604 5.29915 5.29952 5.58587 5.066 5.9138L10.0868 10.9346C10.4148 10.7009 10.7015 10.4142 10.9352 10.0862L5.9138 5.0654Z",
  "StatusDisabledIcon",
);
export const CrossCircleIcon = icon(CancelCircleIcon, "CrossCircleIcon");
export const CircleIcon = icon(CircleGlyph, "CircleIcon");
/** The Accordion's minus (accordion.md); the plus is AddIcon. */
export const MinusIcon = icon(MinusSignIcon, "MinusIcon");
/** The Table's sort arrows (table.md): unsorted, Up and Down (Down is ChevronDownIcon). */
export const SortIcon = icon(UnfoldMoreIcon, "SortIcon");
export const ChevronUpIcon = icon(ArrowUp01Icon, "ChevronUpIcon");
/** A stand-in icon for the Modal's and Drawer's Left Icon headers. */
export const SettingsIcon = icon(Settings02Icon, "SettingsIcon");
/** The Alert's and Banner's Feature status (alert.md): the Figma's magic wand
 *  with sparkles, kept until Nitesh picks another (alert.md, Open). */
export const FeatureIcon = icon(MagicWand01Icon, "FeatureIcon");
/** The Notification Feed (notification-feed.md) and Activity Feed
 *  (activity-feed.md): more, filter, the footer's arrow keys, a file's
 *  paperclip and download, a comment. */
export const MoreIcon = icon(MoreHorizontalIcon, "MoreIcon");
export const FilterIcon = icon(FilterGlyph, "FilterIcon");
/** Sort and filter as sliders, as Claude's Artifacts page has it (the canvases page, 28 Oct 2026). */
export const SlidersIcon = icon(FilterVerticalIcon, "SlidersIcon");
export const ArrowUpIcon = icon(ArrowUp02Icon, "ArrowUpIcon");
export const ArrowDownIcon = icon(ArrowDown02Icon, "ArrowDownIcon");
export const PaperclipIcon = icon(Attachment01Icon, "PaperclipIcon");
export const DownloadIcon = icon(Download01Icon, "DownloadIcon");
export const CommentIcon = icon(Comment01Icon, "CommentIcon");
/** The Time Picker's clock (time-picker.md). */
export const ClockIcon = icon(Clock01Icon, "ClockIcon");
/** File Upload (file-upload.md): the area's upload cloud, a card's uploading spinner. */
export const UploadCloudIcon = icon(CloudUploadIcon, "UploadCloudIcon");
export const SpinnerIcon = icon(Loading03Icon, "SpinnerIcon");
/** The Rating's heart (rating.md); the star is StarIcon. */
export const HeartIcon = icon(FavouriteIcon, "HeartIcon");
/** The Color Picker's eyedropper (color-picker.md). */
export const EyedropperIcon = icon(ColorPickerIcon, "EyedropperIcon");
/** The Rich Editor's toolbar (rich-editor.md); more is MoreIcon, comment CommentIcon. */
export const BoldIcon = icon(TextBoldIcon, "BoldIcon");
export const ItalicIcon = icon(TextItalicIcon, "ItalicIcon");
export const UnderlineIcon = icon(TextUnderlineIcon, "UnderlineIcon");
export const StrikethroughIcon = icon(TextStrikethroughIcon, "StrikethroughIcon");
export const AlignLeftIcon = icon(TextAlignLeftIcon, "AlignLeftIcon");
export const AlignCenterIcon = icon(TextAlignCenterIcon, "AlignCenterIcon");
export const AlignRightIcon = icon(TextAlignRightIcon, "AlignRightIcon");
export const AlignJustifyIcon = icon(TextAlignJustifyLeftIcon, "AlignJustifyIcon");
export const LinkIcon = icon(Link01Icon, "LinkIcon");
export const MentionIcon = icon(AtIcon, "MentionIcon");
export const BulletListIcon = icon(LeftToRightListBulletIcon, "BulletListIcon");
export const NumberListIcon = icon(LeftToRightListNumberIcon, "NumberListIcon");
/** The Select's stand-ins before a pick (select.md): Country a globe, Brand a
 *  building. The Command Menu footer's return key (command-menu.md). A Log
 *  out row for the Dropdown's examples (dropdown.md). */
export const GlobeIcon = icon(GlobalIcon, "GlobeIcon");
export const BuildingIcon = icon(Building03Icon, "BuildingIcon");
export const ReturnKeyIcon = icon(CornerDownLeftIcon, "ReturnKeyIcon");
export const LogoutIcon = icon(Logout01Icon, "LogoutIcon");
/** The settings rail (components/global-sidebar.tsx), one per row, 23 Oct 2026. */
export const OverviewIcon = icon(DashboardSquare02Icon, "OverviewIcon");
export const IntegrationsIcon = icon(Plug01Icon, "IntegrationsIcon");
export const AgentStudioIcon = icon(RoboticIcon, "AgentStudioIcon");
export const ProvidersIcon = icon(AiChipIcon, "ProvidersIcon");
export const KeyIcon = icon(Key01Icon, "KeyIcon");
export const RoutingIcon = icon(Route01Icon, "RoutingIcon");
export const PrivacyIcon = icon(SecurityCheckIcon, "PrivacyIcon");
export const MembersIcon = icon(UserMultipleIcon, "MembersIcon");
export const InvitationsIcon = icon(Mail01Icon, "InvitationsIcon");
export const TenantUsersIcon = icon(UserAccountIcon, "TenantUsersIcon");
export const AdminsIcon = icon(UserShield01Icon, "AdminsIcon");
export const SpendIcon = icon(Dollar01Icon, "SpendIcon");
export const ActivityIcon = icon(Activity01Icon, "ActivityIcon");
export const AppearanceIcon = icon(PaintBoardIcon, "AppearanceIcon");
export const ResponsesIcon = icon(SlidersHorizontalIcon, "ResponsesIcon");
export const MemoryIcon = icon(BrainIcon, "MemoryIcon");
export const HelpIcon = icon(HelpCircleIcon, "HelpIcon");
export const SwitchIcon = icon(UnfoldMoreIcon, "SwitchIcon");
/** A row that leaves for a page of its own (the Settings modal's studios). */
export const OpenPageIcon = icon(ArrowUpRight01Icon, "OpenPageIcon");
/** The Table's row actions (the Figma's more-2-line, upright) and its Sort by. */
export const RowActionsIcon = icon(MoreVerticalIcon, "RowActionsIcon");
/** Usage, in the profile menu: a gauge. */
export const UsageIcon = icon(DashboardSpeed01Icon, "UsageIcon");

/** The Workflow Studio (21 Oct 2026): each step kind's glyph on its card,
 *  and the canvas toolbar. */
export const StepTriggerIcon = icon(FlashIcon, "StepTriggerIcon");
export const StepAgentIcon = icon(RoboticIcon, "StepAgentIcon");
export const StepAiIcon = icon(AiBrain01Icon, "StepAiIcon");
export const StepBranchIcon = icon(GitBranchIcon, "StepBranchIcon");
export const StepFilterIcon = icon(FilterGlyph, "StepFilterIcon");
export const StepApprovalIcon = icon(UserCheck01Icon, "StepApprovalIcon");
export const StepFormIcon = icon(Message01Icon, "StepFormIcon");
export const StepRemoteIcon = icon(ComputerTerminal01Icon, "StepRemoteIcon");
export const StepTeamIcon = icon(UserGroupIcon, "StepTeamIcon");
export const StepCodeIcon = icon(SourceCodeIcon, "StepCodeIcon");
export const StepParseIcon = icon(SearchList01Icon, "StepParseIcon");
export const StepNoteIcon = icon(Note01Icon, "StepNoteIcon");
export const StepSafetyIcon = icon(LifebuoyIcon, "StepSafetyIcon");
export const StepFetchIcon = icon(Download04Icon, "StepFetchIcon");
export const StepFileSearchIcon = icon(FileSearchIcon, "StepFileSearchIcon");
export const StepFileIcon = icon(File01Icon, "StepFileIcon");
export const StepLoopIcon = icon(RepeatIcon, "StepLoopIcon");
export const StepStageIcon = icon(Layers01Icon, "StepStageIcon");
/** The Workflow Studio's Neutrino background switch: the brand's cells. */
export const CanvasFieldIcon = icon(CellsIcon, "CanvasFieldIcon");
export const UndoIcon = icon(Undo02Icon, "UndoIcon");
export const RedoIcon = icon(Redo02Icon, "RedoIcon");
export const FitViewIcon = icon(CenterFocusIcon, "FitViewIcon");
export const TidyIcon = icon(ArrangeIcon, "TidyIcon");
/** The canvas's tools (23 Oct 2026, as Figma's): Move picks and moves steps, Hand moves the canvas. */
export const MoveToolIcon = icon(Cursor02Icon, "MoveToolIcon");
export const HandToolIcon = icon(HandIcon, "HandToolIcon");
/** The build chat (23 Oct 2026): a good or bad answer, stopping the agent, a suggested next prompt. */
export const ThumbUpIcon = icon(ThumbsUpGlyph, "ThumbUpIcon");
export const ThumbDownIcon = icon(ThumbsDownGlyph, "ThumbDownIcon");
export const StopRunIcon = icon(StopGlyph, "StopRunIcon");
export const SuggestIcon = icon(ArrowMoveDownRightIcon, "SuggestIcon");
/** The builder's top bar: Runs, Run, Publish. */
export const RunsIcon = icon(WorkHistoryIcon, "RunsIcon");
export const PlayIcon = icon(PlayGlyph, "PlayIcon");
export const PublishIcon = icon(Rocket01Icon, "PublishIcon");

/** The starter cards' icons, by the name the server gives each (NC-490). */
export const SUGGESTION_ICON: Record<string, Icon> = {
  "bar-chart": icon(BarChartIcon, "BarChartIcon"),
  "pie-chart": icon(PieChartIcon, "PieChartIcon"),
  "trending-up": icon(ChartIncreaseIcon, "TrendingUpIcon"),
  table: icon(Table01Icon, "TableIcon"),
  "file-text": icon(File01Icon, "FileIcon"),
  zap: icon(FlashIcon, "FlashIcon"),
  database: icon(Database01Icon, "DatabaseIcon"),
  upload: icon(Upload01Icon, "UploadIcon"),
  workflow: WorkflowsIcon,
  plug: ConnectIcon,
  users: icon(UserGroupIcon, "UsersIcon"),
};
