// Snapshot of the site-slot images, copied out of Supabase Storage on 2026-10-15
// so every page renders its photos in the server HTML (Google sees them, no
// flash or layout jump) and the live site no longer depends on Supabase or on
// the unauthenticated admin upload pages. To change a photo: replace the file in
// public/images/site/ and redeploy.
import type { SiteImageMap, SiteFramingMap } from './siteImages';

export const SITE_IMAGE_URLS: SiteImageMap = {
  "aboutPortrait": "/images/site/aboutPortrait.jpg",
  "automotivePageHero": "/images/site/automotivePageHero.jpg",
  "automotiveServiceImage": "/images/site/automotiveServiceImage.jpg",
  "commercialPageHero": "/images/site/commercialPageHero.jpg",
  "commercialServiceImage": "/images/site/commercialServiceImage.jpg",
  "ctaBackground": "/images/site/ctaBackground.jpg",
  "danaPointPageHero": "/images/site/danaPointPageHero.jpg",
  "frostPageHero": "/images/site/frostPageHero.jpg",
  "frostServiceImage": "/images/site/frostServiceImage.jpg",
  "heroBackground": "/images/site/heroBackground.jpg",
  "marinePageHero": "/images/site/marinePageHero.jpg",
  "marineServiceImage": "/images/site/marineServiceImage.jpg",
  "residentialPageHero": "/images/site/residentialPageHero.jpg",
  "residentialServiceImage": "/images/site/residentialServiceImage.jpg",
  "safetyPageHero": "/images/site/safetyPageHero.jpg",
  "safetyServiceImage": "/images/site/safetyServiceImage.jpg",
  "sanClementePageHero": "/images/site/sanClementePageHero.jpg",
  "talegaPageHero": "/images/site/talegaPageHero.jpg"
};

export const SITE_IMAGE_FRAMING: SiteFramingMap = {};
