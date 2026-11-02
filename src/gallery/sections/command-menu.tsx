"use client";

import { Avatar } from "@/components/ds/avatar";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ds/button";
import {
  CommandMenu,
  CommandMenuFilters,
  CommandMenuFooter,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuList,
  CommandMenuPanel,
  CommandMenuRow,
  CommandMenuSearch,
  type CommandMenuRowContent,
  type CommandMenuRowType,
} from "@/components/ds/command-menu";
import { LinkButton } from "@/components/ds/link-button";
import { Tag } from "@/components/ds/tag";
import { CalendarIcon, CopyIcon, GridIcon, HomeIcon, MoreIcon, SearchIcon, SettingsIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

// Flags are emoji until flag artwork is added.
const flag = (f: string) => <span className="text-paragraph-sm">{f}</span>;
const noop = () => {};

/** The menu's content: filter tags, three groups and the footer. */
function MenuContent() {
  return (
    <>
      <CommandMenuSearch shortcut="⌘K" placeholder="Search or jump to..." />
      <CommandMenuFilters>
        <Tag variant="gray" onDismiss={noop} dismissLabel="Remove Reports">
          Reports
        </Tag>
        <Tag variant="gray" onDismiss={noop} dismissLabel="Remove This week">
          This week
        </Tag>
      </CommandMenuFilters>
      <CommandMenuList>
        <CommandMenuGroup heading="Pages">
          <CommandMenuItem value="Home" type="icon" picture={<HomeIcon />} label="Home" shortcut="⌘H" />
          <CommandMenuItem value="Dashboards" type="icon" picture={<GridIcon />} label="Dashboards" badge={<Badge variant="lighter" color="gray">12</Badge>} />
          <CommandMenuItem value="Settings" type="icon" picture={<SettingsIcon />} label="Settings" shortcut="⌘," />
          <CommandMenuItem value="Billing" type="icon" picture={<CalendarIcon />} label="Billing" sublabel="(Owners only)" disabled />
        </CommandMenuGroup>
        <CommandMenuGroup
          heading="People"
          action={
            <LinkButton variant="gray" size="sm">
              See All
            </LinkButton>
          }
        >
          <CommandMenuItem
            value="Maya Patel"
            size="md"
            type="avatar"
            picture={<Avatar size="40" name="Maya Patel" />}
            label="Maya Patel"
            description="maya@8bit.ai"
            action={{ icon: <CopyIcon />, label: "Copy Maya's email" }}
          />
          <CommandMenuItem
            value="Lena Fischer"
            size="md"
            type="avatar"
            picture={<Avatar size="40" name="Lena Fischer" />}
            label="Lena Fischer"
            description="lena@8bit.ai"
            action={{ icon: <CopyIcon />, label: "Copy Lena's email" }}
          />
        </CommandMenuGroup>
        <CommandMenuGroup heading="Apps">
          <CommandMenuItem value="Slack" type="brand" picture={<img src="/brand/slack.svg" alt="" />} label="Slack" sublabel="(Connected)" />
          <CommandMenuItem value="Notion" type="brand" picture={<img src="/brand/notion.svg" alt="" />} label="Notion" />
        </CommandMenuGroup>
      </CommandMenuList>
      <CommandMenuFooter />
    </>
  );
}

const TYPES: { type: CommandMenuRowType; label: string; sm?: React.ReactNode; md?: React.ReactNode }[] = [
  { type: "basic", label: "Basic" },
  { type: "icon", label: "Left Icon", sm: <UserIcon />, md: <UserIcon /> },
  { type: "avatar", label: "Avatar", sm: <Avatar size="20" name="Maya Patel" />, md: <Avatar size="40" name="Maya Patel" /> },
  { type: "brand", label: "Brand", sm: <img src="/brand/slack.svg" alt="" />, md: <img src="/brand/slack.svg" alt="" /> },
  { type: "company", label: "Company", sm: <img src="/brand/microsoft.svg" alt="" />, md: <img src="/brand/microsoft.svg" alt="" /> },
  { type: "country", label: "Country", sm: flag("🇩🇪"), md: flag("🇩🇪") },
];

const STATES: { id: string; label: string; force?: "hover"; disabled?: boolean }[] = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover (also the row the arrow keys are on)", force: "hover" },
  { id: "disabled", label: "Disabled (ours)", disabled: true },
];

/** The parts on the right, on one row. */
const EXTRAS: Partial<CommandMenuRowContent> = {
  badge: <Badge variant="lighter" color="gray">New</Badge>,
  shortcut: "⌘1",
  action: { icon: <MoreIcon />, label: "More" },
};

export function CommandMenuSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: open it from the button (Escape closes it; the arrow keys move, return picks)">
        <CommandMenu trigger={<Button tone="neutral" variant="stroke" size="sm" leadingIcon={<SearchIcon />}>Search</Button>}>
          <MenuContent />
        </CommandMenu>
      </Group>

      <Group label="The menu, on the page: search, filter tags, groups and the footer (it works here too)">
        <CommandMenuPanel>
          <MenuContent />
        </CommandMenuPanel>
      </Group>

      <Group label="Search field: Default, Hover, Active (typing)">
        <div className="flex flex-col gap-space-16">
          <Labelled label="Default">
            <CommandMenuPanel>
              <CommandMenuSearch shortcut="⌘K" />
            </CommandMenuPanel>
          </Labelled>
          <Labelled label="Hover">
            <CommandMenuPanel>
              <CommandMenuSearch shortcut="⌘K" data-force="hover" />
            </CommandMenuPanel>
          </Labelled>
          <Labelled label="Active (typing): the clear button takes the info icon's place">
            <CommandMenuPanel>
              <CommandMenuSearch shortcut="⌘K" defaultValue="Reports" />
            </CommandMenuPanel>
          </Labelled>
        </div>
      </Group>

      {(["sm", "md"] as const).map((size) => (
        <Group key={size} label={`Rows, ${size === "sm" ? "Small 40" : "Medium 64"}: every type, then the Badge, shortcut key and button`}>
          <div className="flex flex-wrap items-start gap-space-24">
            {STATES.map((s) => (
              <Labelled key={s.id} label={s.label}>
                <div className="ds-shadow edge-stroke-soft-200 flex w-150 flex-col rounded-corner-16 bg-bg-white-0 p-space-8">
                  {TYPES.map((t) => (
                    <CommandMenuRow
                      key={t.type}
                      size={size}
                      type={t.type}
                      picture={size === "sm" ? t.sm : t.md}
                      label={t.label}
                      sublabel="(Sublabel)"
                      description={size === "md" ? "A line of description" : undefined}
                      disabled={s.disabled}
                      data-force={s.force}
                    />
                  ))}
                  <CommandMenuRow
                    size={size}
                    type="icon"
                    picture={<SettingsIcon />}
                    label="With every part"
                    description={size === "md" ? "Badge, shortcut key and button" : undefined}
                    disabled={s.disabled}
                    data-force={s.force}
                    {...EXTRAS}
                  />
                </div>
              </Labelled>
            ))}
          </div>
        </Group>
      ))}

      <Group label="Footer">
        <CommandMenuPanel>
          <CommandMenuFooter />
        </CommandMenuPanel>
      </Group>
    </div>
  );
}
