"use client";

import { Badge } from "@/components/ds/badge";
import { CompactButton } from "@/components/ds/compact-button";
import { ContentDivider } from "@/components/ds/content-divider";
import { TabMenu, TabMenuContent, TabMenuList, TabMenuTrigger } from "@/components/ds/tab-menu";
import { BellIcon, HomeIcon, LockIcon, MoreIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const TABS = [
  { value: "overview", label: "Overview", icon: <HomeIcon /> },
  { value: "members", label: "Members", icon: <UserIcon /> },
  { value: "alerts", label: "Alerts", icon: <BellIcon /> },
  { value: "security", label: "Security", icon: <LockIcon /> },
] as const;

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "active", label: "Active" },
] as const;

// The page names no Badge for a tab, nor a style for the Compact Button at the
// end of the bar. Shown here: the count the Notification Feed's tabs use
// (notification-feed.md: Filled, Red, Small, a number), and a Ghost, Medium
// (20) Compact Button, the tab row's height.
const count = (n: number) => (
  <Badge size="sm" variant="filled" color="red" number>
    {n}
  </Badge>
);
const more = (
  <CompactButton variant="ghost" size="md" aria-label="More views">
    <MoreIcon />
  </CompactButton>
);

type StateId = (typeof STATES)[number]["id"];
const force = (s: StateId) => (s === "hover" || s === "focus" ? s : undefined);

/** A small menu holding one tab in the given state. */
function OneTab({
  state,
  orientation,
  icon = true,
  badge = false,
  arrow = false,
}: {
  state: StateId;
  orientation: "horizontal" | "vertical";
  icon?: boolean;
  badge?: boolean;
  arrow?: boolean;
}) {
  return (
    <TabMenu value={state === "active" ? "members" : "none"} orientation={orientation}>
      <TabMenuList aria-label={`Tab, ${state}`} variant="list" className={orientation === "vertical" ? "w-tab-menu-vertical" : undefined}>
        <TabMenuTrigger value="members" icon={icon ? <UserIcon /> : undefined} badge={badge ? count(4) : undefined} arrow={arrow} data-force={force(state)}>
          Members
        </TabMenuTrigger>
      </TabMenuList>
    </TabMenu>
  );
}

export function TabMenuSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Horizontal, try it: a Badge on Alerts, a Compact Button at the end">
        <TabMenu defaultValue="overview">
          <TabMenuList aria-label="Project" end={more}>
            {TABS.map((t) => (
              <TabMenuTrigger key={t.value} value={t.value} icon={t.icon} badge={t.value === "alerts" ? count(3) : undefined}>
                {t.label}
              </TabMenuTrigger>
            ))}
          </TabMenuList>
          {TABS.map((t) => (
            <TabMenuContent key={t.value} value={t.value} className="pt-space-16 text-paragraph-sm text-text-sub-600">
              The {t.label} view.
            </TabMenuContent>
          ))}
        </TabMenu>
      </Group>

      <Group label="Horizontal tab: word, icon, Badge, arrow">
        <div className="flex flex-wrap items-end gap-space-32">
          <Labelled label="Word only">
            <OneTab state="active" orientation="horizontal" icon={false} />
          </Labelled>
          <Labelled label="Icon and word">
            <OneTab state="active" orientation="horizontal" />
          </Labelled>
          <Labelled label="Icon, word and arrow">
            <OneTab state="active" orientation="horizontal" arrow />
          </Labelled>
          <Labelled label="Icon, word and Badge">
            <OneTab state="active" orientation="horizontal" badge />
          </Labelled>
          <Labelled label="Icon, word, Badge and arrow">
            <OneTab state="active" orientation="horizontal" badge arrow />
          </Labelled>
        </div>
      </Group>

      <Group label="Horizontal tab states">
        <div className="flex flex-wrap items-end gap-space-32">
          {STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <OneTab state={s.id} orientation="horizontal" arrow />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Vertical, Card style and List style, with the heading (a Content Divider, Text) and a Badge, try them">
        <div className="flex flex-wrap items-start gap-space-32">
          {(["card", "list"] as const).map((variant) => (
            <Labelled key={variant} label={variant === "card" ? "Card style" : "List style"}>
              <TabMenu defaultValue="overview" orientation="vertical">
                <TabMenuList
                  aria-label={`Settings, ${variant} style`}
                  variant={variant}
                  heading={<ContentDivider type="text">Settings</ContentDivider>}
                  className="w-tab-menu-vertical"
                >
                  {TABS.map((t) => (
                    <TabMenuTrigger key={t.value} value={t.value} icon={t.icon} badge={t.value === "alerts" ? count(3) : undefined} arrow={t.value === "security"}>
                      {t.label}
                    </TabMenuTrigger>
                  ))}
                </TabMenuList>
              </TabMenu>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Vertical row states">
        <div className="flex flex-wrap items-start gap-space-32">
          {STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <OneTab state={s.id} orientation="vertical" arrow />
            </Labelled>
          ))}
        </div>
      </Group>
    </div>
  );
}
