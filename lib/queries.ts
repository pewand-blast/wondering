export const settingsQuery = `*[_type == "siteSettings"][0]`

export const contactFormQuery = `*[_type == "contactPage"][0].contactForm`

export const homeQuery = `*[_type == "homePage"][0]{
  heroVideoUrl,
  heroVideoSource,
  heroVideoFile,
  "heroVideoFileUrl": heroVideoFile.asset->url,
  heroHeadlineLines,
  heroVideoAutoplay,
  heroCta,
  aboutHeading,
  aboutBody,
  aboutCta,
  filmsHeading,
  filmsIntro,
  filmsCta,
  featuredFilms[]{film->{..., "description": filmType}},
  impactHeading,
  impactCopy,
  impactBlocks,
  impactCta,
  contactHeading,
  contactLeftParagraph,
  contactRightParagraph,
  contactCta,
  partnersHeading,
  partnerLogos[]{_key, logo},
  "autoFeaturedFilms": *[_type == "film" && featured == true] | order(order asc, _createdAt asc)[0...3]{
    ...,
    "description": filmType
  }
}`

export const cinemaQuery = `*[_type == "cinemaPage"][0]{
  ...,
  featuredFilms[]{film->{..., "description": filmType}}
}`

export const filmsQuery = `*[_type == "film"] | order(order asc, _createdAt asc){
  ...,
  "description": filmType
}`

export const filmBySlugQuery = `*[_type == "film" && slug.current == $slug][0]{
  ...,
  "videoFileUrl": videoFile.asset->url,
  "description": filmType
}`

export const missionQuery = `*[_type == "missionImpactPage"][0]{
  ...,
  caseStudies[]->
}`

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(order asc, _createdAt asc)`

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0]`

export const aboutQuery = `*[_type == "aboutPage"][0]{
  ...,
  sections[]{...},
  teamSections[]{...}
}`

export const contactQuery = `*[_type == "contactPage"][0]{
  ...,
  partners[]{...},
  testimonials[]{
    _key,
    image,
    name,
    role,
    quote
  }
}`
