export const BOOKING_LINK = "https://app.squareup.com/appointments/book/L30DXARY07J67/start";

const INQUIRY_ONLY_SERVICE_IDS = new Set([
  'ppf-inquiry',
  'odor-elimination',
  'rv-boat-wash-wax',
  'rv-boat-oxidation',
  'tractor-detailing-service',
]);

export function isInquiryOnlyService(serviceId?: string) {
  return Boolean(serviceId && INQUIRY_ONLY_SERVICE_IDS.has(serviceId));
}

// Square's public booking page expects the Catalog service item ID (not the
// variation ID). These IDs come from the live Square catalog used by the site.
const SQUARE_SERVICE_IDS: Record<string, string> = {
  'maintenance-interior': 'RZH6APE5357QCFLW3RTMRS3H',
  'interior-detail': 'FLZQNBNO6RHJFI2UQWBNDRMW',
  'interior-reset': 'IFXWVDGWRSDM3X5ATE4NSMIW',
  'exterior-enhancement': '3AQQN4UPLBB6XVZLGKHKHWGA',
  'paint-enhancement-polish': 'ALQAGEI43PQED5TLUSFETSVM',
  'paint-correction-l1': '7D5QZO5H6MHMLG5QM254EA5O',
  'paint-correction-l2': 'NABSKF6Y347BABC5GZD4EPCS',
  'system-x-crystal-plus': 'QC7TIMMJ2OQ5XY4XBSYX2OXT',
  'system-x-pro-plus': 'HC6PRKJ3Y4JVL2JMYCJU5NJJ',
  'system-x-max-g-plus': '5SIWQ7ZR2DFRGVM4UEBWSCUQ',
  'system-x-phantom-2k': 'VLKNWAXVHHYEJSDTV54HF5TY',
  'full-detail-package': 'GGZSRTVTHQ3GLND7QG5AZNVO',
  'showroom-package': 'X2HO3RZJT2ZPRXMHZ5FGSDNO',
  'maintenance-detail': 'WHJCCYUAKVNSB7GRAP6KXPDZ',
  'rv-boat-wash-wax': 'NYHB4QSMOJLTBS5AAZOZO6CG',
  'rv-boat-oxidation': 'OUOTZUCASG4FGECU5F6NDWUB',
  'tractor-detailing-service': 'AEYUF46S3ZGTDJFOWVICT425',
  'new-car-detail': 'F447NZUZJCTAETAH63RZS3R7',
  'pre-sale-detail': 'GE7RCE5VUDJZNSXVDCUGM2QF',
  'odor-elimination': 'OVDD3MXV5RLQMNUWPSZXDV3V',
  'system-x-glass-plus': '2ADBJME4SZIJZFQUX7EQ3ZC4',
  'system-x-wheel-plus': 'II2HIVHN6XKQBYJ2SRQDIVU5',
  'system-x-interior-protection': 'GOZSTA34J3GRNEA3KV5F5H4G',
  'system-x-revive-trim': 'O3ZLERSORLP4ZC3WLTLA6Z5I',
};

export function getSquareBookingLink(serviceId?: string) {
  if (!serviceId) return BOOKING_LINK;

  const squareServiceId = SQUARE_SERVICE_IDS[serviceId];
  if (!squareServiceId) return BOOKING_LINK;

  const params = new URLSearchParams({
    color: '212121',
    buttonTextColor: 'ffffff',
    service_id: squareServiceId,
    locale: 'en',
    referrer: 'website',
  });

  return `${BOOKING_LINK}?${params.toString()}`;
}
