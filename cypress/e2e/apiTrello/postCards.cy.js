/// <reference types="cypress" />
const eQA = require('../../support/eQA');



describe('Crear y eliminar tarjetas de un tablero', () => {
    let cardId1, cardId2, cardId3, posCard1, posCard2, posCard3,
        listaA, listaB, listaC, dataCard;

    const IDBOARD= process.env.IDBOARD;

    before(`pre-condiciones: La lista "TO DO" debe estar disponible en el tablero
          La lista "IN PROGRESS" debe estar disponible en el tablero
          La lista "DONE" debe estar disponible en el tablero
          Todas las listas estan vacias`, () => {

        cy.fixture('data').then(data => {
            dataCard = data;
        })
        cy.getBoardData(eQA.IDBOARD, eQA.LISTS)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                expect(result.body).to.have.length(3);
                result.body.forEach((data)=>{
                    expect(data).to.property('closed',false);
                    expect(data.name).to.be.oneOf(['TO DO','IN PROGRESS','DONE'])
                })
                listaA = result.body[0].id;
                listaB = result.body[1].id;
                listaC = result.body[2].id;
            })
        cy.getBoardData(eQA.IDBOARD, eQA.CARDS)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                expect(result.body).to.be.empty;
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar crear primera card en la lista "TO DO" (name: corto)', () => {
        cy.addCard(listaA, dataCard.name.corto)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cardId1 = result.body.id;
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId1);
                        expect(result1.body).to.have.property('name', dataCard.name.corto);
                        expect(result1.body).to.have.property('idBoard', eQA.IDBOARD);
                        expect(result1.body).to.have.property('idList', listaA);
                        posCard1 = result1.body.pos;
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar crear segunda card en la lista "TO DO" (name: null)', () => {

        cy.addCard(listaA, dataCard.name.vacio)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cardId2 = result.body.id;
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId2);
                        expect(result1.body).to.have.property('name', dataCard.name.vacio);
                        expect(result1.body.pos).to.be.greaterThan(posCard1);
                        expect(result1.body).to.have.property('idBoard', eQA.IDBOARD);
                        expect(result1.body).to.have.property('idList', listaA);
                        posCard2 = result1.body.pos;
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar crear tercera card en la lista "TO DO" (name: largo)', () => {

        cy.addCard(listaA, dataCard.name.largo)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cardId3 = result.body.id;

                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId3);
                        expect(result1.body).to.have.property('name', dataCard.name.largo);
                        expect(result1.body.pos).to.be.greaterThan(posCard2);
                        expect(result1.body).to.have.property('idBoard', eQA.IDBOARD);
                        expect(result1.body).to.have.property('idList', listaA);
                        posCard3 = result1.body.pos;
                    })
            })
        })

        after(() => {
            cy.deleteCard(cardId1)
              .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(cardId1)
                  .then(result1 => {
                    cy.log(result1);
                    expect(result1.status).to.eql(404);
                  })
              })
            cy.deleteCard(cardId2)
                .then(result => {
                    cy.log(result);
                    expect(result.status).to.eql(200);
                    cy.getCard(cardId2)
                        .then(result1 => {
                            cy.log(result1);
                            expect(result1.status).to.eql(404);
                        })
                })
            cy.deleteCard(cardId3)
                .then(result2 => {
                    cy.log(result2);
                    expect(result2.status).to.eql(200);
                    cy.getCard(cardId3)
                        .then(result3 => {
                            cy.log(result3);
                            expect(result3.status).to.eql(404);
                        })
                })
            })

    })

    