import { ComponentsGallery } from "@/gallery/gallery";
import { KeepTop } from "@/site/keep-top";

/** Every component of the design system, in every size and state. */
export default function ComponentsPage() {
  return (
    <KeepTop>
      <ComponentsGallery />
    </KeepTop>
  );
}
