"use client";

import { useState } from "react";

import { ButtonGroup, ButtonGroupItem } from "@/components/ds/button-group";
import { ContentDivider } from "@/components/ds/content-divider";
import { AddIcon, ChevronDownIcon, CopyIcon, DeleteIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

/** One divider at full width, with its name under it. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-space-6">
      {children}
      <span className="text-paragraph-xs text-text-soft-400">{label}</span>
    </div>
  );
}

export function ContentDividerSection() {
  const [more, setMore] = useState(0);
  const [view, setView] = useState("Members");
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Every type, full width">
        <div className="flex max-w-2xl flex-col gap-space-24">
          <Row label="Line, 1">
            <ContentDivider type="line" />
          </Row>
          <Row label="Line Spacing, 4">
            <ContentDivider type="line-spacing" />
          </Row>
          <Row label="Text and Line, 12">
            <ContentDivider type="text-line">Or</ContentDivider>
          </Row>
          <Row label="Text, 24">
            <ContentDivider type="text">Today</ContentDivider>
          </Row>
          <Row label="Solid Text, 28">
            <ContentDivider type="solid-text">Today</ContentDivider>
          </Row>
          <Row label="Icon Button, 32 (press it)">
            <ContentDivider type="icon-button" icon={<AddIcon />} buttonLabel="Add a section" onButtonClick={() => setMore((n) => n + 1)} />
          </Row>
          <Row label="Icon Button Group, 32: the Button Group, X-Small">
            <ContentDivider type="icon-button-group">
              <ButtonGroup size="xs" aria-label="Section">
                <ButtonGroupItem leadingIcon={<AddIcon />} aria-label="Add" />
                <ButtonGroupItem leadingIcon={<CopyIcon />} aria-label="Copy" />
                <ButtonGroupItem leadingIcon={<DeleteIcon />} aria-label="Delete" />
              </ButtonGroup>
            </ContentDivider>
          </Row>
          <Row label={`Text Button, 32 (pressed ${more} times)`}>
            <ContentDivider type="text-button" icon={<ChevronDownIcon />} onButtonClick={() => setMore((n) => n + 1)}>
              Show more
            </ContentDivider>
          </Row>
          <Row label="Text Button Group, 32: the Button Group, X-Small (pick one)">
            <ContentDivider type="text-button-group">
              <ButtonGroup size="xs" aria-label="View">
                {["Overview", "Members", "Billing"].map((v) => (
                  <ButtonGroupItem key={v} active={view === v} onClick={() => setView(v)}>
                    {v}
                  </ButtonGroupItem>
                ))}
              </ButtonGroup>
            </ContentDivider>
          </Row>
        </div>
      </Group>

      <Group label="In a list">
        <Labelled label="Lines between rows, then Text and Line">
          <div className="flex w-80 flex-col gap-space-12 text-paragraph-sm text-text-sub-600">
            <span>Overview</span>
            <ContentDivider type="line" />
            <span>Members</span>
            <ContentDivider type="line" />
            <span>Reports</span>
            <ContentDivider type="text-line">Or</ContentDivider>
            <span>Settings</span>
          </div>
        </Labelled>
      </Group>
    </div>
  );
}
