"use client";

import { Avatar } from "@/components/ds/avatar";
import { Badge } from "@/components/ds/badge";
import { Checkbox, CheckboxCard, CheckboxLabel, type ChoiceCardContent } from "@/components/ds/checkbox";
import { KeyIcon } from "@/components/ds/key-components";
import { LinkButton } from "@/components/ds/link-button";
import { MailIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const SIZES = [
  { id: "md", label: "Medium 20" },
  { id: "sm", label: "Small 16" },
] as const;
const VALUES = [
  { id: "off", label: "Off", checked: false },
  { id: "on", label: "On", checked: true },
  { id: "indeterminate", label: "Indeterminate", checked: "indeterminate" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focused" },
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
      <MailIcon />
    </KeyIcon>
  ),
  title: "Email updates",
  sublabel: "(Weekly)",
  description: "A summary of new runs.",
};
const CARD_TYPES: { caption: string; card: ChoiceCardContent }[] = [
  { caption: "Basic", card: { type: "basic", title: "Email updates", sublabel: "(Weekly)", description: "A summary of new runs." } },
  { caption: "Left Icon (a Key Icon, 40)", card: LEFT_ICON },
  {
    caption: "Avatar (40)",
    card: { type: "avatar", picture: <Avatar size="40" name="Nitesh Arora" color="blue" />, title: "Nitesh Arora", sublabel: "(You)", description: "Product designer" },
  },
  {
    caption: "Card Provider (a logo, 32 x 24)",
    card: { type: "card-provider", picture: <span className="size-full bg-bg-soft-200" />, title: "Card ending 4242", description: "Expires 08/28" },
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

export function CheckboxSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {SIZES.map((size) => (
        <Group key={size.id} label={`The box, ${size.label}, every value and state`}>
          <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
            {VALUES.map((v) =>
              STATES.map((s) => (
                <Labelled key={`${v.id}-${s.id}`} label={`${v.label}, ${s.label}`}>
                  <Checkbox
                    size={size.id}
                    defaultChecked={v.checked}
                    data-force={s.id === "hover" || s.id === "focus" ? s.id : undefined}
                    disabled={s.id === "disabled"}
                    aria-label={`${v.label}, ${s.label}`}
                  />
                </Labelled>
              )),
            )}
          </div>
        </Group>
      ))}

      <Group label="Checkbox Label">
        <div className="grid grid-cols-[repeat(3,max-content)] gap-x-space-40 gap-y-space-24">
          <Labelled label="One line, Off">
            <CheckboxLabel label="Remember me" />
          </Labelled>
          <Labelled label="One line, On">
            <CheckboxLabel label="Remember me" defaultChecked />
          </Labelled>
          <Labelled label="One line, (Sublabel) and Badge">
            <CheckboxLabel label="Email updates" sublabel="(Weekly)" badge={badge()} />
          </Labelled>
          <Labelled label="With description">
            <CheckboxLabel label="Email updates" description="A summary of new runs, once a week." />
          </Labelled>
          <Labelled label="With description, (Sublabel) and Badge, On">
            <CheckboxLabel label="Email updates" sublabel="(Weekly)" badge={badge()} description="A summary of new runs, once a week." defaultChecked />
          </Labelled>
          <Labelled label="With description and link">
            <CheckboxLabel label="Email updates" sublabel="(Weekly)" badge={badge()} description="A summary of new runs, once a week." link={link()} />
          </Labelled>
          <Labelled label="Flip, one line">
            <CheckboxLabel label="Remember me" flip />
          </Labelled>
          <Labelled label="Flip, with description">
            <CheckboxLabel label="Email updates" description="A summary of new runs, once a week." flip />
          </Labelled>
          <Labelled label="Flip, with description and link, On">
            <CheckboxLabel label="Email updates" description="A summary of new runs, once a week." link={link()} flip defaultChecked />
          </Labelled>
          <Labelled label="Disabled, one line, Badge Gray (ours)">
            <CheckboxLabel label="Remember me" sublabel="(30 days)" badge={badge(true)} disabled />
          </Labelled>
          <Labelled label="Disabled, with description and link, On (ours)">
            <CheckboxLabel
              label="Email updates"
              sublabel="(Weekly)"
              badge={badge(true)}
              description="A summary of new runs, once a week."
              link={link(true)}
              defaultChecked
              disabled
            />
          </Labelled>
        </div>
      </Group>

      <Group label="Checkbox Card, Basic, every state">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Default">
            <CheckboxCard className="w-90" title="Email updates" sublabel="(Weekly)" badge={badge()} description="A summary of new runs." />
          </Labelled>
          <Labelled label="Hover">
            <CheckboxCard className="w-90" title="Email updates" sublabel="(Weekly)" badge={badge()} description="A summary of new runs." data-force="hover" />
          </Labelled>
          <Labelled label="Active">
            <CheckboxCard className="w-90" title="Email updates" sublabel="(Weekly)" badge={badge()} description="A summary of new runs." defaultChecked />
          </Labelled>
          <Labelled label="Disabled, Badge Gray">
            <CheckboxCard className="w-90" title="Email updates" sublabel="(Weekly)" badge={badge(true)} description="A summary of new runs." disabled />
          </Labelled>
        </div>
      </Group>

      <Group label="Checkbox Card, Left Icon, every state">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Default">
            <CheckboxCard {...LEFT_ICON} className="w-90" badge={badge()} />
          </Labelled>
          <Labelled label="Hover">
            <CheckboxCard {...LEFT_ICON} className="w-90" badge={badge()} data-force="hover" />
          </Labelled>
          <Labelled label="Active">
            <CheckboxCard {...LEFT_ICON} className="w-90" badge={badge()} defaultChecked />
          </Labelled>
          <Labelled label="Disabled, Badge Gray">
            <CheckboxCard {...LEFT_ICON} className="w-90" badge={badge(true)} disabled />
          </Labelled>
        </div>
      </Group>

      <Group label="Checkbox Card, every type">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          {CARD_TYPES.map(({ caption, card }) => (
            <Labelled key={caption} label={caption}>
              <CheckboxCard {...card} className="w-90" defaultChecked={card.type === "avatar"} />
            </Labelled>
          ))}
        </div>
      </Group>
    </div>
  );
}
