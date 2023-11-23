import { ofetch } from 'ofetch'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  const {
    imageURL,
    width,
    height,
  } = getQuery(event)
  if (!imageURL || Number.isNaN(width) || Number.isNaN(height)) {
    throw createError({
      statusCode: 400,
      statusText: 'image URL required',
    })
  }

  const imageResponse = await ofetch(`${imageURL}`, {
    responseType: 'arrayBuffer',
  })

  return await sharp(imageResponse)
    .resize(Number(width), Number(height))
    .jpeg()
    .toBuffer()
})
