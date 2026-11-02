"use client";

import { Avatar } from "@/components/ds/avatar";
import { Badge } from "@/components/ds/badge";
import type { ChoiceCardContent } from "@/components/ds/checkbox";
import { KeyIcon } from "@/components/ds/key-components";
import { LinkButton } from "@/components/ds/link-button";
import { IntegrationSwitch, Switch, SwitchCard, SwitchLabel } from "@/components/ds/switch";
import { BellIcon, GithubIcon, SlackIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const VALUES = [
  { id: "off", label: "Off", checked: false },
  { id: "on", label: "On", checked: true },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "active", label: "Pressed" },
  { id: "focus", label: "Focus (ours)" },
  { id: "disabled", label: "Disabled" },
] as const;

/** The Badge on the title line: Light, Blue, turning Gray when disabled (checkbox.md). */
const badge = (disabled?: boolean) => (
  <Badge size="sm" variant="light" color={disabled ? "gray" : "blue"}>
    New
  </Badge>
);

/** The link under the description: the Link Button, Primary, Small (16). */
const link = (disabled?: boolean) => (
  <LinkButton variant="primary" size="sm" underline disabled={disabled}>
    Learn more
  </LinkButton>
);

/** The six card types, each with its picture on the left. The brand and
 *  company logos are files in public/brand; a grey card stands in for a card
 *  brand's logo until its artwork is added. */
const LEFT_ICON: ChoiceCardContent = {
  type: "left-icon",
  picture: (
    <KeyIcon size="md">
      <BellIcon />
    </KeyIcon>
  ),
  title: "Run alerts",
  sublabel: "(Email)",
  description: "Tell me when a run fails.",
};
const CARD_TYPES: { caption: string; card: ChoiceCardContent }[] = [
  { caption: "Basic", card: { type: "basic", title: "Run alerts", sublabel: "(Email)", description: "Tell me when a run fails." } },
  { caption: "Left Icon (a Key Icon, 40)", card: LEFT_ICON },
  {
    caption: "Avatar (40)",
    card: { type: "avatar", picture: <Avatar size="40" name="Nitesh Arora" color="blue" />, title: "Nitesh Arora", sublabel: "(You)", description: "Can approve runs." },
  },
  {
    caption: "Card Provider (a logo, 32 x 24)",
    card: { type: "card-provider", picture: <span className="size-full bg-bg-soft-200" />, title: "Card ending 4242", description: "Pay with this card." },
  },
  {
    caption: "Brand (a logo, 40)",
    // eslint-disable-next-line @next/next/no-img-element
    card: { type: "brand", picture: <img src="/brand/slack.svg" alt="" />, title: "Slack", description: "Post run alerts to a channel." },
  },
  {
    caption: "Company (a logo, 40)",
    // eslint-disable-next-line @next/next/no-img-element
    card: { type: "company", picture: <img src="/brand/microsoft.svg" alt="" />, title: "Microsoft", description: "Sign in with your work account." },
  },
];

// The Integration Switch's logos are Hugeicons stand-ins.
export function SwitchSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="The switch, every value and state">
        <div className="grid grid-cols-[repeat(5,max-content)] gap-x-space-32 gap-y-space-16">
          {VALUES.map((v) =>
            STATES.map((s) => (
              <Labelled key={`${v.id}-${s.id}`} label={`${v.label}, ${s.label}`}>
                <Switch
                  defaultChecked={v.checked}
                  data-force={s.id === "hover" || s.id === "active" || s.id === "focus" ? s.id : undefined}
                  disabled={s.id === "disabled"}
                  aria-label={`${v.label}, ${s.label}`}
                />
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Switch Label">
        <div className="grid grid-cols-[repeat(3,max-content)] gap-x-space-40 gap-y-space-24">
          <Labelled label="One line, Off">
            <SwitchLabel label="Dark mode" />
          </Labelled>
          <Labelled label="One line, On, (Sublabel) and Badge">
            <SwitchLabel label="Dark mode" sublabel="(Beta)" badge={badge()} defaultChecked />
          </Labelled>
          <Labelled label="Flip, one line">
            <SwitchLabel label="Dark mode" flip />
          </Labelled>
          <Labelled label="With description">
            <SwitchLabel label="Run alerts" description="Tell me when a run fails." defaultChecked />
          </Labelled>
          <Labelled label="With description, (Sublabel), Badge and link">
            <SwitchLabel label="Run alerts" sublabel="(Email)" badge={badge()} description="Tell me when a run fails." link={link()} />
          </Labelled>
          <Labelled label="Flip, with description and link">
            <SwitchLabel label="Run alerts" description="Tell me when a run fails." link={link()} flip />
          </Labelled>
          <Labelled label="Disabled, one line, Badge Gray (ours)">
            <SwitchLabel label="Dark mode" sublabel="(Beta)" badge={badge(true)} disabled />
          </Labelled>
          <Labelled label="Disabled, with description and link (ours)">
            <SwitchLabel label="Run alerts" sublabel="(Admins only)" badge={badge(true)} description="Tell me when a run fails." link={link(true)} disabled />
          </Labelled>
        </div>
      </Group>

      <Group label="Switch Card, Basic, every state">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Default">
            <SwitchCard className="w-90" title="Run alerts" sublabel="(Email)" badge={badge()} description="Tell me when a run fails." />
          </Labelled>
          <Labelled label="Hover">
            <SwitchCard className="w-90" title="Run alerts" sublabel="(Email)" badge={badge()} description="Tell me when a run fails." data-force="hover" />
          </Labelled>
          <Labelled label="Active">
            <SwitchCard className="w-90" title="Run alerts" sublabel="(Email)" badge={badge()} description="Tell me when a run fails." defaultChecked />
          </Labelled>
          <Labelled label="Disabled, Badge Gray">
            <SwitchCard className="w-90" title="Run alerts" sublabel="(Email)" badge={badge(true)} description="Tell me when a run fails." disabled />
          </Labelled>
        </div>
      </Group>

      <Group label="Switch Card, Left Icon, every state">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Default">
            <SwitchCard {...LEFT_ICON} className="w-90" badge={badge()} />
          </Labelled>
          <Labelled label="Hover">
            <SwitchCard {...LEFT_ICON} className="w-90" badge={badge()} data-force="hover" />
          </Labelled>
          <Labelled label="Active">
            <SwitchCard {...LEFT_ICON} className="w-90" badge={badge()} defaultChecked />
          </Labelled>
          <Labelled label="Disabled, Badge Gray">
            <SwitchCard {...LEFT_ICON} className="w-90" badge={badge(true)} disabled />
          </Labelled>
        </div>
      </Group>

      <Group label="Switch Card, every type">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          {CARD_TYPES.map(({ caption, card }) => (
            <Labelled key={caption} label={caption}>
              <SwitchCard {...card} className="w-90" defaultChecked={card.type === "avatar"} />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Integration Switch">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Horizontal, Card">
            <IntegrationSwitch
              className="w-110"
              logo={<SlackIcon />}
              title="Slack"
              badge={badge()}
              description="Post run alerts to a channel."
              action="Manage"
              defaultChecked
            />
          </Labelled>
          <Labelled label="Vertical, Card">
            <IntegrationSwitch
              className="w-75"
              direction="vertical"
              logo={<SlackIcon />}
              title="Slack"
              badge={badge()}
              description="Post run alerts to a channel."
              action="Manage"
              defaultChecked
            />
          </Labelled>
          <Labelled label="Horizontal, List (ours: no shadow)">
            <IntegrationSwitch
              className="w-110"
              variant="list"
              logo={<GithubIcon />}
              title="GitHub"
              badge={badge()}
              description="Open an issue when a run fails."
              action="Manage"
            />
          </Labelled>
          <Labelled label="Vertical, List">
            <IntegrationSwitch
              className="w-75"
              variant="list"
              direction="vertical"
              logo={<GithubIcon />}
              title="GitHub"
              description="Open an issue when a run fails."
              action="Manage"
            />
          </Labelled>
          <Labelled label="Horizontal, Card, no button, Disabled">
            <IntegrationSwitch className="w-110" logo={<SlackIcon />} title="Slack" description="Post run alerts to a channel." disabled />
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
