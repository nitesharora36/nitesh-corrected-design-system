"use client";

import { Avatar } from "@/components/ds/avatar";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ds/button";
import { ContentDivider } from "@/components/ds/content-divider";
import {
  Dropdown,
  DropdownButtonRow,
  DropdownCaption,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownHeading,
  DropdownItem,
  DropdownPanel,
  DropdownRow,
  DropdownSearch,
  DropdownSeparator,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
  type DropdownRowProps,
  type DropdownRowType,
} from "@/components/ds/dropdown";
import { LinkButton } from "@/components/ds/link-button";
import {
  AddIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  InfoIcon,
  LogoutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

// Flags are emoji until flag artwork is added; a grey card stands in for a card brand's logo.
const flag = (f: string) => <span className="text-paragraph-sm">{f}</span>;
const card = <span className="size-full rounded-corner-4 bg-bg-soft-200" />;

/** Each type with its picture at Small and at Large. */
const TYPES: { type: DropdownRowType; label: string; sm: React.ReactNode; lg: React.ReactNode }[] = [
  { type: "basic", label: "Profile", sm: <UserIcon />, lg: <UserIcon /> },
  { type: "country", label: "United States", sm: flag("🇺🇸"), lg: flag("🇺🇸") },
  { type: "avatar", label: "Maya Patel", sm: <Avatar size="20" name="Maya Patel" />, lg: <Avatar size="40" name="Maya Patel" /> },
  { type: "provider", label: "Visa ending 4242", sm: card, lg: card },
  { type: "brand", label: "Slack", sm: <img src="/brand/slack.svg" alt="" />, lg: <img src="/brand/slack.svg" alt="" /> },
  { type: "company", label: "Microsoft", sm: <img src="/brand/microsoft.svg" alt="" />, lg: <img src="/brand/microsoft.svg" alt="" /> },
];

const STATES: { id: string; label: string; props: Partial<DropdownRowProps> }[] = [
  { id: "default", label: "Default", props: {} },
  { id: "hover", label: "Hover", props: { "data-force": "hover" } },
  { id: "selected", label: "Selected", props: { checked: true } },
  { id: "selected-hover", label: "Selected Hover", props: { checked: true, "data-force": "hover" } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
];

export function DropdownSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: open each menu">
        <div className="flex flex-wrap items-start gap-space-24">
          <Dropdown>
            <DropdownTrigger asChild>
              <Button tone="neutral" variant="stroke" size="sm" trailingIcon={<ChevronDownIcon />}>
                Account
              </Button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem label="Profile" picture={<UserIcon />} shortcut="⌘P" />
              <DropdownItem label="Settings" picture={<SettingsIcon />} shortcut="⌘," />
              <DropdownCheckboxItem label="Notifications" picture={<BellIcon />} control="switch" defaultChecked />
              <DropdownSub>
                <DropdownSubTrigger label="Theme" picture={<SunIcon />} />
                <DropdownSubContent width="content">
                  <DropdownCheckboxItem label="Light" picture={<SunIcon />} defaultChecked />
                  <DropdownCheckboxItem label="Dark" picture={<MoonIcon />} />
                </DropdownSubContent>
              </DropdownSub>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownHeading>Support</DropdownHeading>
                <DropdownItem label="Help Center" picture={<InfoIcon />} />
                <DropdownItem label="Changelog" picture={<HomeIcon />} badge={<Badge variant="lighter" color="blue">New</Badge>} />
                <DropdownItem label="Billing" picture={<SettingsIcon />} disabled badge={<Badge variant="lighter" color="gray">Soon</Badge>} />
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownItem label="Log out" picture={<LogoutIcon />} />
            </DropdownContent>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger asChild>
              <Button tone="neutral" variant="stroke" size="sm" trailingIcon={<ChevronDownIcon />}>
                Workspace
              </Button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownSearch placeholder="Search workspaces" />
              <DropdownCheckboxItem label="8bit" sublabel="(Owner)" picture={<img src="/brand/microsoft.svg" alt="" />} type="company" defaultChecked />
              <DropdownCheckboxItem label="Neutrino Labs" picture={<img src="/brand/slack.svg" alt="" />} type="brand" />
              <DropdownCheckboxItem label="Design Guild" picture={<img src="/brand/notion.svg" alt="" />} type="brand" />
              <DropdownSeparator />
              <DropdownButtonRow leadingIcon={<AddIcon />}>Add Workspace</DropdownButtonRow>
              <DropdownCaption>v.1.5.69 · Terms &amp; Conditions</DropdownCaption>
            </DropdownContent>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger asChild>
              <Button tone="neutral" variant="stroke" size="sm" trailingIcon={<ChevronDownIcon />}>
                Members, Large rows
              </Button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem size="lg" type="avatar" label="Maya Patel" description="maya@8bit.ai" picture={<Avatar size="40" name="Maya Patel" />} />
              <DropdownItem size="lg" type="avatar" label="Lena Fischer" description="lena@8bit.ai" picture={<Avatar size="40" name="Lena Fischer" />} />
              <DropdownItem size="lg" label="Invite people" description="Send a link by email" picture={<AddIcon />} />
            </DropdownContent>
          </Dropdown>
        </div>
      </Group>

      <Group label="The menu, still: a heading, rows, a divider and the extra rows">
        <DropdownPanel>
          <DropdownSearch placeholder="Search" />
          <ContentDivider type="text">Support</ContentDivider>
          <DropdownRow label="Help Center" picture={<InfoIcon />} shortcut="⌘H" />
          <DropdownRow label="Settings" picture={<SettingsIcon />} rightIcon={<ChevronRightIcon />} />
          <ContentDivider type="line-spacing" />
          <DropdownRow label="Log out" picture={<LogoutIcon />} />
          <DropdownButtonRow leadingIcon={<AddIcon />}>Add Workspace</DropdownButtonRow>
          <DropdownCaption>v.1.5.69 · Terms &amp; Conditions</DropdownCaption>
        </DropdownPanel>
      </Group>

      {(["sm", "lg"] as const).map((size) => (
        <Group key={size} label={`${size === "sm" ? "Small 36" : "Large 56"}, every type and state (the Checkbox shows the pick)`}>
          <div className="flex flex-wrap items-start gap-space-24">
            {STATES.map((s) => (
              <Labelled key={s.id} label={s.label}>
                <DropdownPanel>
                  {TYPES.map((t) => (
                    <DropdownRow
                      key={t.type}
                      size={size}
                      type={t.type}
                      checkbox
                      picture={size === "sm" ? t.sm : t.lg}
                      label={t.label}
                      sublabel={size === "sm" ? "(Sublabel)" : undefined}
                      description={size === "lg" ? "A line of description" : undefined}
                      {...s.props}
                    />
                  ))}
                </DropdownPanel>
              </Labelled>
            ))}
          </div>
        </Group>
      ))}

      <Group label="The parts on the right, in Default, Hover and Disabled">
        <div className="flex flex-wrap items-start gap-space-24">
          {STATES.filter((s) => ["default", "hover", "disabled"].includes(s.id)).map((s) => {
            const off = s.id === "disabled";
            return (
              <Labelled key={s.id} label={s.label}>
                <DropdownPanel>
                  <DropdownRow label="Badge" picture={<HomeIcon />} badge={<Badge variant="lighter" color={off ? "gray" : "blue"}>New</Badge>} {...s.props} />
                  <DropdownRow label="Shortcut key" picture={<HomeIcon />} shortcut="⌘1" {...s.props} />
                  <DropdownRow label="Switch" picture={<BellIcon />} toggle checked {...s.props} />
                  <DropdownRow
                    label="Link Button"
                    picture={<HomeIcon />}
                    action={
                      <LinkButton variant="primary" size="md" disabled={off}>
                        Upgrade
                      </LinkButton>
                    }
                    {...s.props}
                  />
                  <DropdownRow label="Sub-menu" picture={<SettingsIcon />} rightIcon={<ChevronRightIcon />} {...s.props} />
                  <DropdownRow label="Check" picture={<UserIcon />} rightIcon={<CheckIcon />} {...s.props} />
                  <DropdownRow
                    size="lg"
                    label="Button"
                    description="Large rows take a Button"
                    picture={<img src="/brand/slack.svg" alt="" />}
                    type="brand"
                    action={
                      <Button tone="primary" variant="lighter" size="xs" disabled={off}>
                        Connect
                      </Button>
                    }
                    {...s.props}
                  />
                </DropdownPanel>
              </Labelled>
            );
          })}
        </div>
      </Group>

      <Group label="Extra rows: Search in Default, Hover, Active (typing) and Active Hover; Button; Caption">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="Search, Default">
            <DropdownPanel>
              <DropdownSearch />
            </DropdownPanel>
          </Labelled>
          <Labelled label="Search, Hover">
            <DropdownPanel>
              <DropdownSearch data-force="hover" />
            </DropdownPanel>
          </Labelled>
          <Labelled label="Search, Active">
            <DropdownPanel>
              <DropdownSearch defaultValue="Neutrino" />
            </DropdownPanel>
          </Labelled>
          <Labelled label="Search, Active Hover">
            <DropdownPanel>
              <DropdownSearch defaultValue="Neutrino" data-force="hover" />
            </DropdownPanel>
          </Labelled>
          <Labelled label="Button">
            <DropdownPanel>
              <DropdownButtonRow leadingIcon={<AddIcon />}>Add Workspace</DropdownButtonRow>
            </DropdownPanel>
          </Labelled>
          <Labelled label="Caption">
            <DropdownPanel>
              <DropdownCaption>v.1.5.69 · Terms &amp; Conditions</DropdownCaption>
            </DropdownPanel>
          </Labelled>
        </div>
      </Group>

      <Group label="Keyboard focus (ours): the Neutral focus ring">
        <DropdownPanel>
          <DropdownRow label="Profile" picture={<UserIcon />} />
          <DropdownRow label="Settings" picture={<SettingsIcon />} data-force="focus" />
          <DropdownRow label="Log out" picture={<LogoutIcon />} />
        </DropdownPanel>
      </Group>
    </div>
  );
}
