export * from './biens'

export enum KeySort {
  RELEVANCE = 'RELEVANCE',
  SURFACEAREA = 'SURFACEAREA',
  PRICEPERSQUAREMETER = 'PRICEPERSQUAREMETER',
  PRICE = 'PRICE',
}

export enum PropertyType {
  HOUSE = 'HOUSE',
  FLAT = 'FLAT',
  PARKING = 'PARKING',
  TERRAIN = 'TERRAIN',
  LOFT = 'LOFT',
  SHOP = 'SHOP',
  BUILDING = 'BUILDING',
  CASTLE = 'CASTLE',
  PREMISES = 'PREMISES',
  OFFICE = 'OFFICE',
  TOWNHOUSE = 'TOWNHOUSE',
  OTHERS = 'OTHERS',
}

export enum FilterType {
  RENT = 'RENT',
  BUY = 'BUY',
  NEW = 'NEW',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
