/**
 * Optional property-data lookup (brief §10.6, feature switch "propertyLookup", off). A provider
 * pre-fills wizard answers such as home size from an address. Only the interface and a stub
 * exist; README → "Property data lookup" explains how to back it with building-footprint data
 * in PostGIS later. Nothing is imported now: the data would not fit Neon's free storage.
 */
export type PropertyFacts = { floorAreaSqFt?: number; storeys?: number; footprintSqFt?: number }

export interface PropertyDataProvider {
  lookup(address: string): Promise<PropertyFacts | null>
}

/** The default: no data source, so the wizard asks its questions as usual. */
export const noPropertyData: PropertyDataProvider = { lookup: async () => null }
