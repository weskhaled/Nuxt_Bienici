export const queryGetManyBiens = `
query getManyBiens($input: GetManyInput) {
  getManyBiens(input: $input) {
    total
    page
    perPage
    data {
      city
      price
      id
      yearOfConstruction
      modificationDate
      surfaceArea
      roomsQuantity
      propertyType
      postalCode
      photos {
        url
        photo
        url_photo
      }
      blurInfo {
        position {
          lat
          lon
        }
      }
    }
  }
}`

export const getManyPlaces = `
query getManyPlacesQuery($input: GetManyPlaceInput) {
  getManyPlaces(input: $input) {
    data {
      name
      id
      insee_code
      ref
      type
      zoneIds
      boundingBox
    }
  }
}`
