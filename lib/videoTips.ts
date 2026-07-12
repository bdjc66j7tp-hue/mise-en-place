// lib/videoTips.ts
//
// A separate, browsable index of short cooking videos from outside sources —
// currently Rouxbe Online Culinary School and The Culinary Institute of
// America (CIA). This is NOT part of the technique dictionary in
// lib/techniques.ts — it's a credited, outbound-link-only resource shown in
// its own section on the /techniques page, titled "Video Cooking Tips."
//
// We do not host, embed, or display these videos anywhere on our site.
// Each entry is a title that opens the source's own page (or, for CIA,
// the source's own YouTube video) in a new tab. All credit for this
// content belongs to its original source.
//
// SOURCES STILL TO ADD (not yet catalogued — see project status doc):
//   - Jacques Pépin Foundation (jp.foundation) — confirmed playable,
//     only 1 of ~19 categories catalogued so far (Knife Skills)
//   - Le Creuset Cooking School (lecreuset.ca/cooking-techniques) —
//     confirmed playable, structure found (Knife/Baking/Essential
//     Techniques) but sub-pages not yet pulled
//   - BBC Food (bbc.co.uk/food/how_to_cook) — confirmed playable by
//     Steve directly; blocked at the network level for Claude to fetch,
//     so this one needs Steve to paste titles/links for cataloguing
//   - Ricardo Cuisine (ricardocuisine.com) — lowest priority; listing
//     page didn't render a usable video list when fetched

export interface VideoTip {
  title: string
  url: string
  source: 'rouxbe' | 'cia'
}

export interface VideoTipSourceInfo {
  name: string
  url: string
}

export const VIDEO_TIP_SOURCES: Record<VideoTip['source'], VideoTipSourceInfo> = {
  rouxbe: {
    name: 'Rouxbe Online Culinary School',
    url: 'https://rouxbe.com/',
  },
  cia: {
    name: 'The Culinary Institute of America',
    url: 'https://www.ciachef.edu/',
  },
}

// AFFILIATE LINK SETUP — not active yet.
//
// Once an affiliate account exists, set this to the actual affiliate
// tracking ID/param the source provides, and uncomment the logic in
// `withAffiliateParams` below. Until then this stays null and every
// link on this page points straight at the source with no tracking.
// Different sources may eventually have different affiliate IDs —
// if so, change this to a Record<VideoTip['source'], string | null>
// and look up by source instead.
//
// A source's affiliate program may also offer links to paid courses or
// premium tiers, not just free videos — if/when that's added, it should
// live as its own list (e.g. ROUXBE_COURSES) rather than mixed into
// VIDEO_TIPS, since those are a different kind of link (a sales page,
// not a free how-to video) and should be visually labeled as "Premium"
// or "Paid course" so cooks aren't surprised by a paywall.
export const ROUXBE_AFFILIATE_ID: string | null = null

export function withAffiliateParams(url: string): string {
  if (!ROUXBE_AFFILIATE_ID) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}ref=${encodeURIComponent(ROUXBE_AFFILIATE_ID)}`
}

export const VIDEO_TIPS: VideoTip[] = [
  // ───────────────────────── Rouxbe ─────────────────────────
  { title: 'Cutting & Shaping Gnocchi', url: 'https://rouxbe.com/tips-techniques/800-cutting-shaping-gnocchi', source: 'rouxbe' },
  { title: 'How to Whisk, Measure & Sift Dry-Ingredients', url: 'https://rouxbe.com/tips-techniques/779-how-to-whisk-measure-sift-dry-ingredients', source: 'rouxbe' },
  { title: 'What is Béchamel?', url: 'https://rouxbe.com/tips-techniques/750-what-is-bechamel', source: 'rouxbe' },
  { title: 'Practice Using a Bench Scraper', url: 'https://rouxbe.com/tips-techniques/725-practice-using-a-bench-scraper', source: 'rouxbe' },
  { title: 'The Cacao Tree', url: 'https://rouxbe.com/tips-techniques/724-the-cacao-tree', source: 'rouxbe' },
  { title: 'The Water Test', url: 'https://rouxbe.com/tips-techniques/723-the-water-test', source: 'rouxbe' },
  { title: 'How to Make Raw Noodles | 2 Ways', url: 'https://rouxbe.com/tips-techniques/722-how-to-make-raw-noodles-2-ways', source: 'rouxbe' },
  { title: 'Soaking Flax & Chia Seeds', url: 'https://rouxbe.com/tips-techniques/721-soaking-flax-chia-seeds', source: 'rouxbe' },
  { title: 'Batch Cooking', url: 'https://rouxbe.com/tips-techniques/720-batch-cooking', source: 'rouxbe' },
  { title: 'How to Make a Balsamic Reduction', url: 'https://rouxbe.com/tips-techniques/719-how-to-make-a-balsamic-reduction', source: 'rouxbe' },
  { title: 'Sweetened Non-Dairy Milk', url: 'https://rouxbe.com/tips-techniques/717-sweetened-non-dairy-milk', source: 'rouxbe' },
  { title: 'How to Make Raw Linguine & Fettucine Noodles', url: 'https://rouxbe.com/tips-techniques/716-how-to-make-raw-linguine-fettucine-noodles', source: 'rouxbe' },
  { title: 'How to Make Raw Spaghetti Noodles', url: 'https://rouxbe.com/tips-techniques/715-how-to-make-raw-spaghetti-noodles', source: 'rouxbe' },
  { title: 'How to Make a Gluten-Free Slurry', url: 'https://rouxbe.com/tips-techniques/712-how-to-make-a-gluten-free-slurry', source: 'rouxbe' },
  { title: 'How & Why to Soak Nuts', url: 'https://rouxbe.com/tips-techniques/708-how-why-to-soak-nuts', source: 'rouxbe' },
  { title: 'How to Make Dried Vegetable Powders', url: 'https://rouxbe.com/tips-techniques/702-how-to-make-dried-vegetable-powders', source: 'rouxbe' },
  { title: 'Rolling Seitan Sausages', url: 'https://rouxbe.com/tips-techniques/700-rolling-seitan-sausages', source: 'rouxbe' },
  { title: 'How to Make a Cucumber Round', url: 'https://rouxbe.com/tips-techniques/699-how-to-make-a-cucumber-round', source: 'rouxbe' },
  { title: 'How to Dry-Sauté', url: 'https://rouxbe.com/tips-techniques/697-how-to-dry-saute', source: 'rouxbe' },
  { title: 'Slicing Potatoes', url: 'https://rouxbe.com/tips-techniques/668-slicing-potatoes', source: 'rouxbe' },
  { title: 'How to Make Gravy for Turkey', url: 'https://rouxbe.com/tips-techniques/648-how-to-make-gravy-for-turkey', source: 'rouxbe' },
  { title: 'Brining Experiment - Inside View', url: 'https://rouxbe.com/tips-techniques/634-brining-experiment-inside-view', source: 'rouxbe' },
  { title: 'Showing Motion', url: 'https://rouxbe.com/tips-techniques/630-showing-motion', source: 'rouxbe' },
  { title: 'What is a Roll Cut | Oblique Cut?', url: 'https://rouxbe.com/tips-techniques/617-what-is-a-roll-cut-oblique-cut', source: 'rouxbe' },
  { title: 'How to Prepare Tomato Concassé', url: 'https://rouxbe.com/tips-techniques/507-how-to-prepare-tomato-concasse', source: 'rouxbe' },
  { title: 'What is & How to Make a Gastride', url: 'https://rouxbe.com/tips-techniques/506-what-is-how-to-make-a-gastride', source: 'rouxbe' },
  { title: 'Cooking Risotto in Advance', url: 'https://rouxbe.com/tips-techniques/467-cooking-risotto-in-advance', source: 'rouxbe' },
  { title: 'How to Identify Parsley & Cilantro', url: 'https://rouxbe.com/tips-techniques/459-how-to-identify-parsley-cilantro', source: 'rouxbe' },
  { title: 'How to Prepare Kale', url: 'https://rouxbe.com/tips-techniques/455-how-to-prepare-kale', source: 'rouxbe' },
  { title: 'What is Lean Dough?', url: 'https://rouxbe.com/tips-techniques/444-what-is-lean-dough', source: 'rouxbe' },
  { title: 'Roasting Pans & Racks', url: 'https://rouxbe.com/tips-techniques/436-roasting-pans-racks', source: 'rouxbe' },
  { title: 'How to Baste Meat & Why', url: 'https://rouxbe.com/tips-techniques/435-how-to-baste-meat-why', source: 'rouxbe' },
  { title: 'How to Turn a Roast or Chicken', url: 'https://rouxbe.com/tips-techniques/434-how-to-turn-a-roast-or-chicken', source: 'rouxbe' },
  { title: 'Trussing Poultry', url: 'https://rouxbe.com/tips-techniques/428-trussing-poultry', source: 'rouxbe' },
  { title: 'How to Carve Turkey', url: 'https://rouxbe.com/tips-techniques/427-how-to-carve-turkey', source: 'rouxbe' },
  { title: 'How to Make Gravy for Turkey', url: 'https://rouxbe.com/tips-techniques/426-how-to-make-gravy-for-turkey', source: 'rouxbe' },
  { title: 'Garnish for Soup', url: 'https://rouxbe.com/tips-techniques/408-garnish-for-soup', source: 'rouxbe' },
  { title: 'What Happens When Heating a Pan?', url: 'https://rouxbe.com/tips-techniques/394-what-happens-when-heating-a-pan', source: 'rouxbe' },
  { title: 'How to Segment Citrus Fruit', url: 'https://rouxbe.com/tips-techniques/372-how-to-segment-citrus-fruit', source: 'rouxbe' },
  { title: 'How to Prepare Dried Morel Mushrooms', url: 'https://rouxbe.com/tips-techniques/371-how-to-prepare-dried-morel-mushrooms', source: 'rouxbe' },
  { title: 'How to Butterfly a Chicken', url: 'https://rouxbe.com/tips-techniques/370-how-to-butterfly-a-chicken', source: 'rouxbe' },
  { title: 'How to Make Compound Butter', url: 'https://rouxbe.com/tips-techniques/369-how-to-make-compound-butter', source: 'rouxbe' },
  { title: 'How to Properly Heat a Pan', url: 'https://rouxbe.com/tips-techniques/363-how-to-properly-heat-a-pan', source: 'rouxbe' },
  { title: 'How to De-Stem Spinach', url: 'https://rouxbe.com/tips-techniques/362-how-to-de-stem-spinach', source: 'rouxbe' },
  { title: 'Tips for Eating Mussels', url: 'https://rouxbe.com/tips-techniques/357-tips-for-eating-mussels', source: 'rouxbe' },
  { title: 'How to Buy, Store and Clean Mussels', url: 'https://rouxbe.com/tips-techniques/356-how-to-buy-store-and-clean-mussels', source: 'rouxbe' },
  { title: 'How to Debone and Trim Snapper Fillets', url: 'https://rouxbe.com/tips-techniques/354-how-to-debone-and-trim-snapper-fillets', source: 'rouxbe' },
  { title: 'How to Peel a Tomato, Peach or Plum', url: 'https://rouxbe.com/tips-techniques/353-how-to-peel-a-tomato-peach-or-plum', source: 'rouxbe' },
  { title: 'How to Pit and Dice an Avocado', url: 'https://rouxbe.com/tips-techniques/348-how-to-pit-and-dice-an-avocado', source: 'rouxbe' },
  { title: 'How to Skin a Hazelnut', url: 'https://rouxbe.com/tips-techniques/346-how-to-skin-a-hazelnut', source: 'rouxbe' },
  { title: 'How to Roast / Toast Nuts', url: 'https://rouxbe.com/tips-techniques/342-how-to-roast-toast-nuts', source: 'rouxbe' },
  { title: 'How to Remove Chicken Tendons', url: 'https://rouxbe.com/tips-techniques/341-how-to-remove-chicken-tendons', source: 'rouxbe' },
  { title: 'How to Choose Quality Canned Tomatoes', url: 'https://rouxbe.com/tips-techniques/340-how-to-choose-quality-canned-tomatoes', source: 'rouxbe' },
  { title: 'What are Lardons?', url: 'https://rouxbe.com/tips-techniques/339-what-are-lardons', source: 'rouxbe' },
  { title: 'How to Skin Almonds', url: 'https://rouxbe.com/tips-techniques/338-how-to-skin-almonds', source: 'rouxbe' },
  { title: 'What is Deglazing?', url: 'https://rouxbe.com/tips-techniques/337-what-is-deglazing', source: 'rouxbe' },
  { title: 'What is Simmering?', url: 'https://rouxbe.com/tips-techniques/336-what-is-simmering', source: 'rouxbe' },
  { title: 'How to Mince & Crush Garlic', url: 'https://rouxbe.com/tips-techniques/306-how-to-mince-crush-garlic', source: 'rouxbe' },
  { title: 'What is Mirepoix?', url: 'https://rouxbe.com/tips-techniques/305-what-is-mirepoix', source: 'rouxbe' },
  { title: 'What is Bouquet Garni?', url: 'https://rouxbe.com/tips-techniques/304-what-is-bouquet-garni', source: 'rouxbe' },
  { title: 'Kitchen Tools | Scales', url: 'https://rouxbe.com/tips-techniques/303-kitchen-tools-scales', source: 'rouxbe' },
  { title: 'Kitchen Tools | Timers', url: 'https://rouxbe.com/tips-techniques/302-kitchen-tools-timers', source: 'rouxbe' },
  { title: 'Kitchen Tools | Scissors', url: 'https://rouxbe.com/tips-techniques/301-kitchen-tools-scissors', source: 'rouxbe' },
  { title: 'Kitchen Tools | Mashers and Ricers', url: 'https://rouxbe.com/tips-techniques/300-kitchen-tools-mashers-and-ricers', source: 'rouxbe' },
  { title: 'Kitchen Tools | Strainers and Spiders', url: 'https://rouxbe.com/tips-techniques/299-kitchen-tools-strainers-and-spiders', source: 'rouxbe' },
  { title: 'Kitchen Tools | Thermometers', url: 'https://rouxbe.com/tips-techniques/298-kitchen-tools-thermometers', source: 'rouxbe' },
  { title: 'Kitchen Tools | Ladles', url: 'https://rouxbe.com/tips-techniques/297-kitchen-tools-ladles', source: 'rouxbe' },
  { title: 'Kitchen Tools | Cutting Boards', url: 'https://rouxbe.com/tips-techniques/296-kitchen-tools-cutting-boards', source: 'rouxbe' },
  { title: 'Kitchen Tools | Wooden Spoons', url: 'https://rouxbe.com/tips-techniques/295-kitchen-tools-wooden-spoons', source: 'rouxbe' },
  { title: 'Kitchen Tools | Spatulas', url: 'https://rouxbe.com/tips-techniques/294-kitchen-tools-spatulas', source: 'rouxbe' },
  { title: 'Kitchen Tools | Whisks', url: 'https://rouxbe.com/tips-techniques/293-kitchen-tools-whisks', source: 'rouxbe' },
  { title: 'Kitchen Tools | Measuring Cups and Spoons', url: 'https://rouxbe.com/tips-techniques/292-kitchen-tools-measuring-cups-and-spoons', source: 'rouxbe' },
  { title: 'Kitchen Tools | Bench Scrapers', url: 'https://rouxbe.com/tips-techniques/291-kitchen-tools-bench-scrapers', source: 'rouxbe' },
  { title: 'Kitchen Tools | Peelers', url: 'https://rouxbe.com/tips-techniques/290-kitchen-tools-peelers', source: 'rouxbe' },
  { title: 'How to Make Balsamic Reduction', url: 'https://rouxbe.com/tips-techniques/288-how-to-make-balsamic-reduction', source: 'rouxbe' },
  { title: 'How to Buy and Clean Fava Beans', url: 'https://rouxbe.com/tips-techniques/287-how-to-buy-and-clean-fava-beans', source: 'rouxbe' },
  { title: 'How to Pit Olives', url: 'https://rouxbe.com/tips-techniques/285-how-to-pit-olives', source: 'rouxbe' },
  { title: 'How to Buy and Cut Cauliflower', url: 'https://rouxbe.com/tips-techniques/283-how-to-buy-and-cut-cauliflower', source: 'rouxbe' },
  { title: 'How to Test Salmon for Doneness', url: 'https://rouxbe.com/tips-techniques/280-how-to-test-salmon-for-doneness', source: 'rouxbe' },
  { title: 'How to Secure a Bowl in Place', url: 'https://rouxbe.com/tips-techniques/279-how-to-secure-a-bowl-in-place', source: 'rouxbe' },
  { title: 'How to Butcher a Chicken | 8 or 10 Cut Chicken', url: 'https://rouxbe.com/tips-techniques/278-how-to-butcher-a-chicken-8-or-10-cut-chicken', source: 'rouxbe' },
  { title: 'What is Turmeric?', url: 'https://rouxbe.com/tips-techniques/277-what-is-turmeric', source: 'rouxbe' },
  { title: 'What is an Ice Bath?', url: 'https://rouxbe.com/tips-techniques/276-what-is-an-ice-bath', source: 'rouxbe' },
  { title: 'Kitchen Tools | Spatulas and Tongs', url: 'https://rouxbe.com/tips-techniques/259-kitchen-tools-spatulas-and-tongs', source: 'rouxbe' },
  { title: 'Kitchen Tools | Zesters and Graters', url: 'https://rouxbe.com/tips-techniques/257-kitchen-tools-zesters-and-graters', source: 'rouxbe' },
  { title: 'How to Cut Citrus Wedges', url: 'https://rouxbe.com/tips-techniques/222-how-to-cut-citrus-wedges', source: 'rouxbe' },
  { title: 'How to Buy Tomatillos', url: 'https://rouxbe.com/tips-techniques/220-how-to-buy-tomatillos', source: 'rouxbe' },
  { title: 'How to Separate Fat From a Liquid', url: 'https://rouxbe.com/tips-techniques/211-how-to-separate-fat-from-a-liquid', source: 'rouxbe' },
  { title: 'How to Make Pesto in a Food Processor', url: 'https://rouxbe.com/tips-techniques/208-how-to-make-pesto-in-a-food-processor', source: 'rouxbe' },
  { title: 'How to Clean a Pot', url: 'https://rouxbe.com/tips-techniques/202-how-to-clean-a-pot', source: 'rouxbe' },
  { title: 'Panang Curry Paste Options', url: 'https://rouxbe.com/tips-techniques/197-panang-curry-paste-options', source: 'rouxbe' },
  { title: 'Pizza Dough & How to Shape It', url: 'https://rouxbe.com/tips-techniques/196-pizza-dough-how-to-shape-it', source: 'rouxbe' },
  { title: 'What is Tamarind?', url: 'https://rouxbe.com/tips-techniques/194-what-is-tamarind', source: 'rouxbe' },
  { title: 'What is Cassis?', url: 'https://rouxbe.com/tips-techniques/193-what-is-cassis', source: 'rouxbe' },
  { title: 'How to Clean Pork Tenderloin', url: 'https://rouxbe.com/tips-techniques/192-how-to-clean-pork-tenderloin', source: 'rouxbe' },
  { title: 'What is a Mezzaluna?', url: 'https://rouxbe.com/tips-techniques/189-what-is-a-mezzaluna', source: 'rouxbe' },
  { title: 'What is Émincé?', url: 'https://rouxbe.com/tips-techniques/186-what-is-emince', source: 'rouxbe' },
  { title: 'How to Buy & Prepare Garlic', url: 'https://rouxbe.com/tips-techniques/185-how-to-buy-prepare-garlic', source: 'rouxbe' },
  { title: 'Pumpkin Puree', url: 'https://rouxbe.com/tips-techniques/178-pumpkin-puree', source: 'rouxbe' },
  { title: 'Honing Your Knife', url: 'https://rouxbe.com/tips-techniques/177-honing-your-knife', source: 'rouxbe' },
  { title: 'How to Buy Coconut Milk', url: 'https://rouxbe.com/tips-techniques/176-how-to-buy-coconut-milk', source: 'rouxbe' },
  { title: 'What is Chorizo?', url: 'https://rouxbe.com/tips-techniques/175-what-is-chorizo', source: 'rouxbe' },
  { title: 'How to Clean Squid', url: 'https://rouxbe.com/tips-techniques/174-how-to-clean-squid', source: 'rouxbe' },
  { title: 'What is a Corn Creamer?', url: 'https://rouxbe.com/tips-techniques/172-what-is-a-corn-creamer', source: 'rouxbe' },
  { title: 'What is Tobiko?', url: 'https://rouxbe.com/tips-techniques/170-what-is-tobiko', source: 'rouxbe' },
  { title: 'Crème Fraîche Shortcut', url: 'https://rouxbe.com/tips-techniques/169-creme-fraiche-shortcut', source: 'rouxbe' },
  { title: 'What is Star Anise?', url: 'https://rouxbe.com/tips-techniques/168-what-is-star-anise', source: 'rouxbe' },
  { title: 'What is Kabocha Squash?', url: 'https://rouxbe.com/tips-techniques/167-what-is-kabocha-squash', source: 'rouxbe' },
  { title: 'How to Butcher a Duck', url: 'https://rouxbe.com/tips-techniques/166-how-to-butcher-a-duck', source: 'rouxbe' },
  { title: 'What is Brunoise?', url: 'https://rouxbe.com/tips-techniques/163-what-is-brunoise', source: 'rouxbe' },
  { title: 'What is Mise en Place?', url: 'https://rouxbe.com/tips-techniques/162-what-is-mise-en-place', source: 'rouxbe' },
  { title: 'What is Julienne?', url: 'https://rouxbe.com/tips-techniques/161-what-is-julienne', source: 'rouxbe' },
  { title: 'What is Mirin?', url: 'https://rouxbe.com/tips-techniques/160-what-is-mirin', source: 'rouxbe' },
  { title: 'What is Sambal?', url: 'https://rouxbe.com/tips-techniques/159-what-is-sambal', source: 'rouxbe' },
  { title: 'What are Serrano Peppers?', url: 'https://rouxbe.com/tips-techniques/158-what-are-serrano-peppers', source: 'rouxbe' },
  { title: 'What is Young Ginger?', url: 'https://rouxbe.com/tips-techniques/157-what-is-young-ginger', source: 'rouxbe' },
  { title: 'How to Debone and Tie a Lamb Loin', url: 'https://rouxbe.com/tips-techniques/156-how-to-debone-and-tie-a-lamb-loin', source: 'rouxbe' },
  { title: 'What is a Lamb Loin?', url: 'https://rouxbe.com/tips-techniques/155-what-is-a-lamb-loin', source: 'rouxbe' },
  { title: 'What is White Pepper?', url: 'https://rouxbe.com/tips-techniques/153-what-is-white-pepper', source: 'rouxbe' },
  { title: 'Freezing and Storing Demi-Glace', url: 'https://rouxbe.com/tips-techniques/152-freezing-and-storing-demi-glace', source: 'rouxbe' },
  { title: 'What is a Mandoline?', url: 'https://rouxbe.com/tips-techniques/151-what-is-a-mandoline', source: 'rouxbe' },
  { title: 'What is Fleur de Sel?', url: 'https://rouxbe.com/tips-techniques/150-what-is-fleur-de-sel', source: 'rouxbe' },
  { title: 'Which Sherry to Use?', url: 'https://rouxbe.com/tips-techniques/149-which-sherry-to-use', source: 'rouxbe' },
  { title: 'What are Kaiware Sprouts?', url: 'https://rouxbe.com/tips-techniques/148-what-are-kaiware-sprouts', source: 'rouxbe' },
  { title: 'How to Make Clarified Butter', url: 'https://rouxbe.com/tips-techniques/146-how-to-make-clarified-butter', source: 'rouxbe' },
  { title: 'What are Meyer Lemons?', url: 'https://rouxbe.com/tips-techniques/143-what-are-meyer-lemons', source: 'rouxbe' },
  { title: 'How to Store Oven Roasted Tomatoes', url: 'https://rouxbe.com/tips-techniques/139-how-to-store-oven-roasted-tomatoes', source: 'rouxbe' },
  { title: 'What are Herbes de Provence?', url: 'https://rouxbe.com/tips-techniques/138-what-are-herbes-de-provence', source: 'rouxbe' },
  { title: 'What is Pancetta?', url: 'https://rouxbe.com/tips-techniques/137-what-is-pancetta', source: 'rouxbe' },
  { title: 'What is Boursin Cheese?', url: 'https://rouxbe.com/tips-techniques/136-what-is-boursin-cheese', source: 'rouxbe' },
  { title: 'What is Brioche?', url: 'https://rouxbe.com/tips-techniques/135-what-is-brioche', source: 'rouxbe' },
  { title: 'Chilis - Turning up the Heat', url: 'https://rouxbe.com/tips-techniques/127-chilis-turning-up-the-heat', source: 'rouxbe' },
  { title: 'What is Kaffir Lime?', url: 'https://rouxbe.com/tips-techniques/126-what-is-kaffir-lime', source: 'rouxbe' },
  { title: 'What is Palm Sugar?', url: 'https://rouxbe.com/tips-techniques/125-what-is-palm-sugar', source: 'rouxbe' },
  { title: 'Which Thai Chili to Use?', url: 'https://rouxbe.com/tips-techniques/124-which-thai-chili-to-use', source: 'rouxbe' },
  { title: 'What is Galangal?', url: 'https://rouxbe.com/tips-techniques/123-what-is-galangal', source: 'rouxbe' },
  { title: 'What is and How to Prepare Lemongrass?', url: 'https://rouxbe.com/tips-techniques/122-what-is-and-how-to-prepare-lemongrass', source: 'rouxbe' },
  { title: 'How to Buy Fresh Shrimp or Prawns', url: 'https://rouxbe.com/tips-techniques/120-how-to-buy-fresh-shrimp-or-prawns', source: 'rouxbe' },
  { title: 'How to Clean Shrimp or Prawns', url: 'https://rouxbe.com/tips-techniques/119-how-to-clean-shrimp-or-prawns', source: 'rouxbe' },
  { title: 'How to Choose and Prepare a Mango', url: 'https://rouxbe.com/tips-techniques/118-how-to-choose-and-prepare-a-mango', source: 'rouxbe' },
  { title: 'What is Thai Basil?', url: 'https://rouxbe.com/tips-techniques/117-what-is-thai-basil', source: 'rouxbe' },
  { title: 'What are Bamboo Shoots?', url: 'https://rouxbe.com/tips-techniques/115-what-are-bamboo-shoots', source: 'rouxbe' },
  { title: 'Removing Pin Bones from Fish', url: 'https://rouxbe.com/tips-techniques/112-removing-pin-bones-from-fish', source: 'rouxbe' },
  { title: 'What is Bragg or Tamari?', url: 'https://rouxbe.com/tips-techniques/111-what-is-bragg-or-tamari', source: 'rouxbe' },
  { title: 'What is Miso?', url: 'https://rouxbe.com/tips-techniques/110-what-is-miso', source: 'rouxbe' },
  { title: 'What are Sichuan (or Szechuan) Peppercorns?', url: 'https://rouxbe.com/tips-techniques/108-what-are-sichuan-or-szechuan-peppercorns', source: 'rouxbe' },
  { title: 'What is Bok Choy?', url: 'https://rouxbe.com/tips-techniques/107-what-is-bok-choy', source: 'rouxbe' },
  { title: 'What are Crispy Fried Onions?', url: 'https://rouxbe.com/tips-techniques/105-what-are-crispy-fried-onions', source: 'rouxbe' },
  { title: 'What is Ghee?', url: 'https://rouxbe.com/tips-techniques/101-what-is-ghee', source: 'rouxbe' },
  { title: 'How to Debone a Chicken Breast', url: 'https://rouxbe.com/tips-techniques/99-how-to-debone-a-chicken-breast', source: 'rouxbe' },
  { title: 'What are Pappadams? | Indian Flatbread', url: 'https://rouxbe.com/tips-techniques/98-what-are-pappadams-indian-flatbread', source: 'rouxbe' },
  { title: 'How to Prepare Vegetables in Advance', url: 'https://rouxbe.com/tips-techniques/96-how-to-prepare-vegetables-in-advance', source: 'rouxbe' },
  { title: 'What are Panko Breadcrumbs?', url: 'https://rouxbe.com/tips-techniques/95-what-are-panko-breadcrumbs', source: 'rouxbe' },
  { title: 'How to Chiffonade', url: 'https://rouxbe.com/tips-techniques/93-how-to-chiffonade', source: 'rouxbe' },
  { title: 'What is a Mortar and Pestle?', url: 'https://rouxbe.com/tips-techniques/87-what-is-a-mortar-and-pestle', source: 'rouxbe' },
  { title: 'What is a Fat Separator?', url: 'https://rouxbe.com/tips-techniques/85-what-is-a-fat-separator', source: 'rouxbe' },
  { title: 'How to Carve Poultry', url: 'https://rouxbe.com/tips-techniques/84-how-to-carve-poultry', source: 'rouxbe' },
  { title: 'How to Know When Your Poultry is Cooked', url: 'https://rouxbe.com/tips-techniques/83-how-to-know-when-your-poultry-is-cooked', source: 'rouxbe' },
  { title: 'What is Tilapia?', url: 'https://rouxbe.com/tips-techniques/79-what-is-tilapia', source: 'rouxbe' },
  { title: 'How to Add Flavor to Plain Rice', url: 'https://rouxbe.com/tips-techniques/78-how-to-add-flavor-to-plain-rice', source: 'rouxbe' },
  { title: 'What are Pandan Leaves?', url: 'https://rouxbe.com/tips-techniques/77-what-are-pandan-leaves', source: 'rouxbe' },
  { title: 'Why Buy a Rice Cooker?', url: 'https://rouxbe.com/tips-techniques/74-why-buy-a-rice-cooker', source: 'rouxbe' },
  { title: 'Reheating Caramel Sauce', url: 'https://rouxbe.com/tips-techniques/73-reheating-caramel-sauce', source: 'rouxbe' },
  { title: 'Tips on Buying Lamb Stew Meat', url: 'https://rouxbe.com/tips-techniques/69-tips-on-buying-lamb-stew-meat', source: 'rouxbe' },
  { title: 'Grinding Your Own Spices', url: 'https://rouxbe.com/tips-techniques/66-grinding-your-own-spices', source: 'rouxbe' },
  { title: 'How to Cut a Squash Safely', url: 'https://rouxbe.com/tips-techniques/64-how-to-cut-a-squash-safely', source: 'rouxbe' },
  { title: 'What is Butternut Squash?', url: 'https://rouxbe.com/tips-techniques/63-what-is-butternut-squash', source: 'rouxbe' },
  { title: 'What is Couscous?', url: 'https://rouxbe.com/tips-techniques/62-what-is-couscous', source: 'rouxbe' },
  { title: 'Why Meat Needs to Rest After Cooking', url: 'https://rouxbe.com/tips-techniques/60-why-meat-needs-to-rest-after-cooking', source: 'rouxbe' },
  { title: 'Chicken Stock Alternatives', url: 'https://rouxbe.com/tips-techniques/57-chicken-stock-alternatives', source: 'rouxbe' },
  { title: 'How to Flambé w/ Electric Heat', url: 'https://rouxbe.com/tips-techniques/50-how-to-flambe-w-electric-heat', source: 'rouxbe' },
  { title: 'Tips on Buying Beef Tenderloin Steaks', url: 'https://rouxbe.com/tips-techniques/49-tips-on-buying-beef-tenderloin-steaks', source: 'rouxbe' },
  { title: 'How to Clean and Portion a Whole Beef Tenderloin', url: 'https://rouxbe.com/tips-techniques/48-how-to-clean-and-portion-a-whole-beef-tenderloin', source: 'rouxbe' },
  { title: 'What is Rapini?', url: 'https://rouxbe.com/tips-techniques/47-what-is-rapini', source: 'rouxbe' },
  { title: 'What is Blind Baking?', url: 'https://rouxbe.com/tips-techniques/43-what-is-blind-baking', source: 'rouxbe' },
  { title: 'Making Polenta Ahead', url: 'https://rouxbe.com/tips-techniques/42-making-polenta-ahead', source: 'rouxbe' },
  { title: 'How to Separate Eggs', url: 'https://rouxbe.com/tips-techniques/40-how-to-separate-eggs', source: 'rouxbe' },
  { title: 'What are Chipotle Peppers?', url: 'https://rouxbe.com/tips-techniques/37-what-are-chipotle-peppers', source: 'rouxbe' },
  { title: 'Different Cuts of Beef Ribs', url: 'https://rouxbe.com/tips-techniques/35-different-cuts-of-beef-ribs', source: 'rouxbe' },
  { title: 'Reducing Stock', url: 'https://rouxbe.com/tips-techniques/32-reducing-stock', source: 'rouxbe' },
  { title: 'Tips on How to Freeze & Portion Stock', url: 'https://rouxbe.com/tips-techniques/31-tips-on-how-to-freeze-portion-stock', source: 'rouxbe' },
  { title: 'How to Slice Onions', url: 'https://rouxbe.com/tips-techniques/30-how-to-slice-onions', source: 'rouxbe' },
  { title: 'Mincing, Dicing & Cutting Onions', url: 'https://rouxbe.com/tips-techniques/25-mincing-dicing-cutting-onions', source: 'rouxbe' },
  { title: 'How to French Cut Long Beans', url: 'https://rouxbe.com/tips-techniques/22-how-to-french-cut-long-beans', source: 'rouxbe' },
  { title: 'Making Poached Eggs Ahead', url: 'https://rouxbe.com/tips-techniques/21-making-poached-eggs-ahead', source: 'rouxbe' },
  { title: 'Learn About Gourmet Salt', url: 'https://rouxbe.com/tips-techniques/15-learn-about-gourmet-salt', source: 'rouxbe' },
  { title: 'How to Poach an Egg', url: 'https://rouxbe.com/tips-techniques/11-how-to-poach-an-egg', source: 'rouxbe' },
  { title: 'How to Butcher a Whole Chicken', url: 'https://rouxbe.com/tips-techniques/2-how-to-butcher-a-whole-chicken', source: 'rouxbe' },
  { title: 'Parchment Paper Baking Tip', url: 'https://rouxbe.com/tips-techniques/1-parchment-paper-baking-tip', source: 'rouxbe' },

  // ───────────────────────── CIA ─────────────────────────
  { title: 'Quick Bread: Irish Soda Bread', url: 'https://www.youtube.com/watch?v=Bw2b26cMjiY', source: 'cia' },
  { title: 'Cooking Methods: Dry Heat, Part I', url: 'https://www.youtube.com/watch?v=1t-L-4FjqAw', source: 'cia' },
  { title: 'Cooking Methods: Dry Heat, Part II', url: 'https://www.youtube.com/watch?v=h6iOnjvkT7Y', source: 'cia' },
  { title: 'Cooking Methods: Moist Heat', url: 'https://www.youtube.com/watch?v=weB6bYIxkg0', source: 'cia' },
  { title: 'Cooking Methods: Combination Heat', url: 'https://www.youtube.com/watch?v=-a6koUGiwJ8', source: 'cia' },
  { title: 'Baking Fundamentals: Recipe Conversions', url: 'https://www.youtube.com/watch?v=yk4yzdYAsCQ', source: 'cia' },
  { title: 'Physiology of Taste: Salt', url: 'https://www.youtube.com/watch?v=cf8srs6TjwA', source: 'cia' },
  { title: 'Physiology of Taste: Sweet', url: 'https://www.youtube.com/watch?v=Z4wAvz8vc7U', source: 'cia' },
  { title: 'Physiology of Taste: Bitter', url: 'https://www.youtube.com/watch?v=64JTq1FWPrA', source: 'cia' },
  { title: 'Physiology of Taste: Sour', url: 'https://www.youtube.com/watch?v=fADmPD-Ni_k', source: 'cia' },
  { title: 'Physiology of Taste: Umami', url: 'https://www.youtube.com/watch?v=QsSpt6KTUrY', source: 'cia' },
  { title: 'French Onion Soup', url: 'https://www.youtube.com/watch?v=ouBTH8csaHg', source: 'cia' },
  { title: 'Deconstructed Elotes, Mexican-Style Street Corn', url: 'https://www.youtube.com/watch?v=SOpzQWczlaM', source: 'cia' },
  { title: 'How to Chop Garlic', url: 'https://www.youtube.com/watch?v=JOpBscP0wxE', source: 'cia' },
  { title: 'How to Make Homemade Chicken Broth', url: 'https://www.youtube.com/watch?v=X6jOzA2MTfI', source: 'cia' },
  { title: 'How to Make a Roux', url: 'https://www.youtube.com/watch?v=w3iM5i2HTlc', source: 'cia' },
  { title: 'How to Prepare and Cut Herbs', url: 'https://www.youtube.com/watch?v=gAjowPsRyQk', source: 'cia' },
]
