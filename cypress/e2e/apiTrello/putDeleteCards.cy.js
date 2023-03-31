/// <reference types="cypress" />
const eQA = require('../../support/eQA');

describe('Modificar, mover y archivar tarjetas de un tablero', () => {
    let cardId1, cardId2, cardId3, posCard1, posCard2, posCard3, listaA, listaB, listaC, idMember1, idMember2, label1, label2, dataCard;

    before(`pre-condiciones: La lista "TO DO" debe estar disponible en el tablero
          La lista "IN PROGRESS" debe estar disponible en el tablero
          La lista "DONE" debe estar disponible en el tablero
          Todas las listas estan vacias
          Hay 3 tarjetas creadas`, () => {

        cy.fixture('data').then(data => {
            dataCard = data;

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

                    cy.getBoardData(eQA.IDBOARD, eQA.CARDS)
                        .then(result => {
                            cy.log(result);
                            expect(result.status).to.eql(200);
                            expect(result.body).to.be.empty;
                        })
                    cy.getBoardData(eQA.IDBOARD, eQA.MEMBERSHIPS)
                        .then(result => {
                            cy.log(result);
                            expect(result.status).to.eql(200);
                            expect(result.body).to.have.length(3);
                            idMember1 = result.body[1].idMember;
                            idMember2 = result.body[2].idMember;
                        })
                    cy.getBoardData(eQA.IDBOARD, eQA.LABELS)
                        .then(result => {
                            cy.log(result);
                            expect(result.status).to.eql(200);
                            label1 = result.body[0].id;
                            label2 = result.body[1].id;
                        })
                    cy.addCard(listaA, dataCard.name.largo)
                        .then(result => {
                            cy.log(result);
                            expect(result.status).to.eql(200);
                            cardId1 = result.body.id;
                            posCard1 = result.body.pos;
                            cy.log(cardId1);
                        })

                    cy.addCard(listaA, dataCard.name.corto)
                        .then(result => {
                            cy.log(result);
                            expect(result.status).to.eql(200);
                            cardId2 = result.body.id;
                            posCard2 = result.body.pos;
                            cy.log(cardId2);
                        })
                    cy.addCard(listaA, dataCard.name.vacio)
                        .then(result => {
                            cy.log(result);
                            expect(result.status).to.eql(200);
                            cardId3 = result.body.id;
                            posCard3 = result.body.pos;
                            cy.log(cardId3);
                        })
                })
        })
    })

    it('US 23269 | {API} Trello | Cards | validar modificar nombre, descripcion, miembro(1) y labels(1) de la primer card en la lista "TO DO"', () => {
        cy.putCard(cardId1, dataCard.name.largoMod, dataCard.desc.corto, idMember1, label1)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId1);
                        expect(result1.body).to.have.property('name', dataCard.name.largoMod);
                        expect(result1.body).to.have.property('desc', dataCard.desc.corto);
                        expect(result.body.idMembers[0]).to.eql(idMember1);
                        expect(result1.body.idLabels[0]).to.eq(label1);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | validar modificar nombre, descripcion, miembro(2) y labels(2) de la segunda card en la lista "TO DO"', () => {
        let idMembers = [idMember1, idMember2];
        let idLabels = [label1, label2];
        cy.putCard(cardId2, dataCard.name.cortoMod, dataCard.desc.largo, idMembers, idLabels)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);

                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId2);
                        expect(result1.body).to.have.property('name', dataCard.name.cortoMod);
                        expect(result1.body).to.have.property('desc', dataCard.desc.largo);
                        expect(result1.body.idMembers[0]).to.eq(idMember1);
                        expect(result1.body.idMembers[1]).to.eq(idMember2);
                        expect(result1.body.idLabels[0]).to.eq(label1);
                        expect(result1.body.idLabels[1]).to.eq(label2);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card3 a la posicion 1 de la lista "TO DO"', () => {
        posCard3 = (posCard3 - posCard2) - 1;
        cy.putPosCard(cardId3, posCard3)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId3);
                        expect(result1.body).to.have.property('idList', listaA);
                        expect(result1.body.pos).to.be.lessThan(posCard1).and.to.be.lessThan(posCard2);
                    })

            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card1 a la posicion 3 de la lista "TO DO"', () => {
        posCard1 = (posCard1 + posCard2) + 1
        cy.putPosCard(cardId1, posCard1)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId1);
                        expect(result1.body).to.have.property('idList', listaA);
                        expect(result1.body.pos).to.be.greaterThan(posCard2).and.to.be.greaterThan(posCard3);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card2 a la lista "IN PROGRESS"', () => {
        cy.putListCard(cardId2, listaB, posCard2)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);[]
                        expect(result1.body).to.have.property('id', cardId2);
                        expect(result1.body).to.have.property('idList', listaB);
                        posCard2 = result1.body.pos;

                        cy.getList(result1.body.idList)
                            .then(result2 => {
                                cy.log(result2);
                                expect(result2.status).to.eql(200);
                                expect(result2.body).to.length(1);
                                expect(result1.body).to.have.property('id', cardId2);
                            })
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card1 a la posicion 1 de la lista "IN PROGRESS"', () => {
        posCard1 = posCard2 / 2;
        cy.putListCard(cardId1, listaB, posCard1)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId1);
                        expect(result1.body).to.have.property('idList', listaB);
                        expect(result1.body.pos).to.be.lessThan(posCard2);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card3 a la ultima posicion de la lista "IN PROGRESS"', () => {
        posCard3 = (posCard3 + posCard2) + 1;
        cy.putListCard(cardId3, listaB, posCard3)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId3);
                        expect(result1.body).to.have.property('idList', listaB);
                        expect(result1.body.pos).to.be.greaterThan(posCard2).and.to.be.greaterThan(posCard1);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card1 a la lista "DONE"', () => {
        cy.putListCard(cardId1, listaC, posCard1)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);[]
                        expect(result1.body).to.have.property('id', cardId1);
                        expect(result1.body).to.have.property('idList', listaC);
                        posCard1 = result1.body.pos;
                        cy.getList(result1.body.idList)
                            .then(result2 => {
                                cy.log(result2);
                                expect(result2.status).to.eql(200);
                                expect(result2.body).to.length(1);
                                expect(result1.body).to.have.property('id', cardId1);
                            })
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card3 en la ultima posicion de la lista "DONE"', () => {
        posCard3 = posCard1 * 2;
        cy.putListCard(cardId3, listaC, posCard3)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId3);
                        expect(result1.body).to.have.property('idList', listaC);
                        expect(result1.body.pos).to.be.greaterThan(posCard1);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar mover card2 en la posicion 2 de la lista "DONE"', () => {
        posCard2 = (posCard3 - posCard1) + 1;
        cy.putListCard(cardId2, listaC, posCard2)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId2);
                        expect(result1.body).to.have.property('idList', listaC);
                        expect(result1.body.pos).to.be.greaterThan(posCard1).and.to.be.lessThan(posCard3);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar archivar card1', () => {
        cy.closedCard(cardId1, true)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId1);
                        expect(result1.body).to.have.property('closed', true);
                    })
            })
    })

    it('US 23269 | {API} Trello | Cards | Validar desarchivar card1', () => {
        cy.closedCard(cardId1, false)
            .then(result => {
                cy.log(result);
                expect(result.status).to.eql(200);
                cy.getCard(result.body.id)
                    .then(result1 => {
                        cy.log(result1);
                        expect(result1.status).to.eql(200);
                        expect(result1.body).to.have.property('id', cardId1);
                        expect(result1.body).to.have.property('closed', false);
                    })
            })
        })

        it('US 23269 | {API} Trello | Cards | Validar eliminar card1', () => {
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
    })

    after(() => {
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