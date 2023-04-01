// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getBoardData', (idBoard,point) => {
cy.request({
    url: `/${Cypress.env('boards')}/${idBoard}/${point}`,
    method: 'GET',
    qs: {
      key: Cypress.env('key'),
      token: Cypress.env('token'),
    }
  })
})

Cypress.Commands.add('addCard', (idList, name) => {
    cy.request({
        url: `/${Cypress.env('cards')}`,
        method: 'POST',
        body: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
            idList: idList,
            name: name,
        },
    })
})

Cypress.Commands.add('getCard', (idCard) => {
    cy.request({
        method: 'GET',
        url: `/${Cypress.env('cards')}/${idCard}`,
        failOnStatusCode: false,
        qs: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
        },
    })
})

Cypress.Commands.add('putCard', (idCard, name, desc, idMembers, idLabels) => {
    cy.request({
        url: `/${Cypress.env('cards')}/${idCard}`,
        method: 'PUT',
        body: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
            name: name,
            desc: desc,
            idMembers: idMembers.toString(),
            idLabels: idLabels.toString(),
        },
    })
})

Cypress.Commands.add('putPosCard', (idCard, pos) => {
    cy.request({
        url: `/${Cypress.env('cards')}/${idCard}`,
        method: 'PUT',
        body: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
            pos: pos,
        }
    })
})

Cypress.Commands.add('putListCard', (idCard, idList, pos) => {
    cy.request({
        url: `/${Cypress.env('cards')}/${idCard}`,
        method: 'PUT',
        body: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
            idList: idList,
            pos: pos,
        }
    })
})

Cypress.Commands.add('getList', (idList) => {
    cy.request({
        method: 'GET',
        url: `/${Cypress.env('lists')}/${idList}/${Cypress.env('cards')}`,
        qs: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
        },
    })
})

Cypress.Commands.add('closedCard', (idCard, boolean) => {
    cy.request({
        url: `/${Cypress.env('cards')}/${idCard}`,
        method: 'PUT',
        body: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
            closed: boolean,
        },
    })
})

Cypress.Commands.add('deleteCard', (idCard) => {
    cy.request({
        url: `/${Cypress.env('cards')}/${idCard}`,
        method: 'DELETE',
        body: {
            key: Cypress.env('key'),
            token: Cypress.env('token'),
        },
    })
})