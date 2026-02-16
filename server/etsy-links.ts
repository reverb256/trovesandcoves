// Mapping of product SKUs to their corresponding Etsy listing URLs
export const etsyProductLinks: Record<string, string> = {
  "TC-UPC-ENA-001": "https://www.etsy.com/ca/listing/1488794519/upcycled-gold-plated-enamel-pendant-14k",
  "TC-CIT-SET-001": "https://www.etsy.com/ca/listing/1732061815/pretty-handwrapped-citrine-pearl",
  "TC-LEP-001": "https://www.etsy.com/ca/listing/1528298478/lepidolite-14k-gold-filled-necklace-curb",
  "TC-TUR-LAP-001": "https://www.etsy.com/ca/listing/1492115039/turquoise-lapis-lazuli-pearl-strung",
  "TC-LAP-ONY-001": "https://www.etsy.com/ca/listing/1736073838/unique-lapis-lazuli-onyx-smoky-quartz",
  "TC-LAP-001": "https://www.etsy.com/ca/listing/1735708540/lapis-lazuli-wire-wrapped-necklace",
  "TC-ROS-001": "https://www.etsy.com/ca/listing/1749886683/medium-rose-quartz-pendant-wire-wrapped",
  "TC-TUR-BEAD-001": "https://www.etsy.com/ca/listing/1735661500/unique-turquoise-beaded-necklace-pearl",
  "TC-LAP-MEN-001": "https://www.etsy.com/ca/listing/1735651812/lapis-lazuli-brown-leather-masculine"
};

export function getEtsyLinkForProduct(sku: string): string | null {
  return etsyProductLinks[sku] || null;
}