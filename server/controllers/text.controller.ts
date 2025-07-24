import { Request, Response } from 'express'
import { faker } from '@faker-js/faker'

export const streamLongText = (req: Request, res: Response) => {
  const longText = faker.lorem.paragraphs(32)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')

  let i = 0

  const sendChar = () => {
    if (i < longText.length) {
      res.write(longText[i])
      i++
      setTimeout(sendChar, 10) // 10ms delay per char
    } else {
      res.end()
    }
  }

  sendChar()
}
