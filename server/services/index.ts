import prisma from '../utils/prisma'

export async function insertMultiEstate(estates) {
  const result = await prisma.house.createMany({
    data: estates.map((e) => {
      const { newOrOld, rentWithoutCharges, virtualTours, ...rest } = e
      return rest
    }),
    skipDuplicates: true,
  })

  return result
}

export * from './bienici'
