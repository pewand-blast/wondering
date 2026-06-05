import type {StructureResolver} from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], title: string, schemaType: string, id: string) =>
  S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(S.document().schemaType(schemaType).documentId(id).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Wondering')
    .items([
      singleton(S, 'Site settings', 'siteSettings', 'siteSettings'),
      S.divider(),
      singleton(S, 'Home', 'homePage', 'homePage'),
      singleton(S, 'Cinema', 'cinemaPage', 'cinemaPage'),
      singleton(S, 'Mission & Impact', 'missionImpactPage', 'missionImpactPage'),
      singleton(S, 'About', 'aboutPage', 'aboutPage'),
      singleton(S, 'Contact us', 'contactPage', 'contactPage'),
      S.divider(),
      S.documentTypeListItem('film').title('Films'),
      S.documentTypeListItem('caseStudy').title('Case studies'),
    ])
