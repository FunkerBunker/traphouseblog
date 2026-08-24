import { db } from "./index";
import { posts } from "./schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if posts already exist
    const existingPosts = await db.select().from(posts).limit(1);
    if (existingPosts.length > 0) {
      console.log("Database already seeded.");
      return;
    }

    console.log("Seeding cannabis blog posts...");

    const dummyPosts = [
      {
        title: "Maximize Trichomes in the Final 2 Weeks of Flower",
        slug: "maximize-trichomes-final-weeks-flower",
        excerpt: "Unlock the sticky, resinous buds of your dreams. Learn the exact light stress, temperature drops, and ice-water flush secrets to force insane resin production.",
        content: `### The Grand Finale: Trichome Production

As a cannabis grower, the final two weeks of the flowering stage are the most critical for potency, aroma, and bag appeal. This is when the trichomes—the tiny, mushroom-like resin glands containing THC, CBD, and terpenes—reach full maturity. By applying strategic environmental stressors, you can trick the female cannabis plant into boosting its defense mechanism, which is resin production.

#### 1. Temperature Drops (The Autumn Mimic)
In nature, autumn brings cooler nights. Cannabis plants react to cooler nighttime temperatures by accelerating resin production and changing color (producing beautiful purple, orange, and red hues).
* **Action:** Lower your nighttime grow room temperature to **60°F–65°F (15°C–18°C)** during the final 10–14 days. Keep daytime temperatures around **72°F–75°F (22°C–24°C)**.
* **Why it works:** The cold temperature slows down chlorophyll production and preserves delicate terpenes that would otherwise evaporate in higher heat.

#### 2. Light Spectrum Shift & The 72-Hour Dark Period
* **UV-B Exposure:** If you have access to supplementary UV-B fluorescent lights or high-end LED bars, turn them on for 2–3 hours a day. Trichomes act as natural sunblock for the plant; UV radiation signals the plant to produce more resin shield.
* **The Dark Shock:** Many veteran growers swear by giving plants **36 to 72 hours of complete darkness** right before harvest. While scientifically debated, many find it increases terpene scent concentration and terpene complexity.

#### 3. Ice-Water Root Flushing
* **Action:** Flush your medium (especially soil or coco) with clean, pH-balanced water chilled with ice cubes to around **50°F (10°C)** for the last 2 waterings.
* **Why it works:** The shock of freezing water at the roots signals to the plant that winter has arrived and its life cycle is ending, forcing it to push all remaining sugars and defense resources into the buds.

#### 4. Humidity Drop to 30%
Keep relative humidity (RH) extremely low—around **30% to 35%** in the final week.
* This prevents bud rot (Botrytis) and stimulates the plant to transpire and coat its flowers with resin to retain moisture.

Follow these steps, check your trichomes with a 60x jeweler's loupe, and harvest when you see **70% milky and 30% amber** trichomes for the ultimate euphoric, heavy-hitting high!`,
        category: "growing",
        tags: "Trichomes, Flowering, Terpenes, Harvest",
        imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80&w=1000",
        readTime: "7 min read",
        likes: 142,
        views: 890,
        isTop: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        title: "The Dutch Backflip: Master Inside-Out Rolling",
        slug: "dutch-backflip-inside-out-rolling",
        excerpt: "Tired of tasting burning paper? Master the Dutch backflip (inside-out roll). Burn less paper, taste 100% of your terpene profile, and elevate your joint game.",
        content: `### The Connoisseur's Choice: The Inside-Out Roll

In the Netherlands, serious tokers roll their joints "inside-out" or "backwards". By rolling with the paper inside-out, you tuck the glue line early and tear or burn off the excess paper flap. The result? You smoke **only one layer of paper** around your cannabis instead of 2 or 3 layers. 

#### Why Roll Inside-Out?
1. **Unrivaled Flavor:** Standard rolls burn excess paper, which tastes harsh and ash-like. Inside-out rolls allow you to taste the pure, unadulterated terpene profile of your strain.
2. **Slower, Evener Burn:** Less paper means less side-burning ("canoeing").
3. **The Fire Trick:** You can light the excess paper and let it burn itself off, leaving a perfectly sealed joint with a dramatic spark.

#### Step-by-Step Guide
1. **The Prep:** Grind your flower to a medium-coarse consistency. Prepare a cardboard filter tip (crutch) about 1.5 cm long.
2. **The Paper Flip:** Hold the rolling paper so that the **sticky glue strip is facing you and pointing downwards** on the bottom side, instead of facing up and away from you.
3. **The Fill:** Place your filter at one end and distribute your ground flower evenly. The weed should sit on top of the glue line's backside.
4. **The Roll & Tuck:** Start rolling back and forth to shape the cylinder. Now comes the tricky part: tuck the bottom edge of the paper (with the glue strip on the outside of the tuck) over the weed, and roll it forward so that the glue strip presses against the inside of the opposite paper layer.
5. **The Seal:** Through the single translucent layer of paper, lick the strip from the outside. The moisture will pass through the paper and activate the glue underneath.
6. **The Tear (or Burn):** You are now left with a perfectly rolled joint and a large paper flap sticking out. Fold the flap back and crease it firmly. 
   * *Method A (Safe):* Carefully lick along the crease and gently rip the flap off.
   * *Method B (The Showoff):* Hold the joint upright, light the bottom corner of the flap, and watch the fire travel cleanly down the seam, extinguishing right at the glue line. (Practice first!)

Spark it up and enjoy a joint that burns slower and tastes sweet like clean extract!`,
        category: "smoking",
        tags: "Rolling, Joints, Smoking, Dutch Style",
        imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=1000",
        readTime: "5 min read",
        likes: 218,
        views: 1250,
        isTop: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        title: "Terpene Decoded: The Real Reason Behind Indica & Sativa Effects",
        slug: "terpenes-decoded-real-reason-indica-sativa",
        excerpt: "It's not just about THC percentage anymore. Dive deep into how Myrcene, Limonene, and Linalool form the 'Entourage Effect' that dictates your vibe.",
        content: `### Beyond THC: The Entourage Effect

For decades, dispensary customers have asked for "the highest THC percentage" and categorized everything as either an uplifting "Sativa" or a sedating "Indica". However, modern cannabis science has disproven this binary. 

The true conductor of your high's orchestra is **the terpene profile**—the aromatic, volatile organic compounds produced in the same trichomes as cannabinoids. When combined with cannabinoids, they trigger the **Entourage Effect**, modulating how THC interacts with your brain's CB1 receptors.

---

### The Big Four Terpenes and Their Effects

#### 1. Myrcene (The Couch-Lock Terpene)
* **Aroma:** Earthy, musky, herbal, clove-like.
* **Found in:** Mangoes, lemongrass, hops, and strains like Granddaddy Purple or OG Kush.
* **The Effect:** Strongly sedative, muscle-relaxing, and anti-inflammatory. If a strain has more than **0.5% Myrcene**, it will feel like a classic "Indica", pinning you to the couch.

#### 2. Limonene (The Liquid Sunshine)
* **Aroma:** Bright citrus, lemon, orange, lime.
* **Found in:** Citrus rinds, peppermint, and strains like Super Lemon Haze or Wedding Cake.
* **The Effect:** Highly uplifting, anti-anxiety, and stress-relieving. Limonene promotes dopamine release, making it perfect for creative morning seshs.

#### 3. Caryophyllene (The Spice of Life)
* **Aroma:** Spicy, woody, cracked black pepper.
* **Found in:** Black pepper, cloves, cinnamon, and strains like Girl Scout Cookies or Sour Diesel.
* **The Effect:** This unique terpene actually binds directly to CB2 receptors, acts as a powerful anti-anxiety and pain management agent, and keeps your mind clear without heavy fog.

#### 4. Linalool (The Zen Master)
* **Aroma:** Floral, sweet, lavender, spring air.
* **Found in:** Lavender, coriander, and strains like Kosher Kush or Lavender Kush.
* **The Effect:** Deeply calming, sleep-inducing, and anticonvulsant. It combats the potential THC-induced paranoia, giving you a serene, floaty buzz.

#### How to Use This Knowledge
Next time you visit the dispensary or select a seed, ask for the lab results. Look for terpene percentages (aim for 2% to 4% total terpene content). Match the terpenes to your desired vibe, rather than chasing a 30% THC flower that lacks aroma. Your nose knows best!`,
        category: "smoking",
        tags: "Terpenes, Science, Strains, Flavor",
        imageUrl: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=1000",
        readTime: "6 min read",
        likes: 185,
        views: 1100,
        isTop: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        title: "Living Soil vs. DWC Hydroponics: The Ultimate Yield & Terpene Showdown",
        slug: "living-soil-vs-dwc-hydroponics-showdown",
        excerpt: "The battle of cultivation mediums. Does organic living soil really beat high-efficiency deep water culture? Let's analyze grow times, yields, and terpene concentration.",
        content: `### Cultivation Mediums: Battle of the Roots

Ask two master growers which medium is superior, and you will spark a passionate, hours-long debate. On one side, we have **Organic Living Soil (No-Till)**, representing the natural harmony of biology. On the other, we have **Deep Water Culture (DWC) Hydroponics**, representing absolute scientific control over nutrition.

Let's dissect both across three core pillars: **Yield, Growth Speed, and Terpene Density.**

---

### Organic Living Soil (The Connoisseur's Medium)
Living soil is a bio-active ecosystem populated with beneficial microbes, mycorrhizal fungi, earthworms, and organic amendments (like kelp, bone meal, and worm castings). 

* **The Mechanism:** Instead of feeding the plant directly, you feed the soil. The soil microbes break down organic matter into bio-available forms, and the plant chooses what nutrients to absorb when it wants.
* **Flavor & Terpenes (10/10):** Unmatched. The complex organic compounds and rich microbial activity synthesize a wider array of secondary metabolites (terpenes, flavonoids), yielding an incredibly rich, sweet-tasting, smooth-burning flower.
* **Yield & Speed (6/10):** Organic reactions take time. Growth is slightly slower than hydroponics, and yields are generally moderate to good, but rarely breaking records.

---

### Deep Water Culture Hydroponics (The Factory Medium)
In a DWC setup, the plant's roots are suspended in a highly oxygenated reservoir of water mixed with liquid mineral nutrients.

* **The Mechanism:** Liquid ions are delivered directly to root cells with zero resistance, bypassing the need for a soil web.
* **Growth Speed & Yield (10/10):** Incredible. Hydroponic plants grow **30% to 50% faster** in the vegetative state because roots don't have to search for food and have a non-stop supply of oxygen. Buds grow massive and dense.
* **Flavor & Terpenes (7/10):** Clean, but sometimes lacks the "earthy soul" or complex background notes of living soil. Overfeeding can easily lead to a harsh, metallic smoke unless an immaculate 10-day water flush is performed.

---

### The Verdict: Which is for You?
* **Go with Living Soil if:** You grow for yourself, value exquisite tastes and medical purity over mass weight, and want a low-maintenance watering routine.
* **Go with DWC Hydroponics if:** You want maximum weight in minimum time, love tracking PPM/EC and pH parameters, and have a sterile, temperature-controlled environment.`,
        category: "growing",
        tags: "Soil, Hydroponics, Organic, Nutrients",
        imageUrl: "https://images.unsplash.com/photo-1508595160601-399c1b004def?auto=format&fit=crop&q=80&w=1000",
        readTime: "8 min read",
        likes: 95,
        views: 620,
        isTop: false,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Clean Glass Science: Why Dirty Bong Water is Ruining Your Terps",
        slug: "clean-glass-science-bong-hygiene-terpene-flavor",
        excerpt: "Dirty bongs harbor mold, bacteria, and stale ash oils that destroy the flavor of premium flower. Here is how to keep your glass pristine in 5 minutes.",
        content: `### The Science of Stale Bong Water

Many smokers look at their slightly yellow bong water and think, "I'll change it tomorrow." But that dirty glass is doing more than just looking bad—it is actively ruining your lungs and robbing you of expensive terpenes.

#### 1. The Biofilm Threat (Bacteria in 24h)
Cannabis smoke introduces organic compounds into the water, creating an ideal feeding ground for airborne fungi, yeasts, and bacteria. 
* Within **24 hours**, a slippery layer called **biofilm** forms on the glass walls. This biofilm can harbor harmful pathogens like *Aspergillus* (a mold that can cause lung infections).
* Smoking through dirty water means inhaling microscopic spores and bacteria directly into your respiratory tract.

#### 2. The Great Terpene Hijack
Terpenes are highly volatile compounds. The sticky, dark-brown resin that builds up on your glass is concentrated tar and oxidized weed residue.
* As clean smoke passes through this crusty layer, the old resin absorbs the fresh terpenes, replacing them with a burnt, stale, and highly acrid ash flavor. 
* You are paying top-shelf prices for flower, but tasting a 3-month-old resin pile.

#### 3. The 5-Minute Pristine Clean Guide
Forget expensive commercial cleaners. You only need two cheap household items:
1. **91% or 99% Isopropyl Alcohol (ISO):** Alcohol acts as a solvent, instantly dissolving sticky THC resin. (70% ISO is too weak—always go for 91%+).
2. **Coarse Sea Salt (Epsom Salt):** Salt does not dissolve in high-proof alcohol, acting as a non-abrasive scrubbing agent.

**Instructions:**
* Pour out the water and rinse the bong with warm water to heat the resin.
* Add 2-3 tablespoons of coarse salt down the mouthpiece and joint.
* Pour in about 1/2 cup of Isopropyl Alcohol.
* Plug the openings (use silicone bong plugs or paper towels) and **shake vigorously for 60 seconds**. Watch the glass turn crystal clear instantly.
* Rinse thoroughly with warm water, followed by a final rinse of cold water, and fill with clean water. 

*Trap House Tip:* Add a squeeze of organic lemon juice to your fresh water. The citric acid prevents resin from sticking to the glass, making your next rinse incredibly easy!`,
        category: "smoking",
        tags: "Bongs, Glass, Hygiene, Maintenance",
        imageUrl: "https://images.unsplash.com/photo-1618355209774-05d69786a3b2?auto=format&fit=crop&q=80&w=1000",
        readTime: "4 min read",
        likes: 120,
        views: 740,
        isTop: false,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Low Stress Training (LST): Double Your Yields on a Budget",
        slug: "low-stress-training-double-yields-budget",
        excerpt: "No expensive equipment needed. Learn how strategic bending and tying creates a perfectly flat canopy, sending yields through the roof.",
        content: `### Master the Canopy: Low Stress Training (LST)

If you let a cannabis plant grow naturally, it grows like a Christmas tree—one main central bud (apical dominance) and many tiny, shaded popcorn buds on the lower branches. In indoor growing, this is highly inefficient because light intensity decreases rapidly with distance from the bulb.

**Low Stress Training (LST)** is the art of gently bending the main stem and branches to create a flat, horizontal green canopy. This ensures that every single bud site receives equal, high-intensity light.

---

### The Science Behind LST
Cannabis plants are governed by an auxin hormone called indole-3-acetic acid (IAA) concentrated in the main tip. This hormone suppresses lateral growth. By bending the main tip lower than the side branches, you break this apical dominance. The plant redistributes the auxins evenly, prompting all side branches to shoot up as new "main" colas.

---

### Step-by-Step LST Guide

#### 1. Gather Your Tools
* **Soft Garden Wire / Plant Ties:** Use soft rubber-coated garden wire. Never use thin thread, fishing line, or rubber bands, as they will slice through the stem as the plant grows.
* **Drill or Binder Clips:** If using plastic pots, drill holes around the rim. If using fabric pots, clip binder clips to the edge. These serve as anchor points.

#### 2. Timing is Everything
* Start LST during the **early vegetative stage** once your plant has developed 4 to 5 nodes. The stems are young, highly flexible, and rubbery.
* *Warning:* Do not perform LST when the plant is thirsty. Stems are turgid and snap easily. Water your plant a few hours after training, or train when the soil is slightly damp.

#### 3. Bending the Main Stem
* First, anchor the base of the main stem pulling in the opposite direction of your intended bend. This prevents the roots from ripping out of the soil.
* Gently bend the top of the plant about 90 degrees to one side, parallel to the soil.
* Secure it with your soft wire anchored to the pot rim.

#### 4. Maintaining the Circle
* As the side shoots grow upwards, bend them outward and secure them as well.
* Think of your plant as a starburst, directing branches away from the center to maximize airflow and light exposure.
* Keep adjusting the ties every 3-4 days during Veg.

Stop training once your plant enters the 2nd week of flower, and watch a forest of heavy, frosty colas arise from what would have been a single stalk!`,
        category: "growing",
        tags: "LST, Training, Yields, Vegetative",
        imageUrl: "https://images.unsplash.com/photo-1595115162256-42d45d8b85b2?auto=format&fit=crop&q=80&w=1000",
        readTime: "6 min read",
        likes: 112,
        views: 670,
        isTop: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Solventless Magic: Why Live Rosin Rules the Extracts Scene",
        slug: "solventless-magic-live-rosin-rules-extracts",
        excerpt: "No chemicals, just heat and pressure. Explore why hash enthusiasts prefer Live Rosin over standard butane hashes, and how it's made.",
        content: `### The Rise of Solventless Extracts

In the world of dabbing, **Live Rosin** is considered the absolute peak of quality and purity. Unlike traditional concentrates like shatter, crumble, or live resin—which use chemical solvents like butane, propane, or CO2 to dissolve trichome glands—Live Rosin is made using **100% mechanical separation, heat, and pressure.**

Here is why concentrate connoisseurs willingly pay a premium for solventless live rosin.

---

### Live Resin vs. Live Rosin: What's the Difference?
Though they sound almost identical, their extraction processes are worlds apart:
* **Live Resin:** Freshly frozen cannabis buds are extracted using light hydrocarbon solvents (butane/propane mixture). This liquid is then vacuum-purged for 48 hours to remove any chemical residue.
* **Live Rosin:** Freshly frozen cannabis buds are washed in an ice-water bath to isolate the fragile trichome heads mechanically, resulting in "bubble hash". This bubble hash is dried, placed in a fine micron bag, and squished between two heated plates on a hydraulic press.

---

### Why Live Rosin is King

#### 1. Zero Chemical Contaminants
Because zero chemical solvents are introduced, there is absolute certainty of zero residual toxins. It is the cleanest possible inhalation experience, perfect for medical patients and clean-living enthusiasts.

#### 2. The True Genetic Fingerprint
Solvent extractions can occasionally strip away delicate lighter terpenes or alter the terpene profile during the vacuum oven purging process. Live Rosin captures the exact aromatic spectrum of the living plant at harvest. When you dab high-grade live rosin, you taste the direct floral essence of the flower.

#### 3. Full Spectrum Experience
Live Rosin contains not just high percentages of THC, but a full suite of minor cannabinoids (CBG, CBC, THCV) and heavy sesquiterpenes. This creates a deeply rounded, long-lasting high that feels identical to a heavy flower high, but in a clean, vaporizable concentrate.

#### How to Store It
Live rosin is highly volatile. At room temperature, its terpenes will rapidly degrade and evaporate, causing the concentrate to dry out ("budder up") and lose its aroma. Keep your rosin jar tightly sealed and stored in a **refrigerator (35°F–40°F)**. Take it out 10 minutes before dabbing to let it reach room temp before opening to prevent condensation!`,
        category: "extracts",
        tags: "Rosin, Solventless, Hash, Dabs",
        imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=1000",
        readTime: "6 min read",
        likes: 165,
        views: 940,
        isTop: false,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      }
    ];

    for (const post of dummyPosts) {
      await db.insert(posts).values(post);
    }

    console.log("Seeding complete. Inserted " + dummyPosts.length + " posts.");
  } catch (err) {
    console.error("Error during seeding database: ", err);
  }
}
