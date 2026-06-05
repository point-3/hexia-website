import type { PageLayout, PageSection } from "@/lib/directus"

export function fallbackSection(sectionKey: string, sectionType: string, sort: number): PageSection {
  return {
    id: -sort,
    section_key: sectionKey,
    section_type: sectionType,
    status: "published",
    sort,
    is_system: true,
  }
}

export function sectionsForPage(layout: PageLayout, fallbackSections: PageSection[]): PageSection[] {
  if (layout.id !== 0) return layout.sections ?? []
  return fallbackSections
}

export function findSection(sections: PageSection[], sectionKey: string): PageSection | undefined {
  return sections.find((section) => section.section_key === sectionKey)
}

export function hasSection(sections: PageSection[], sectionKey: string): boolean {
  return Boolean(findSection(sections, sectionKey))
}

export function isCustomSection(section: PageSection): boolean {
  return section.section_type === "custom_content" || section.section_key.startsWith("custom_")
}
