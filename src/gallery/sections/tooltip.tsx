"use client";

import { Button } from "@/components/ds/button";
import { Tooltip, TooltipPanel, type TooltipSize, type TooltipTail, type TooltipVariant } from "@/components/ds/tooltip";
import { CopyIcon, DeleteIcon, InfoIcon, StarIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const SIZES: { id: TooltipSize; label: string }[] = [
  { id: "2xs", label: "2X-Small 20" },
  { id: "xs", label: "X-Small 28" },
  { id: "lg", label: "Large" },
];
const VARIANTS: { id: TooltipVariant; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];
const TAILS: { id: TooltipTail; label: string }[] = [
  { id: "none", label: "No tail" },
  { id: "top-left", label: "Top left" },
  { id: "top-center", label: "Top centre" },
  { id: "top-right", label: "Top right" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom-center", label: "Bottom centre" },
  { id: "bottom-right", label: "Bottom right" },
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
];

/** One still tooltip, with room around it for its tail. */
function Still({ size, variant, tail }: { size: TooltipSize; variant: TooltipVariant; tail: TooltipTail }) {
  return (
    <div className="p-space-12">
      {size === "lg" ? (
        <TooltipPanel
          size="lg"
          variant={variant}
          tail={tail}
          icon={<InfoIcon />}
          title="Shared with your team"
          description="Everyone in this workspace can open and edit this report."
          close
        />
      ) : (
        <TooltipPanel size={size} variant={variant} tail={tail}>
          Copy link
        </TooltipPanel>
      )}
    </div>
  );
}

export function TooltipSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {SIZES.map((s) =>
        VARIANTS.map((v) => (
          <Group key={`${s.id}-${v.id}`} label={`${s.label}, ${v.label}, every tail`}>
            <div className="flex flex-wrap items-center gap-x-space-16 gap-y-space-8">
              {TAILS.map((t) => (
                <Labelled key={t.id} label={t.label}>
                  <Still size={s.id} variant={v.id} tail={t.id} />
                </Labelled>
              ))}
            </div>
          </Group>
        )),
      )}

      <Group label="Large, without the icon, or without the close button">
        <div className="flex flex-wrap items-start gap-space-24">
          {VARIANTS.map((v) => (
            <Labelled key={`${v.id}-no-icon`} label={`${v.label}, no icon`}>
              <div className="p-space-12">
                <TooltipPanel size="lg" variant={v.id} tail="top-left" title="Shared with your team" description="Everyone in this workspace can open and edit this report." close />
              </div>
            </Labelled>
          ))}
          {VARIANTS.map((v) => (
            <Labelled key={`${v.id}-no-close`} label={`${v.label}, no close button`}>
              <div className="p-space-12">
                <TooltipPanel size="lg" variant={v.id} tail="top-left" icon={<InfoIcon />} title="Shared with your team" description="Everyone in this workspace can open and edit this report." />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Try it: hover or tab to each button">
        <div className="flex flex-wrap items-center gap-space-24 py-space-48">
          <Tooltip content="Copy link" size="2xs" tail="bottom-center">
            <Button tone="neutral" variant="stroke" size="sm" leadingIcon={<CopyIcon />} aria-label="Copy link" />
          </Tooltip>
          <Tooltip content="Add to favourites" size="xs" variant="light" tail="top-center">
            <Button tone="neutral" variant="stroke" size="sm" leadingIcon={<StarIcon />} aria-label="Add to favourites" />
          </Tooltip>
          <Tooltip content="Delete" size="xs" tail="left">
            <Button tone="error" variant="lighter" size="sm" leadingIcon={<DeleteIcon />} aria-label="Delete" />
          </Tooltip>
          <Tooltip content="No tail, opens above" size="xs" variant="light">
            <Button tone="neutral" variant="stroke" size="sm">
              Hover me
            </Button>
          </Tooltip>
          <Tooltip
            size="lg"
            variant="light"
            tail="bottom-left"
            icon={<InfoIcon />}
            title="Shared with your team"
            description="Everyone in this workspace can open and edit this report."
          >
            <Button tone="neutral" variant="stroke" size="sm" leadingIcon={<InfoIcon />}>
              Sharing
            </Button>
          </Tooltip>
        </div>
      </Group>
    </div>
  );
}
