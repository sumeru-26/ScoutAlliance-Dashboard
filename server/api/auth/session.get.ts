import { createError, eventHandler, getRequestHeader, H3Event } from 'h3'
import { useNuxtApp } from 'nuxt/app'

import * as jose from 'jose'

const TOKEN_TYPE = 'Bearer'

const config = useRuntimeConfig()

const secret = new TextEncoder().encode(config.jwtSecretKey)

const extractToken = (authHeaderValue: string) => {
  const [, token] = authHeaderValue.split(`${TOKEN_TYPE} `)
  return token
}

export default defineEventHandler(async (event) => {

    const authHeaderValue = getRequestHeader(event, 'authorization')
    if (typeof authHeaderValue === 'undefined') {
        throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header to access this endpoint' })
    }

    const extractedToken = extractToken(authHeaderValue)
    //console.log(`user verifying with token: ${extractedToken}`)

    try {
      //return verify(extractedToken, config.jwtSecretKey)
      const { payload, protectedHeader } = await jose.compactVerify(extractedToken, secret)
      return new TextDecoder().decode(payload)
    } catch (error) {
      console.error('Login failed with error: ', error)
      throw createError({ statusCode: 403, statusMessage: 'You must be logged in to use this endpoint' })
    }

})