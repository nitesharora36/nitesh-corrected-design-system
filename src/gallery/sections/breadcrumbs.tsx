"use client";

import { BreadcrumbItem, Breadcrumbs } from "@/components/ds/breadcrumbs";
import { HomeIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const DIVIDERS = [
  { id: "arrow", label: "Arrow" },
  { id: "slash", label: "Slash" },
  { id: "dot", label: "Dot" },
] as const;

// Links point at this section, so clicking one stays on the page.
const HREF = "#breadcrumbs";

export function BreadcrumbsSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Dividers, three items">
        <div className="flex flex-col gap-space-16">
          {DIVIDERS.map((d) => (
            <Labelled key={d.id} label={d.label}>
              <Breadcrumbs divider={d.id}>
                <BreadcrumbItem href={HREF} icon={<HomeIcon />}>Home</BreadcrumbItem>
                <BreadcrumbItem href={HREF}>Settings</BreadcrumbItem>
                <BreadcrumbItem current>Members</BreadcrumbItem>
              </Breadcrumbs>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Five items">
        <Breadcrumbs divider="arrow">
          <BreadcrumbItem href={HREF} icon={<HomeIcon />} aria-label="Home" />
          <BreadcrumbItem href={HREF}>Workspace</BreadcrumbItem>
          <BreadcrumbItem href={HREF}>Data</BreadcrumbItem>
          <BreadcrumbItem href={HREF}>Tables</BreadcrumbItem>
          <BreadcrumbItem current>Orders</BreadcrumbItem>
        </Breadcrumbs>
      </Group>

      <Group label="Item: icon and word, word only, icon only">
        <div className="flex flex-wrap items-end gap-space-32">
          <Labelled label="Icon and word">
            <BreadcrumbItem href={HREF} icon={<HomeIcon />}>Home</BreadcrumbItem>
          </Labelled>
          <Labelled label="Word only">
            <BreadcrumbItem href={HREF}>Home</BreadcrumbItem>
          </Labelled>
          <Labelled label="Icon only">
            <BreadcrumbItem href={HREF} icon={<HomeIcon />} aria-label="Home" />
          </Labelled>
        </div>
      </Group>

      <Group label="Item states">
        <div className="flex flex-wrap items-end gap-space-32">
          <Labelled label="Default">
            <BreadcrumbItem href={HREF} icon={<HomeIcon />}>Home</BreadcrumbItem>
          </Labelled>
          <Labelled label="Hover">
            <BreadcrumbItem href={HREF} icon={<HomeIcon />} data-force="hover">Home</BreadcrumbItem>
          </Labelled>
          <Labelled label="Focus (proposed)">
            <BreadcrumbItem href={HREF} icon={<HomeIcon />} data-force="focus">Home</BreadcrumbItem>
          </Labelled>
          <Labelled label="Active, the current page">
            <BreadcrumbItem icon={<HomeIcon />} current>Home</BreadcrumbItem>
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
