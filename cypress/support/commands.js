const eQA = require('./eQA');

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
    url: `/${eQA.BOARDS}/${idBoard}/${point}`,
    method: 'GET',
    qs: {
      key: eQA.KEY,
      token: eQA.TOKEN,
    }
  })
})

Cypress.Commands.add('addCard', (idList, name) => {
    cy.request({
        url: `/${eQA.CARDS}`,
        method: 'POST',
        body: {
            key: eQA.KEY,
            token: eQA.TOKEN,
            idList: idList,
            name: name,
        },
    })
})

Cypress.Commands.add('getCard', (idCard) => {
    cy.request({
        method: 'GET',
        url: `/${eQA.CARDS}/${idCard}`,
        failOnStatusCode: false,
        qs: {
            key: eQA.KEY,
            token: eQA.TOKEN,
        },
    })
})

Cypress.Commands.add('putCard', (idCard, name, desc, idMembers, idLabels) => {
    cy.request({
        url: `/${eQA.CARDS}/${idCard}`,
        method: 'PUT',
        body: {
            key: eQA.KEY,
            token: eQA.TOKEN,
            name: name,
            desc: desc,
            idMembers: idMembers.toString(),
            idLabels: idLabels.toString(),
        },
    })
})

Cypress.Commands.add('putPosCard', (idCard, pos) => {
    cy.request({
        url: `/${eQA.CARDS}/${idCard}`,
        method: 'PUT',
        body: {
            key: eQA.KEY,
            token: eQA.TOKEN,
            pos: pos,
        }
    })
})

Cypress.Commands.add('putListCard', (idCard, idList, pos) => {
    cy.request({
        url: `/${eQA.CARDS}/${idCard}`,
        method: 'PUT',
        body: {
            key: eQA.KEY,
            token: eQA.TOKEN,
            idList: idList,
            pos: pos,
        }
    })
})

Cypress.Commands.add('getList', (idList) => {
    cy.request({
        method: 'GET',
        url: `/${eQA.LISTS}/${idList}/${eQA.CARDS}`,
        qs: {
            key: eQA.KEY,
            token: eQA.TOKEN,
        },
    })
})

Cypress.Commands.add('closedCard', (idCard, boolean) => {
    cy.request({
        url: `/${eQA.CARDS}/${idCard}`,
        method: 'PUT',
        body: {
            key: eQA.KEY,
            token: eQA.TOKEN,
            closed: boolean,
        },
    })
})

Cypress.Commands.add('deleteCard', (idCard) => {
    cy.request({
        url: `/${eQA.CARDS}/${idCard}`,
        method: 'DELETE',
        body: {
            key: eQA.KEY,
            token: eQA.TOKEN,
        },
    })
})