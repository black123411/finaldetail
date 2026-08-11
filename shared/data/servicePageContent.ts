export type ServicePageSection = {
  title: string;
  body: string;
};

export type ServicePageFaq = {
  question: string;
  answer: string;
};

export type ServicePageContent = {
  headline: string;
  intro: string;
  sections: ServicePageSection[];
  processTitle: string;
  process: string[];
  buyerNotes: string[];
  faq: ServicePageFaq[];
  internalServiceIds: string[];
};

export const SERVICE_PAGE_CONTENT: Record<string, ServicePageContent> = {
  "maintenance-interior": {
    headline: "Maintenance Interior for vehicles that need upkeep, not restoration",
    intro: "Maintenance Interior is the lower-cost interior option for Bellevue and Omaha drivers whose vehicle is already in reasonably maintained condition. It provides a proper vacuum, air blowout, surface cleaning, mats, glass, and light spot cleaning without charging for full shampooing or extraction the vehicle does not need.",
    sections: [
      {
        title: "What this service solves",
        body: "It handles normal dust, crumbs, fingerprints, light floor-mat soil, and everyday interior buildup before they turn into a larger reset."
      },
      {
        title: "What it does not cover",
        body: "Heavy stains, embedded pet hair, major spills, strong odors, biohazards, and neglected interiors require Signature Interior Detail, Interior Restoration, or photos before Bryan can quote the work."
      },
      {
        title: "Best time to book",
        body: "Choose it when the cabin is generally cared for but needs a more complete professional upkeep visit than a quick vacuum and wipe."
      }
    ],
    processTitle: "Maintenance interior process",
    process: [
      "Inspect the interior condition and confirm it qualifies for maintenance-level cleaning.",
      "Air purge and vacuum the seats, carpet, trunk, cracks, mats, and accessible storage areas.",
      "Clean the dash, console, doors, plastics, mats, and interior glass.",
      "Treat light spots and complete a final interior quality check."
    ],
    buyerNotes: [
      "This service is for regularly maintained vehicles.",
      "Heavy stains, major pet hair, spills, odors, or neglected interiors need a higher-level service.",
      "Text photos if you are unsure which interior package fits."
    ],
    faq: [
      {
        question: "How is Maintenance Interior different from Signature Interior Detail?",
        answer: "Maintenance Interior is for lighter, routine buildup. Signature Interior Detail allows more time for normal dirt, light staining, and a more involved cabin cleanup."
      },
      {
        question: "Does the $139 service include full shampooing or extraction?",
        answer: "No. Full fabric shampooing, hot-water extraction, severe stain work, and major pet-hair removal require a higher-level interior service."
      },
      {
        question: "Can I send photos before booking?",
        answer: "Yes. Texting clear interior photos helps Bryan confirm whether the vehicle fits Maintenance Interior pricing before the appointment."
      }
    ],
    internalServiceIds: ["interior-detail", "interior-reset", "odor-elimination", "full-detail-package"]
  },
  "interior-detail": {
    headline: "Signature Interior Detail for maintained daily drivers",
    intro: "The Signature Interior Detail is for Bellevue and Omaha drivers with normal dirt, crumbs, dust, fingerprints, light staining, and everyday interior buildup. It focuses on the touch points, cracks, plastics, mats, glass, and surfaces that need a professional cleanup without full extraction.",
    sections: [
      {
        title: "What this service solves",
        body: "It removes normal daily-driver mess: dust in vents, crumbs in seat seams, film on glass, sticky cupholders, dirty mats, and light fabric staining. It is built for the vehicle you still care about and want to keep comfortable."
      },
      {
        title: "What makes it different",
        body: "Bryan works through the cabin one area at a time instead of doing only a quick vacuum and wipe. Air purging, detail brushes, cleaners chosen for each material, mat cleaning, and interior dressing are used as needed."
      },
      {
        title: "Best time to book",
        body: "Book this before road trips, after winter, before family visits, or any time the inside has started to feel dusty, sticky, or stale but does not need heavy extraction."
      }
    ],
    processTitle: "Signature interior process",
    process: [
      "Inspect the cabin, stains, materials, mats, and high-touch areas before cleaning begins.",
      "Air purge and vacuum seats, carpet, trunk, cracks, crevices, cupholders, pockets, and seat tracks.",
      "Clean plastics, vinyl, panels, console areas, door jambs, mats, glass, and visible trim.",
      "Treat light stains, apply interior protection where needed, and do a final detail check."
    ],
    buyerNotes: [
      "Choose Interior Restoration instead if you have heavy pet hair, major spills, or severe stains.",
      "Remove personal items before the appointment so Bryan can clean storage pockets and compartments.",
      "Light stains are treated, but dyed or permanently damaged fabric may not fully return to new."
    ],
    faq: [
      {
        question: "Is Signature Interior Detail enough for a family vehicle?",
        answer: "Yes if the vehicle has normal daily buildup, crumbs, dust, dirty mats, and light stains. If the vehicle has heavy food spills, pet hair, smoke odor, or deep fabric staining, Interior Restoration is the better choice."
      },
      {
        question: "Does this include shampooing every seat and carpet?",
        answer: "This service includes spot treatment for high-traffic staining. Full hot-water extraction and intensive shampooing are part of Interior Restoration or can be quoted separately when needed."
      },
      {
        question: "Can you clean leather safely?",
        answer: "Yes. Bryan uses material-appropriate cleaners and avoids harsh scrubbing that can damage leather, vinyl, plastics, or delicate trim."
      },
      {
        question: "Will the interior smell better after this detail?",
        answer: "Most vehicles smell fresher because dirt, dust, spills, and grime are removed. Strong smoke, mildew, pet, or food odors may need Odor Elimination Treatment."
      },
      {
        question: "Can this be done mobile?",
        answer: "Many interior details can be done mobile around Bellevue, Omaha, Papillion, La Vista, and nearby areas when weather, power, space, and vehicle condition allow it."
      }
    ],
    internalServiceIds: ["maintenance-interior", "interior-reset", "odor-elimination", "full-detail-package"]
  },
  "interior-reset": {
    headline: "Interior Restoration for stains, pet hair, spills, and neglected cabins",
    intro: "Interior Restoration is for interiors that need more than a tidy-up. It is built for family vehicles, used-car purchases, pet vehicles, work vehicles, and cabins with embedded dirt, heavy staining, odor sources, or years of buildup.",
    sections: [
      {
        title: "What this service solves",
        body: "It targets the mess that sits below the surface: pet hair woven into carpet, sticky spills, deep fabric stains, dirty seat tracks, grime around buttons, and odors trapped in upholstery."
      },
      {
        title: "Extraction and steam matter",
        body: "Hot water extraction, steam, brushing, vacuuming, and safe chemical treatment help lift contamination instead of just wiping over it. This is the service for getting the cabin back under control."
      },
      {
        title: "Best time to book",
        body: "Book it after buying a used car, before selling a vehicle, after a spill, after pet use, or when the interior has reached the point where regular cleaning no longer works."
      }
    ],
    processTitle: "Deep restoration process",
    process: [
      "Inspect problem areas including pet hair, stains, odor, fabric, carpet, headliner, and seat tracks.",
      "Dry remove loose debris and embedded pet hair before wet cleaning starts.",
      "Steam, shampoo, extract, scrub, and sanitize interior surfaces according to material type.",
      "Finish glass, plastics, mats, panels, jambs, and odor-prone areas with a final quality check."
    ],
    buyerNotes: [
      "Severe biohazard, mold, or water damage may need a custom quote before work starts.",
      "Some stains permanently dye fibers and can improve without disappearing completely.",
      "Send photos when possible so Bryan can estimate the time and recommend the right service."
    ],
    faq: [
      {
        question: "Can you remove all pet hair?",
        answer: "Bryan removes heavy pet hair with specialized tools and repeated vacuum passes. Some deeply woven hair in worn carpet may remain slightly visible, but the improvement is usually dramatic."
      },
      {
        question: "Does this remove smoke smell?",
        answer: "It removes a lot of odor-causing soil, but heavy smoke usually needs Odor Elimination Treatment because smoke particles can live in fabric, foam, headliners, and vents."
      },
      {
        question: "How dry will the seats and carpets be afterward?",
        answer: "Dry time depends on fabric, temperature, humidity, and how much extraction is required. Bryan avoids over-soaking and can advise how long to leave windows cracked or airflow moving."
      },
      {
        question: "Is this safe for older interiors?",
        answer: "Yes, but older fabric, weak headliners, peeling coatings, and brittle trim are handled carefully. Bryan will point out risky areas before stronger cleaning begins."
      },
      {
        question: "Should I book this before selling my car?",
        answer: "Yes. A clean cabin changes buyer perception immediately. If you also need exterior gloss for listing photos, compare the Pre-Sale Detail Package."
      }
    ],
    internalServiceIds: ["odor-elimination", "pre-sale-detail", "showroom-package", "interior-detail", "maintenance-interior"]
  },
  "exterior-enhancement": {
    headline: "Premium Wash and Wax for smooth paint, gloss, and seasonal protection",
    intro: "Premium Wash and Wax is for vehicles that need more than a drive-through wash. It removes road film, bug residue, bonded contamination, brake dust, and rough paint feel, then adds hydrophobic protection for Nebraska weather.",
    sections: [
      {
        title: "What this service solves",
        body: "It addresses rough paint, dull shine, dirty wheels, trim fade, bug residue, and contamination that normal soap does not remove. The goal is clean, smooth, protected paint."
      },
      {
        title: "Why decontamination matters",
        body: "Iron fallout and bonded grit can make paint feel sandpapery and reduce gloss. Chemical decontamination and clay treatment help clean the surface before sealant is applied."
      },
      {
        title: "Best time to book",
        body: "Book it before winter salt, after spring pollen, before a road trip, or any time the paint feels rough after washing."
      }
    ],
    processTitle: "Exterior enhancement process",
    process: [
      "Pre-rinse, foam, and hand wash the paint, wheels, barrels, arches, trim, and exterior glass.",
      "Use iron remover and clay treatment to pull bonded contamination from the paint.",
      "Dry safely and inspect the surface for remaining roughness, bug residue, or trim issues.",
      "Apply a hydrophobic sealant, dress tires, finish glass, and wipe final details."
    ],
    buyerNotes: [
      "This improves gloss, but it does not remove swirl marks like machine polishing does.",
      "If paint looks hazy under sun, compare Paint Enhancement Polish.",
      "Best maintenance is safe hand washing after the sealant is applied."
    ],
    faq: [
      {
        question: "Is Premium Wash and Wax the same as paint correction?",
        answer: "No. This service cleans and protects the exterior. Paint correction uses machine polishing to remove swirls, haze, oxidation, and light scratches."
      },
      {
        question: "How long does the sealant last?",
        answer: "Durability depends on washing habits, weather, storage, and mileage. The package is designed as seasonal protection, not a multi-year ceramic coating."
      },
      {
        question: "Will the paint feel smooth after this?",
        answer: "Yes, the decontamination and clay step are designed to remove bonded grit so the paint feels much smoother than a normal wash."
      },
      {
        question: "Can this be done before ceramic coating?",
        answer: "It is a good first step, but ceramic coating may also need polishing or panel prep depending on the paint condition."
      },
      {
        question: "Does it include interior cleaning?",
        answer: "No. Pair it with Signature Interior Detail or book Signature Full Detail if you want both inside and outside cleaned."
      }
    ],
    internalServiceIds: ["paint-enhancement-polish", "full-detail-package", "system-x-crystal-plus", "system-x-pro-plus"]
  },
  "paint-enhancement-polish": {
    headline: "Paint Enhancement Polish for dull, hazy, lightly swirled paint",
    intro: "Paint Enhancement Polish is the visual upgrade for paint that looks tired but does not need heavy correction. It is ideal for daily drivers with wash haze, light swirls, oxidation, and a lack of depth.",
    sections: [
      {
        title: "What this service solves",
        body: "It improves gloss, reflection, and clarity by polishing away light defects that wax cannot fix. It is the bridge between a wash and true correction."
      },
      {
        title: "Why one stage works",
        body: "A single-stage polish can create a major improvement when defects are light to moderate. Bryan chooses the pad and polish to improve the finish while preserving clear coat."
      },
      {
        title: "Best time to book",
        body: "Book it before ceramic coating, before photos, after years of automatic car washes, or when the paint looks flat in sunlight."
      }
    ],
    processTitle: "Enhancement polish process",
    process: [
      "Wash, chemically decontaminate, and clay the paint so polishing is safe.",
      "Inspect the paint under lighting to identify haze, oxidation, and swirl level.",
      "Machine polish the paint in one controlled stage to improve clarity and gloss.",
      "Apply durable sealant protection and perform a final walkaround inspection."
    ],
    buyerNotes: [
      "Expect improvement, not a flawless correction on heavily scratched paint.",
      "Level 1 or Level 2 Paint Correction is better for deeper defects.",
      "Pairs extremely well with ceramic coating for longer-term protection."
    ],
    faq: [
      {
        question: "How much defect removal should I expect?",
        answer: "Most vehicles see a major gloss improvement and reduction in light swirls or haze. Deep scratches and severe defects need dedicated paint correction."
      },
      {
        question: "Will it remove oxidation?",
        answer: "It can improve light oxidation on automotive paint. Severe oxidation, gel coat oxidation, or failing clear coat may need a different restoration plan."
      },
      {
        question: "Is this good before selling a car?",
        answer: "Yes. Better paint gloss can make listing photos and first impressions stronger. The Pre-Sale Detail Package includes a broader presentation reset."
      },
      {
        question: "Can you ceramic coat after this?",
        answer: "Yes, this is often the right prep level for a vehicle that needs gloss improvement before coating."
      },
      {
        question: "Is it safe for clear coat?",
        answer: "Bryan uses controlled machine polishing and inspects the surface so the goal is improvement without unnecessary clear-coat removal."
      }
    ],
    internalServiceIds: ["paint-correction-l1", "system-x-crystal-plus", "pre-sale-detail", "system-x-pro-plus"]
  },
  "paint-correction-l1": {
    headline: "Level 1 Paint Correction for swirl removal and clearer reflections",
    intro: "Level 1 Paint Correction is a dedicated single-stage correction for newer or well-maintained vehicles with wash swirls, towel marks, light scratches, and haze. The goal is real defect removal, not glaze or filler.",
    sections: [
      {
        title: "What this service solves",
        body: "It corrects the kind of defects you see in direct sun: circular wash marks, light marring, cloudy reflection, and fine scratches that make paint look older than it is."
      },
      {
        title: "Correction vs. enhancement",
        body: "Paint Enhancement is a gloss upgrade. Level 1 Correction is more focused on measurable defect reduction with inspection lighting and a correction-minded process."
      },
      {
        title: "Best time to book",
        body: "Book it before ceramic coating, after automatic wash damage, before car shows, or when you want the paint to look genuinely corrected instead of just shiny."
      }
    ],
    processTitle: "Level 1 correction process",
    process: [
      "Wash, iron decontaminate, clay, and inspect the paint condition under correction lighting.",
      "Test polish to choose the safest pad and polish combination for the paint system.",
      "Machine correct the paint in a controlled single-stage process panel by panel.",
      "Inspect results, wipe down residue, and apply protection or prepare for coating."
    ],
    buyerNotes: [
      "Deep scratches that catch a fingernail may only improve, not disappear.",
      "Paint thickness, defect depth, and clear-coat safety determine final correction percentage.",
      "Ceramic coating is recommended after correction to protect the work."
    ],
    faq: [
      {
        question: "What defects does Level 1 correction remove?",
        answer: "It is designed for light to moderate swirls, haze, towel marks, and minor wash scratches. It is not meant for severe defects or deep random scratches."
      },
      {
        question: "How is this different from Paint Enhancement Polish?",
        answer: "Paint Enhancement is a lighter gloss service. Level 1 Correction uses a more correction-focused process with inspection and a stronger defect-removal goal."
      },
      {
        question: "Will the paint be perfect?",
        answer: "Not always. The goal is safe, visible correction while preserving clear coat. A flawless result may require Level 2 correction or may not be safe on every vehicle."
      },
      {
        question: "Should I add ceramic coating?",
        answer: "Yes if you want the corrected paint protected for years instead of months. Correction creates the look; coating helps maintain it."
      },
      {
        question: "Can this be done mobile?",
        answer: "Some correction work can be mobile, but controlled lighting, weather, and curing conditions often make Bellevue drop-off the better option."
      }
    ],
    internalServiceIds: ["paint-correction-l2", "system-x-pro-plus", "system-x-max-g-plus", "paint-enhancement-polish"]
  },
  "paint-correction-l2": {
    headline: "Level 2 Paint Correction for heavy swirls, deeper scratches, and serious gloss recovery",
    intro: "Level 2 Paint Correction is for paint that needs a more intensive restoration process. It combines a cutting step and a finishing step to reduce heavier defects while bringing back clarity, depth, and gloss.",
    sections: [
      {
        title: "What this service solves",
        body: "It targets severe wash swirls, oxidation haze, deeper marring, neglected paint, and the dull finish that makes a vehicle look older in sunlight."
      },
      {
        title: "Two stages for better finish",
        body: "The first stage cuts defects; the second stage refines the paint so the finish is not left hazy. That extra step is why Level 2 is reserved for vehicles that need real restoration."
      },
      {
        title: "Best time to book",
        body: "Book it for older vehicles, black paint with heavy swirls, pre-ceramic restoration, or any vehicle where Level 1 is not enough."
      }
    ],
    processTitle: "Level 2 correction process",
    process: [
      "Wash, decontaminate, clay, inspect, and test the paint before correction starts.",
      "Compound the paint with a controlled cutting step to reduce heavier defects.",
      "Refine the finish with a second polishing step to restore depth and clarity.",
      "Panel wipe, inspect under lighting, and protect the corrected surface."
    ],
    buyerNotes: [
      "This is usually a drop-off service because it needs time, lighting, and controlled conditions.",
      "Not every defect can be safely removed if it is through the clear coat.",
      "Best paired with ceramic coating because the corrected surface deserves durable protection."
    ],
    faq: [
      {
        question: "Is Level 2 correction worth it for black paint?",
        answer: "Often yes. Dark paint shows swirls and haze more clearly, and the two-stage process can dramatically improve depth and reflection."
      },
      {
        question: "Can Level 2 remove deep scratches?",
        answer: "It can reduce many deeper clear-coat scratches, but scratches through the clear or into base coat cannot be safely polished away."
      },
      {
        question: "How long does Level 2 take?",
        answer: "Most Level 2 jobs require one to two days depending on vehicle size, paint hardness, defect level, and protection choice."
      },
      {
        question: "Do I need a paint inspection first?",
        answer: "Yes. Bryan inspects the vehicle and can recommend whether Level 1, Level 2, or another package makes the most sense."
      },
      {
        question: "What should I do after correction?",
        answer: "Avoid automatic brush washes, use safe wash methods, and strongly consider ceramic coating to protect the corrected finish."
      }
    ],
    internalServiceIds: ["system-x-crystal-plus", "system-x-pro-plus", "paint-correction-l1", "showroom-package"]
  },
  "ceramic-3yr": {
    headline: "3-Year Ceramic Coating for easier washing, gloss, and long-term protection",
    intro: "The 3-Year Ceramic Coating is for drivers who want a cleaner-looking vehicle with less work. It adds durable hydrophobic protection after the paint is properly washed, decontaminated, inspected, and prepared.",
    sections: [
      {
        title: "What this service solves",
        body: "It helps protect against UV exposure, road grime, salt, bug residue, water spotting risk, and the constant dirt that sticks to unprotected paint."
      },
      {
        title: "Prep is the difference",
        body: "Ceramic coating is only as good as the surface underneath it. Bryan decontaminates and prepares the paint so the coating bonds correctly instead of being layered over dirt or haze."
      },
      {
        title: "Best time to book",
        body: "Book it for new vehicles, freshly corrected paint, daily drivers you plan to keep, or any vehicle you want to maintain with easier washes."
      }
    ],
    processTitle: "Ceramic coating process",
    process: [
      "Wash, decontaminate, clay, and inspect the paint before coating prep begins.",
      "Polish or correct the paint as needed so the coating locks in a cleaner surface.",
      "Panel prep the paint to remove oils and residue that could affect coating bond.",
      "Apply, level, inspect, and cure the coating according to product requirements."
    ],
    buyerNotes: [
      "Ceramic coating is not scratch-proof, but it does make cleaning easier and adds chemical resistance.",
      "Avoid harsh washing during the cure window Bryan gives you after the service.",
      "Best results come from safe maintenance washes after coating."
    ],
    faq: [
      {
        question: "Is ceramic coating better than wax?",
        answer: "Yes for durability and ease of cleaning. Wax is short-term protection; a professional ceramic coating bonds to the paint and lasts much longer when maintained correctly."
      },
      {
        question: "Does ceramic coating stop scratches?",
        answer: "No coating makes paint scratch-proof. Ceramic helps with slickness, gloss, hydrophobic behavior, UV resistance, and easier cleaning, but safe wash habits still matter."
      },
      {
        question: "Do you polish before coating?",
        answer: "Bryan inspects the paint and recommends the right prep. Many vehicles benefit from at least a light polish before coating because the coating locks in the finish underneath."
      },
      {
        question: "How do I wash a coated car?",
        answer: "Use pH-neutral soap, clean wash media, gentle drying, and avoid automatic brush washes. Maintenance Detail is available for coated vehicles."
      },
      {
        question: "Can new cars be coated?",
        answer: "Yes, and new cars are often the best candidates because protection starts before road wear and wash damage build up."
      }
    ],
    internalServiceIds: ["new-car-detail", "system-x-pro-plus", "paint-correction-l1", "maintenance-detail"]
  },
  "protection-package": {
    headline: "Protection Package for corrected paint sealed under ceramic coating",
    intro: "The Protection Package combines paint correction and ceramic coating so your paint is not just protected, but prepared correctly first. It is the right package when you want a serious exterior result in one plan.",
    sections: [
      {
        title: "What this service solves",
        body: "It fixes the common mistake of coating over swirled or contaminated paint. Bryan improves the finish first, then applies durable ceramic protection."
      },
      {
        title: "Why bundling works",
        body: "Correction and coating belong together because coating locks in the surface. Bundling gives the job enough time for decontamination, polishing, prep, coating, and inspection."
      },
      {
        title: "Best time to book",
        body: "Book it for a new vehicle you want protected, a corrected daily driver, or a vehicle you plan to keep looking sharp for years."
      }
    ],
    processTitle: "Correction and coating process",
    process: [
      "Wash, decontaminate, clay, inspect, and prepare the exterior for correction.",
      "Machine correct or polish the paint to improve gloss and reduce defects.",
      "Panel prep the corrected paint so the ceramic coating can bond cleanly.",
      "Apply ceramic coating, inspect the finish, and review maintenance instructions."
    ],
    buyerNotes: [
      "This is a premium exterior package and is usually best as a drop-off job.",
      "The exact correction level depends on paint condition and vehicle goals.",
      "Ask about maintenance washing so the protected finish stays looking right."
    ],
    faq: [
      {
        question: "Why not just ceramic coat without correction?",
        answer: "Because coating locks in what is underneath. If the paint is swirled, hazy, or contaminated, correcting first produces a cleaner and more valuable result."
      },
      {
        question: "Is this better for new cars or used cars?",
        answer: "Both can benefit. New cars often have dealer prep marks, and used cars often need correction before coating. Bryan will inspect and recommend the right prep level."
      },
      {
        question: "How long should I leave the car with you?",
        answer: "Plan on a longer drop-off window because correction, coating, leveling, and curing cannot be rushed."
      },
      {
        question: "Does this include wheels and windshield?",
        answer: "The package includes exterior prep and protection steps listed on the service page. Bryan can confirm exact coating coverage before booking."
      },
      {
        question: "How do I maintain it?",
        answer: "Use safe wash methods, avoid brush washes, remove bugs and bird droppings quickly, and consider the Maintenance Plan for routine upkeep."
      }
    ],
    internalServiceIds: ["system-x-pro-plus", "paint-correction-l1", "paint-correction-l2", "new-car-detail"]
  },
  "full-detail-package": {
    headline: "Signature Full Detail for a complete inside-and-out vehicle refresh",
    intro: "Signature Full Detail is the practical full reset for most Bellevue and Omaha drivers. It combines the interior clean people notice when they sit down with the exterior wash, decontamination, and protection people notice from the curb.",
    sections: [
      {
        title: "What this service solves",
        body: "It handles the vehicle as a whole: dusty cabin, dirty mats, glass film, road grime, wheels, rough paint feel, dull tires, and the lack of protection after months of driving."
      },
      {
        title: "Why it is the best everyday package",
        body: "Most customers do not need a separate interior and exterior visit. Bundling them gives better value and a cleaner, more balanced result."
      },
      {
        title: "Best time to book",
        body: "Book it twice a year, before a road trip, after winter, before a special event, or whenever the vehicle needs a full professional reset."
      }
    ],
    processTitle: "Full detail process",
    process: [
      "Inspect vehicle size, interior condition, exterior contamination, wheels, glass, and paint feel.",
      "Complete the Signature Interior Detail process for the cabin and trunk.",
      "Wash, decontaminate, and protect the exterior with a premium sealant.",
      "Finish trim, tires, glass, jambs, and final presentation details."
    ],
    buyerNotes: [
      "Choose Showroom Package for deep interior extraction plus machine polishing.",
      "Add Odor Elimination if the cabin has smoke, mildew, pet, or food smells.",
      "Maintenance Plan is best after a full detail if you want to keep it clean."
    ],
    faq: [
      {
        question: "Is Signature Full Detail good for most vehicles?",
        answer: "Yes. It is the right choice for normal daily-driver buildup where both interior and exterior need attention."
      },
      {
        question: "Does it include paint correction?",
        answer: "No. It includes exterior cleaning and protection. If the paint is dull or swirled, compare Paint Enhancement Polish or Showroom Package."
      },
      {
        question: "Does it include shampooing?",
        answer: "It includes the Signature Interior Detail level of cleaning. Heavy fabric shampooing and extraction are part of Interior Restoration or Showroom Package."
      },
      {
        question: "How often should I book it?",
        answer: "Many customers book a full detail seasonally or twice per year, then use Maintenance Plan visits in between."
      },
      {
        question: "Can this be mobile?",
        answer: "Often yes, depending on weather, space, water or power needs, and vehicle condition."
      }
    ],
    internalServiceIds: ["showroom-package", "maintenance-detail", "paint-enhancement-polish", "interior-reset"]
  },
  "showroom-package": {
    headline: "Showroom Package for heavy interior cleaning and exterior machine polishing",
    intro: "The Showroom Package is for vehicles that need the bigger transformation: stained interior, tired paint, dull gloss, engine bay grime, odor-prone fabric, or pre-sale presentation where first impressions matter.",
    sections: [
      {
        title: "What this service solves",
        body: "It combines deep interior restoration with machine paint enhancement, making it ideal for neglected daily drivers, used-car purchases, and vehicles being prepared for sale."
      },
      {
        title: "What the package adds",
        body: "The cabin gets deeper cleaning, the paint gets gloss correction, and the vehicle is prepared for a stronger overall presentation."
      },
      {
        title: "Best time to book",
        body: "Book it before selling, after buying used, after a rough season of family use, or when a regular full detail will not be enough."
      }
    ],
    processTitle: "Showroom reset process",
    process: [
      "Inspect stains, odor, pet hair, paint haze, scratches, engine bay, and presentation concerns.",
      "Deep clean and extract the interior with steam, shampoo, and fabric-focused treatment.",
      "Wash, decontaminate, and machine polish the exterior to restore clarity and gloss.",
      "Dress, protect, inspect, and finish the vehicle for strong in-person and photo presentation."
    ],
    buyerNotes: [
      "This is the package to choose when resale value or visual transformation matters.",
      "Severe odor may still need dedicated Odor Elimination Treatment.",
      "Deep scratches may need Level 1 or Level 2 Paint Correction instead of enhancement."
    ],
    faq: [
      {
        question: "Is Showroom Package better than Signature Full Detail?",
        answer: "Yes for vehicles with heavier interior contamination or dull paint. Signature Full Detail is the everyday reset; Showroom Package is the stronger transformation."
      },
      {
        question: "Will this help me sell my car?",
        answer: "Yes. Clean interiors, glossy paint, clear photos, and a better first impression can help a vehicle sell faster and with more confidence."
      },
      {
        question: "Does it include engine bay cleaning?",
        answer: "The package includes an engine bay restoration feature as listed. Bryan will confirm condition and any sensitive areas before cleaning."
      },
      {
        question: "Will it remove every scratch?",
        answer: "No. It includes paint enhancement, not full multi-stage correction. Heavy defects may need Level 2 Paint Correction."
      },
      {
        question: "How long does it take?",
        answer: "Plan for a longer appointment because the package combines deep interior work and exterior machine polishing."
      }
    ],
    internalServiceIds: ["pre-sale-detail", "paint-correction-l1", "odor-elimination", "full-detail-package"]
  },
  "maintenance-detail": {
    headline: "Maintenance Plan for vehicles that have already been professionally reset",
    intro: "Maintenance Plan is not a first-time rescue detail. It is ongoing care for vehicles Bryan has already detailed, corrected, or coated so the finish stays cleaner and the interior does not slide backward.",
    sections: [
      {
        title: "What this service solves",
        body: "It prevents buildup from becoming a big expensive reset again. Regular safe washing, quick interior care, glass cleaning, and protection refreshes keep the vehicle presentable."
      },
      {
        title: "Why it is reserved",
        body: "Maintenance pricing only works when the vehicle starts from a known clean baseline. That keeps visits efficient and fair."
      },
      {
        title: "Best time to book",
        body: "Book it after a full detail, paint correction, ceramic coating, or new-car protection package."
      }
    ],
    processTitle: "Maintenance visit process",
    process: [
      "Review the current condition and note any new problem areas since the last detail.",
      "Perform a safe wash, tire dressing, glass cleaning, and exterior protection refresh.",
      "Vacuum and wipe interior surfaces to maintain the previous detail.",
      "Recommend deeper service only if the vehicle has moved beyond maintenance condition."
    ],
    buyerNotes: [
      "This is for existing clients or recently detailed vehicles.",
      "Heavy stains, pet hair, and neglected interiors need a full detail first.",
      "Great for ceramic-coated vehicles that need safe routine washing."
    ],
    faq: [
      {
        question: "Can I book Maintenance Plan as my first service?",
        answer: "Usually no. It is designed for vehicles that have already been reset by a professional detail so the visit can stay efficient."
      },
      {
        question: "How often should I schedule maintenance?",
        answer: "Monthly or every few weeks is ideal for busy daily drivers, coated vehicles, and customers who want the car to stay consistently clean."
      },
      {
        question: "Does it include stain removal?",
        answer: "It includes routine upkeep, not heavy stain removal. New spills or stains can be quoted separately."
      },
      {
        question: "Is it safe for ceramic coatings?",
        answer: "Yes. Safe washing and gentle protection refreshes help coated vehicles stay slick and easier to clean."
      },
      {
        question: "What happens if my car gets too dirty?",
        answer: "Bryan may recommend Signature Full Detail, Interior Restoration, or another reset before returning to maintenance pricing."
      }
    ],
    internalServiceIds: ["full-detail-package", "system-x-crystal-plus", "system-x-pro-plus", "interior-detail"]
  },
  "rv-boat-wash-wax": {
    headline: "RV and Boat Wash and Wax for large-surface cleaning and UV protection",
    intro: "RV and Boat Wash and Wax is quoted by size, access, exterior material, bug buildup, road grime, water spotting, and sun exposure. Large vehicles take more time and need a careful process.",
    sections: [
      {
        title: "What this service solves",
        body: "It cleans large exterior surfaces, removes road film and bugs, improves appearance, and adds UV-focused wax or sealant protection."
      },
      {
        title: "Why photos help",
        body: "RV and boat condition varies wildly. Photos help Bryan quote fairly for height, oxidation, length, access, decals, and surface condition."
      },
      {
        title: "Best time to book",
        body: "Book before storage, after travel season, before lake season, or when the surface feels dirty, chalky, or unprotected."
      }
    ],
    processTitle: "RV and boat exterior process",
    process: [
      "Confirm size, access, water availability, height, surface condition, and safety requirements.",
      "Wash accessible exterior surfaces, wheels, arches, roof areas where safe, and bug-heavy zones.",
      "Address road film, water spots, grime, and surface contamination according to condition.",
      "Apply wax or sealant protection and review any oxidation concerns for future restoration."
    ],
    buyerNotes: [
      "Pricing is usually based on length, condition, height, and access.",
      "Heavy oxidation requires Oxidation Removal, not a standard wash and wax.",
      "Weather and safe working access can affect scheduling."
    ],
    faq: [
      {
        question: "Why is RV and boat pricing by foot?",
        answer: "Large vehicles vary by length, height, surface area, and access. Per-foot pricing keeps the quote fair instead of treating them like cars."
      },
      {
        question: "Can you wash the roof?",
        answer: "Roof cleaning depends on safe access, material, condition, and weather. Bryan will confirm what is safe before the job."
      },
      {
        question: "Does this remove oxidation?",
        answer: "No, not heavy oxidation. Oxidation Removal uses machine compounding and polishing to restore chalky gel coat or faded surfaces."
      },
      {
        question: "Do I need to provide water or power?",
        answer: "Bryan will confirm job requirements before booking. Large vehicles often need access planning."
      },
      {
        question: "Should I send photos?",
        answer: "Yes. Photos of all sides, problem areas, height, and oxidation help produce a better quote."
      }
    ],
    internalServiceIds: ["rv-boat-oxidation", "exterior-enhancement", "system-x-crystal-plus", "paint-enhancement-polish"]
  },
  "rv-boat-oxidation": {
    headline: "RV and Boat Oxidation Removal for chalky gel coat and faded surfaces",
    intro: "Oxidation Removal is for RVs and boats that no longer respond to a normal wash. It uses machine compounding and polishing to restore color, gloss, and a cleaner surface before sealing.",
    sections: [
      {
        title: "What this service solves",
        body: "It targets chalky gel coat, faded color, cloudy reflection, sun damage, and the white residue that returns after simple washing."
      },
      {
        title: "Why restoration takes time",
        body: "Oxidized surfaces need cutting, polishing, and protection. The worse the oxidation, the more testing and controlled passes are needed."
      },
      {
        title: "Best time to book",
        body: "Book it before selling, before boating season, after long outdoor storage, or when wash and wax no longer improves the surface."
      }
    ],
    processTitle: "Oxidation restoration process",
    process: [
      "Inspect oxidation level, gel coat condition, decals, access, height, and surface sensitivity.",
      "Wash and prepare the surface so compound can work cleanly.",
      "Machine compound and polish faded areas to restore gloss and color where safely possible.",
      "Seal the restored surface and recommend maintenance to slow future oxidation."
    ],
    buyerNotes: [
      "Severe oxidation may require multiple stages or may only improve, not fully restore.",
      "Decals, older gel coat, and failing surfaces may limit how much improvement is possible.",
      "Photos are important before quoting."
    ],
    faq: [
      {
        question: "Can you fully restore badly oxidized gel coat?",
        answer: "Many oxidized surfaces improve significantly, but extremely weathered or failing gel coat may not return to a new look. Bryan will explain how much improvement is possible after inspection."
      },
      {
        question: "How is this different from wash and wax?",
        answer: "Wash and wax cleans and protects. Oxidation Removal uses machine compounding and polishing to cut through chalky dead surface material."
      },
      {
        question: "Will oxidation come back?",
        answer: "Oxidation can return over time with UV exposure and poor maintenance. Sealant, covered storage, and regular cleaning slow it down."
      },
      {
        question: "Is this priced by foot?",
        answer: "Pricing depends on length, height, condition, oxidation severity, and access because labor can vary dramatically."
      },
      {
        question: "Can you work on boats and RVs mobile?",
        answer: "Often yes, but safe access, water, power, space, and weather must be confirmed first."
      }
    ],
    internalServiceIds: ["rv-boat-wash-wax", "paint-enhancement-polish", "system-x-pro-plus", "exterior-enhancement"]
  },
  "tractor-detailing-service": {
    headline: "Tractor and Equipment Cleanup for heavy-duty work vehicles",
    intro: "Tractor and Equipment Cleanup is for agricultural and work equipment that needs mud, grease, grime, cab dirt, glass film, and buildup removed so it looks better and is easier to inspect.",
    sections: [
      {
        title: "What this service solves",
        body: "It cleans the mess that comes from real work: mud, grease, dust, dirty cabs, cloudy glass, and exterior buildup around machinery surfaces."
      },
      {
        title: "Why equipment cleaning matters",
        body: "Clean equipment is easier to inspect, nicer to operate, and better presented for resale, trade-in, or seasonal maintenance."
      },
      {
        title: "Best time to book",
        body: "Book after harvest, before sale, before storage, after field work, or when cab visibility and comfort need attention."
      }
    ],
    processTitle: "Equipment cleanup process",
    process: [
      "Review equipment type, access, grease level, mud, cab condition, and sensitive components.",
      "Degrease and pressure clean exterior surfaces where it is safe to do so.",
      "Clean cab touch points, glass, floor areas, panels, and visible interior surfaces.",
      "Inspect remaining buildup and recommend any extra labor for severe contamination."
    ],
    buyerNotes: [
      "Heavy grease, mud, and access issues can change the quote.",
      "Sensitive components are handled carefully and discussed before stronger cleaning.",
      "Photos help estimate time before scheduling."
    ],
    faq: [
      {
        question: "Can you clean farm equipment on site?",
        answer: "Often yes, depending on location, access, water, power, weather, and the type of equipment."
      },
      {
        question: "Does this include engine degreasing?",
        answer: "Heavy-duty degreasing is part of the service where safe and appropriate. Bryan will review sensitive areas before cleaning."
      },
      {
        question: "Can you clean the cab interior?",
        answer: "Yes. Cab wipe-down, glass cleaning, dust removal, and visible interior cleanup are included."
      },
      {
        question: "How do you quote equipment?",
        answer: "Quotes depend on size, contamination, grease, mud, access, and the depth of cleaning needed."
      },
      {
        question: "Should I send photos?",
        answer: "Yes. Photos make it much easier to estimate labor accurately."
      }
    ],
    internalServiceIds: ["rv-boat-wash-wax", "exterior-enhancement", "interior-detail", "pre-sale-detail"]
  },
  "new-car-detail": {
    headline: "New Car Detail and Protection for a clean, protected start",
    intro: "New vehicles often arrive with transport contamination, light dealer wash swirls, adhesive residue, and unprotected paint. New Car Detail and Protection gives the vehicle a cleaner start before daily driving adds wear.",
    sections: [
      {
        title: "What this service solves",
        body: "It removes bonded contamination and light defects that can be present even on brand-new cars. It also adds protection before Nebraska roads, bugs, salt, and sun start working on the paint."
      },
      {
        title: "Why new does not mean perfect",
        body: "Dealership washes, transport, lot storage, and quick prep can leave marks. Bryan inspects and prepares the vehicle so protection is applied to a cleaner surface."
      },
      {
        title: "Best time to book",
        body: "Book as soon as possible after purchase, ideally before repeated washes or long daily driving."
      }
    ],
    processTitle: "New car protection process",
    process: [
      "Inspect paint, glass, trim, dealer prep marks, adhesives, and surface contamination.",
      "Wash, decontaminate, clay where needed, and clean the exterior safely.",
      "Perform light polishing or defect removal based on inspection.",
      "Apply sealant or ceramic protection and finish the interior touch points and glass."
    ],
    buyerNotes: [
      "A new car can still benefit from polishing before protection.",
      "Ceramic coating is the strongest upgrade if you plan to keep the vehicle.",
      "Avoid dealership automatic washes after the detail."
    ],
    faq: [
      {
        question: "Why detail a brand-new car?",
        answer: "Because new cars are often contaminated from transport and may have dealer wash marks. Detailing removes that contamination and protects the vehicle early."
      },
      {
        question: "Should I choose ceramic coating with this?",
        answer: "Yes if you want long-term protection and easier washing. Sealant is good, but ceramic is the stronger investment."
      },
      {
        question: "Will this void any warranty?",
        answer: "Professional exterior cleaning and protection should not void a vehicle warranty. Bryan uses safe methods and will avoid anything inappropriate for the vehicle."
      },
      {
        question: "Does it remove dealer stickers or adhesive?",
        answer: "Light adhesive and residue can often be addressed safely. Mention it before booking so Bryan can plan time."
      },
      {
        question: "How soon after buying should I book?",
        answer: "The sooner the better. Early protection helps prevent contamination and wash damage from building up."
      }
    ],
    internalServiceIds: ["system-x-crystal-plus", "system-x-pro-plus", "paint-correction-l1", "maintenance-detail"]
  },
  "pre-sale-detail": {
    headline: "Pre-Sale Detail Package to help your vehicle photograph and show better",
    intro: "Pre-Sale Detail Package is built for sellers who want stronger first impressions. It focuses on the details buyers notice immediately: clean seats, fresh cabin, glossy paint, engine bay presentation, clear glass, tires, and photos.",
    sections: [
      {
        title: "What this service solves",
        body: "It reduces the visual reasons buyers hesitate: dirty interior, stained fabric, dull paint, odors, engine bay grime, cloudy headlights, and poor listing photos."
      },
      {
        title: "Why presentation matters",
        body: "A cleaner vehicle feels better cared for. Buyers make quick judgments, and a professional detail can make the car easier to trust."
      },
      {
        title: "Best time to book",
        body: "Book before taking listing photos, before trade-in appraisal, or before showing the vehicle to private buyers."
      }
    ],
    processTitle: "Pre-sale presentation process",
    process: [
      "Inspect the vehicle for buyer-visible issues such as stains, odor, dull paint, engine bay grime, and glass film.",
      "Deep clean the interior, mats, fabric, panels, trim, and high-touch areas.",
      "Machine enhance the paint, clean the engine bay, dress tires, and improve exterior presentation.",
      "Finish the vehicle so it is ready for photos and in-person showings."
    ],
    buyerNotes: [
      "Book before you take photos, not after the listing is already live.",
      "Severe odor may need dedicated Odor Elimination Treatment.",
      "If paint is heavily scratched, Level 1 or Level 2 Paint Correction may be recommended."
    ],
    faq: [
      {
        question: "Can a pre-sale detail increase my selling price?",
        answer: "It can improve buyer confidence and presentation, which often helps a vehicle sell faster and with fewer objections. Final sale price depends on the vehicle and market."
      },
      {
        question: "Should I detail before trade-in?",
        answer: "Yes if the vehicle is dirty enough to hurt perception. Clean presentation can help the appraisal conversation."
      },
      {
        question: "Does this include odor removal?",
        answer: "It includes odor-focused cleaning, but strong smoke, pet, mildew, or food odor may need Odor Elimination Treatment."
      },
      {
        question: "Will it hide all scratches?",
        answer: "No. It improves presentation and gloss. Deep scratches may still show and should be discussed before booking."
      },
      {
        question: "Can you help me choose photos after the detail?",
        answer: "The service prepares the vehicle for better photos. Bryan can point out clean angles and presentation details during pickup."
      }
    ],
    internalServiceIds: ["showroom-package", "paint-enhancement-polish", "odor-elimination", "interior-reset"]
  },
  "odor-elimination": {
    headline: "Odor Elimination Treatment for smoke, pet, mildew, and food smells",
    intro: "Odor Elimination Treatment is for vehicles where air fresheners have failed. It focuses on cleaning odor sources first, then treating the cabin and ventilation areas so smells are neutralized instead of covered up.",
    sections: [
      {
        title: "What this service solves",
        body: "It targets smoke, pet accidents, mildew, food spills, musty carpet, and stale cabin smells that live in fabric, foam, vents, headliners, and hidden debris."
      },
      {
        title: "Why source removal matters",
        body: "Odor treatment works best after the physical source is cleaned. Bryan pairs cleaning, enzyme treatment when needed, and ozone treatment for a more complete result."
      },
      {
        title: "Best time to book",
        body: "Book after buying a used car, after smoke exposure, after pet accidents, after leaks or mildew smell, or before selling a vehicle with odor history."
      }
    ],
    processTitle: "Odor removal process",
    process: [
      "Inspect odor type, likely source, fabric condition, HVAC smell, carpet, seats, and headliner risk.",
      "Vacuum and clean interior surfaces to remove odor-causing residue before treatment.",
      "Use enzyme or targeted treatment on problem areas when appropriate.",
      "Run controlled ozone treatment and air out the vehicle before final inspection."
    ],
    buyerNotes: [
      "Odor treatment is strongest when paired with interior cleaning.",
      "Water leaks, mold, or active contamination must be corrected or smells can return.",
      "Ozone treatment requires the vehicle to be empty of people, pets, and sensitive items during the process."
    ],
    faq: [
      {
        question: "Does ozone permanently remove smoke smell?",
        answer: "Ozone can destroy many odor compounds, but smoke is difficult if residue remains in fabric, headliner, vents, or foam. Cleaning the source first gives the best result."
      },
      {
        question: "Is ozone safe?",
        answer: "Ozone is only used while the vehicle is unoccupied and then aired out. Bryan follows a controlled process so the vehicle is safe before pickup."
      },
      {
        question: "Will odor come back?",
        answer: "Odor can return if the source remains, such as moisture intrusion, mold, or ongoing smoking. Bryan will point out any issues that could cause recurrence."
      },
      {
        question: "Do I need an interior detail too?",
        answer: "Usually yes. Odor treatment works best when odor-causing dirt, residue, and spills are cleaned first."
      },
      {
        question: "Can you treat pet odor?",
        answer: "Yes, pet odor can often be improved with cleaning, enzyme treatment, and ozone depending on severity and whether urine or moisture reached foam or carpet backing."
      }
    ],
    internalServiceIds: ["interior-reset", "pre-sale-detail", "showroom-package", "interior-detail"]
  },
  "ppf-inquiry": {
    headline: "Paint Protection Film inquiry for rock-chip protection and high-impact areas",
    intro: "Paint Protection Film, or PPF, is for drivers who want physical paint protection in high-impact areas. It is different from ceramic coating because the film absorbs road debris and rock-chip abuse.",
    sections: [
      {
        title: "What this service solves",
        body: "PPF helps protect bumpers, hoods, mirrors, fenders, and other high-impact areas from chips, scuffs, and road debris."
      },
      {
        title: "PPF and ceramic are different",
        body: "Ceramic coating adds slickness and chemical resistance. PPF adds a physical film barrier. The best protection often combines both."
      },
      {
        title: "Best time to inquire",
        body: "Ask about PPF for new vehicles, highway commuters, performance cars, dark paint, and vehicles you want to keep chip-free as long as possible."
      }
    ],
    processTitle: "PPF inquiry process",
    process: [
      "Review the vehicle, paint condition, desired coverage areas, and driving habits.",
      "Discuss partial-front, full-front, mirror, bumper, or custom coverage needs.",
      "Confirm whether paint correction or coating should happen before or after film.",
      "Provide a custom recommendation based on protection goals and budget."
    ],
    buyerNotes: [
      "PPF pricing depends on vehicle, coverage area, film choice, and paint condition.",
      "Paint should be corrected before film if defects would be trapped underneath.",
      "Ceramic coating can be added over film for easier cleaning."
    ],
    faq: [
      {
        question: "Is PPF better than ceramic coating?",
        answer: "They solve different problems. PPF protects against physical impacts like rock chips. Ceramic coating helps with slickness, gloss, chemical resistance, and easier washing."
      },
      {
        question: "Can PPF be installed on a used car?",
        answer: "Yes, but the paint should be inspected and often corrected first so defects are not trapped under the film."
      },
      {
        question: "What areas should I protect?",
        answer: "Common areas include front bumper, hood, fenders, mirrors, door cups, and high-impact zones. Coverage depends on driving habits and budget."
      },
      {
        question: "Can ceramic coating go over PPF?",
        answer: "Yes. Coating over film can make it easier to clean and maintain."
      },
      {
        question: "Is this available for instant online booking?",
        answer: "PPF should start with an inquiry because coverage, vehicle shape, and paint condition affect the quote."
      }
    ],
    internalServiceIds: ["system-x-crystal-plus", "system-x-pro-plus", "paint-correction-l1", "new-car-detail"]
  }
};

Object.assign(SERVICE_PAGE_CONTENT, {
  "system-x-crystal-plus": {
    headline: "System X Crystal+ protection without paying for correction you do not need",
    intro: "Crystal+ Essential is the entry point to certified System X protection. It pairs careful decontamination and light gloss enhancement with a registered 2-year coating package for newer or well-kept daily drivers.",
    sections: [
      { title: "What is included", body: "A safe wash, iron removal, clay decontamination, light gloss-enhancement polish, panel prep, System X Crystal+ on painted surfaces, warranty registration, and a clear aftercare guide." },
      { title: "Who it fits", body: "Choose Crystal+ when the paint is already in good condition and you want easier washing, stronger gloss, and professional protection at the most accessible System X price." }
    ],
    processTitle: "How Crystal+ Essential is installed",
    process: ["Inspect the paint and agree on the prep plan", "Wash and chemically decontaminate the exterior", "Clay and lightly polish the paint", "Panel-wipe and install Crystal+", "Cure, inspect, register, and explain aftercare"],
    buyerNotes: ["Starting price assumes average paint condition.", "Deeper swirl or scratch removal is quoted before work begins."],
    faq: [
      { question: "How long is Crystal+ covered?", answer: "Crystal+ carries a 2-year System X warranty when installed, registered, and maintained according to the manufacturer requirements." },
      { question: "Does it include paint correction?", answer: "It includes light gloss enhancement. Paint that needs meaningful defect removal is better suited to Pro+, MAX G+, or a separate correction service." }
    ],
    internalServiceIds: ["system-x-pro-plus", "paint-enhancement-polish", "maintenance-detail"]
  },
  "system-x-pro-plus": {
    headline: "System X Pro+ is the best balance of correction, warranty, and daily-driver value",
    intro: "Pro+ Signature is the recommended package for a vehicle you plan to keep. It adds single-stage paint enhancement and Glass+ windshield protection before the Pro+ coating is registered to the vehicle.",
    sections: [
      { title: "What is included", body: "Full decontamination, single-stage paint enhancement, panel prep, System X Pro+ on painted surfaces, Glass+ on the windshield, CARFAX registration, and aftercare guidance." },
      { title: "Why it is most popular", body: "It corrects the wash haze and light swirls most daily drivers have while giving a longer protection term without jumping to the lifetime-package price." }
    ],
    processTitle: "How Pro+ Signature is installed",
    process: ["Inspect paint and document existing defects", "Wash, iron-decontaminate, and clay", "Machine-polish for gloss and defect reduction", "Panel-wipe and install Pro+ and Glass+", "Cure, inspect, register, and review aftercare"],
    buyerNotes: ["Up to 6 years of protection depends on registration and required maintenance.", "Deep defects may require a correction upgrade."],
    faq: [
      { question: "Is Pro+ the best package for a daily driver?", answer: "For most owners, yes. It combines visible paint improvement, long-term protection, and windshield coating at the strongest value point in the lineup." },
      { question: "Is the windshield included?", answer: "Yes. System X Glass+ on the windshield is included in Pro+ Signature." }
    ],
    internalServiceIds: ["system-x-crystal-plus", "system-x-max-g-plus", "maintenance-detail"]
  },
  "system-x-max-g-plus": {
    headline: "MAX G+ Ultimate protects the complete exterior with lifetime-warranty eligibility",
    intro: "MAX G+ Ultimate is for long-term owners who want paint correction plus coordinated protection for paint, wheel faces, and windshield in one certified System X package.",
    sections: [
      { title: "What is included", body: "Single-stage paint correction, System X MAX G+ on paint and applicable exterior surfaces, Wheel+ on wheel faces, Glass+ on the windshield, registration, and a tailored aftercare plan." },
      { title: "Who should choose MAX G+", body: "It fits high-value vehicles, black paint, and long-term ownership when maximum gloss and a complete exterior system matter more than the lowest upfront price." }
    ],
    processTitle: "How MAX G+ Ultimate is installed",
    process: ["Inspect and measure the finish", "Deep-clean and decontaminate", "Complete single-stage paint correction", "Install MAX G+, Wheel+, and Glass+", "Cure, inspect, register, and hand off the care plan"],
    buyerNotes: ["Lifetime-warranty eligibility is subject to System X registration and maintenance requirements.", "Large vehicles or severe defects may require additional product or correction time."],
    faq: [
      { question: "Are wheels and glass included?", answer: "Yes. Wheel faces receive Wheel+ and the windshield receives Glass+." },
      { question: "Does MAX G+ remove every scratch?", answer: "No safe correction can guarantee every deep defect. The included single-stage correction targets broad gloss and swirl improvement; deeper work is discussed after inspection." }
    ],
    internalServiceIds: ["system-x-pro-plus", "system-x-phantom-2k", "paint-correction-l2"]
  },
  "system-x-phantom-2k": {
    headline: "Phantom 2K Bespoke is the flagship System X finish for specialty and high-end vehicles",
    intro: "Phantom 2K Bespoke starts with a paint inspection because the flagship coating deserves a correction plan matched to the actual vehicle. The plan may use one or two correction stages before the two-part coating system is installed.",
    sections: [
      { title: "What is included", body: "A vehicle-specific correction plan, Phantom 2K on paint and applicable exterior surfaces, Wheel+ on wheel faces, Glass+ on the windshield, registration, cure inspection, and detailed aftercare." },
      { title: "Why the plan is tailored", body: "Collector cars, black paint, repainted panels, and specialty finishes do not all need the same polishing process. Inspection protects the finish and keeps the quote honest." }
    ],
    processTitle: "How Phantom 2K Bespoke is installed",
    process: ["Inspect paint history, defects, and finish type", "Decontaminate and perform test spots", "Complete the agreed one- or two-stage correction", "Install Phantom 2K, Wheel+, and Glass+", "Cure, inspect, register, and deliver the care plan"],
    buyerNotes: ["The final correction plan is confirmed after inspection.", "The starting price assumes a standard-size sedan with correctable paint."],
    faq: [
      { question: "Why does Phantom 2K require an inspection?", answer: "Its buyers usually expect the highest finish quality. Inspection determines the safe correction steps before coating locks in the final appearance." },
      { question: "Can I book it online?", answer: "Yes, you can start the booking request online. Bryan confirms the paint condition, correction plan, and final price before the appointment." }
    ],
    internalServiceIds: ["system-x-max-g-plus", "paint-correction-l2", "maintenance-detail"]
  }
} satisfies Record<string, ServicePageContent>);
