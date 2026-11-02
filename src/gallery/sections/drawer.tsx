"use client";

import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ds/button";
import { CheckboxLabel } from "@/components/ds/checkbox";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerSection as Section,
  DrawerTrigger,
  type DrawerFooterType,
} from "@/components/ds/drawer";
import { ContentLabel, KeyIcon } from "@/components/ds/key-components";
import { LinkButton } from "@/components/ds/link-button";
import { StepperDot } from "@/components/ds/step-indicator";
import { SwitchLabel } from "@/components/ds/switch";
import { TextInput } from "@/components/ds/text-input";
import { CalendarIcon, FileIcon, StepApprovalIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const FOOTER_TYPES: { id: DrawerFooterType; label: string }[] = [
  { id: "stretch", label: "Stretch (the default)" },
  { id: "basic", label: "Basic" },
  { id: "checkbox", label: "Checkbox" },
  { id: "toggle", label: "Toggle" },
  { id: "stepper", label: "Stepper" },
  { id: "link-button", label: "Link Button" },
];

function footerLeading(type: DrawerFooterType) {
  switch (type) {
    case "checkbox":
      return <CheckboxLabel label="Keep it open" />;
    case "toggle":
      return <SwitchLabel label="Notify the team" />;
    case "stepper":
      return <StepperDot size="sm" count={3} current={1} />;
    case "link-button":
      return (
        <LinkButton variant="gray" size="md" underline>
          Learn more
        </LinkButton>
      );
    default:
      return undefined;
  }
}

/** A drawer's body: sections split by Solid Text bands. */
function Details() {
  return (
    <>
      <Section>
        <ContentLabel picture={<KeyIcon size="md"><FileIcon /></KeyIcon>} title="Q3 revenue.xlsx" description="2.4 MB, uploaded today" />
        <p className="text-paragraph-sm text-text-sub-600">The sheet the October report reads from. Runs pick up a new copy every morning.</p>
      </Section>
      <Section band="Owner">
        <ContentLabel picture={<KeyIcon size="md"><UserIcon /></KeyIcon>} title="Ana Silva" description="ana@8bit.ai" />
      </Section>
      <Section band="Schedule">
        <ContentLabel picture={<KeyIcon size="md"><CalendarIcon /></KeyIcon>} title="Every weekday" description="At 8:00, in your time zone" />
        <TextInput label="Note" placeholder="Add a note for the team" />
      </Section>
    </>
  );
}

/** A grey page with the drawer against its right edge. */
function Screen({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end overflow-hidden rounded-corner-12 bg-bg-weak-50">{children}</div>;
}

export function DrawerSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: open a real drawer (Escape or the close button closes it)">
        <div className="flex flex-wrap gap-space-12">
          <Drawer>
            <DrawerTrigger asChild>
              <Button>Beside the work (no backdrop)</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader size="lg" type="left-icon" icon={<FileIcon />} title="File details" description="Shared with the Finance team." line />
              <DrawerBody>
                <Details />
                <Details />
              </DrawerBody>
              <DrawerFooter cancel="Close" confirm="Save" />
            </DrawerContent>
          </Drawer>

          <Drawer backdrop>
            <DrawerTrigger asChild>
              <Button tone="neutral" variant="stroke">
                With the backdrop
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader title="File details" badge={<Badge variant="filled" color="red" number>2</Badge>} line />
              <DrawerBody>
                <Details />
              </DrawerBody>
              <DrawerFooter type="checkbox" leading={footerLeading("checkbox")} cancel="Close" confirm="Save" />
            </DrawerContent>
          </Drawer>
        </div>
      </Group>

      <Group label="Floating: 8 in from the edges, corner 20, the medium shadow; Header, Medium (the step drawer)">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="Floating, Medium header with a picture">
            <Screen>
              <div className="p-drawer-inset">
                <DrawerPanel floating>
                  <DrawerHeader
                    size="md"
                    type="left-icon"
                    icon={
                      <span className="flex items-center justify-center bg-primary-base text-label-xs text-static-white">J</span>
                    }
                    title="Open a Jira issue"
                    description="Jira, create issue"
                    line
                  />
                  <DrawerBody>
                    <Details />
                  </DrawerBody>
                </DrawerPanel>
              </div>
            </Screen>
          </Labelled>
          <Labelled label="Floating, Small header with a picture (every step drawer, 22 Oct 2026)">
            <Screen>
              <div className="p-drawer-inset">
                <DrawerPanel floating>
                  <DrawerHeader
                    size="sm"
                    picture={
                      <span className="flex items-center justify-center bg-state-warning-dark text-text-white-0 [&_svg]:size-space-14">
                        <StepApprovalIcon />
                      </span>
                    }
                    title="Approve the fix"
                    line
                  />
                  <DrawerBody>
                    <Details />
                  </DrawerBody>
                </DrawerPanel>
              </div>
            </Screen>
          </Labelled>
          <Labelled label="Medium, Basic">
            <Screen>
              <div className="p-drawer-inset">
                <DrawerPanel floating>
                  <DrawerHeader size="md" title="File details" description="Shared with the Finance team." line />
                </DrawerPanel>
              </div>
            </Screen>
          </Labelled>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button tone="neutral" variant="stroke" className="self-start">
              Open a floating drawer
            </Button>
          </DrawerTrigger>
          <DrawerContent floating>
            <DrawerHeader size="md" type="left-icon" icon={<FileIcon />} title="File details" description="Shared with the Finance team." line />
            <DrawerBody>
              <Details />
            </DrawerBody>
            <DrawerFooter cancel="Close" confirm="Save" />
          </DrawerContent>
        </Drawer>
      </Group>

      <Group label="The panel: 400 wide, against the right edge, a line down its left side">
        <Screen>
          <DrawerPanel>
            <DrawerHeader size="lg" type="left-icon" icon={<FileIcon />} title="File details" description="Shared with the Finance team." line />
            <DrawerBody>
              <Details />
            </DrawerBody>
            <DrawerFooter />
          </DrawerPanel>
        </Screen>
      </Group>

      {(["sm", "lg"] as const).map((size) => (
        <Group key={size} label={size === "sm" ? "Header, Small 64" : "Header, Large 88"}>
          <div className="flex flex-wrap items-start gap-space-24">
            <Labelled label="Basic">
              <Screen>
                <DrawerPanel>
                  <DrawerHeader size={size} title="File details" description="Shared with the Finance team." />
                </DrawerPanel>
              </Screen>
            </Labelled>
            <Labelled label="Left Icon">
              <Screen>
                <DrawerPanel>
                  <DrawerHeader size={size} type="left-icon" icon={<FileIcon />} title="File details" description="Shared with the Finance team." />
                </DrawerPanel>
              </Screen>
            </Labelled>
            <Labelled label="Left Icon, number Badge">
              <Screen>
                <DrawerPanel>
                  <DrawerHeader
                    size={size}
                    type="left-icon"
                    icon={<FileIcon />}
                    title="Comments"
                    description="On Q3 revenue.xlsx."
                    badge={<Badge variant="filled" color="red" number>2</Badge>}
                  />
                </DrawerPanel>
              </Screen>
            </Labelled>
            <Labelled label="Left Icon, Link Button">
              <Screen>
                <DrawerPanel>
                  <DrawerHeader
                    size={size}
                    type="left-icon"
                    icon={<FileIcon />}
                    title="File details"
                    description="Shared with the Finance team."
                    link={
                      <LinkButton variant="gray" size="md">
                        Edit
                      </LinkButton>
                    }
                  />
                </DrawerPanel>
              </Screen>
            </Labelled>
            <Labelled label="Left Icon, line">
              <Screen>
                <DrawerPanel>
                  <DrawerHeader size={size} type="left-icon" icon={<FileIcon />} title="File details" description="Shared with the Finance team." line />
                </DrawerPanel>
              </Screen>
            </Labelled>
            <Labelled label="Basic, close off">
              <Screen>
                <DrawerPanel>
                  <DrawerHeader size={size} title="File details" description="Shared with the Finance team." close={false} />
                </DrawerPanel>
              </Screen>
            </Labelled>
          </div>
        </Group>
      ))}

      <Group label="Footer, every type, two buttons">
        <div className="flex flex-wrap items-start gap-space-24">
          {FOOTER_TYPES.map((t) => (
            <Labelled key={t.id} label={t.label}>
              <Screen>
                <DrawerPanel>
                  <DrawerFooter type={t.id} leading={footerLeading(t.id)} />
                </DrawerPanel>
              </Screen>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Footer, one button">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="Stretch">
            <Screen>
              <DrawerPanel>
                <DrawerFooter cancel={null} />
              </DrawerPanel>
            </Screen>
          </Labelled>
          <Labelled label="Basic">
            <Screen>
              <DrawerPanel>
                <DrawerFooter type="basic" cancel={null} />
              </DrawerPanel>
            </Screen>
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
