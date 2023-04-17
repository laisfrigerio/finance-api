const express = require('express')

const { createAccount } = require('./domain/create-an-account')
const { findAccount } = require('./domain/find-an-account')
const { updateAccount } = require('./domain/update-an-account')

const app = express()

app.use(express.json())

let accounts = []

/*
 * Middleware to check customer/account exists
 */
const existsAccount = (request, response, next) => {
  try {
      const { cpf } = request.params
      const account = findAccount(accounts, cpf)

      request.account = account

      next()
  } catch (error) {
      return response
              .status(404)
              .json({ message: 'Account not found ;(' })
  }
}

app.get('/', (request, response) => {
    return response.json({ message: 'Hello World' })
})

app.post('/reset', (_, response) => {
  accounts = []
  return response.json({ message: 'Local database reset' })
})

app.post('/accounts', (request, response) => {
  try {
    const payload = request.body

    const account = createAccount(accounts, payload)

    accounts.push(account)

    return response
            .status(201)
            .json({ 
                message: 'Account registered!',
                account
            })

  } catch (error) {
    return response
            .status(400)
            .json({ message: error.message })
  }
})

app.put('/accounts/:cpf', existsAccount, (request, response) => {
  const { account } = request
  const payload = request.body

  updateAccount(account, payload)

  return response
            .status(200)
            .json({ 
                message: 'Account updated!',
                account
            })
})

app.get('/accounts/:cpf', existsAccount, (request, response) => {
  const { account } = request

  return response
            .status(200)
            .json({ account })
})

module.exports = app
