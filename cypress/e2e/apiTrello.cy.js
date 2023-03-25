/// const { defineConfig } = require("cypress");
const environmentQA = require('../support/environmentQA');

describe('', () => {
  let cardId1, cardId2, cardId3, posCard1, posCard2, posCard3,
    listaA, listaB, listaC, idMember1, idMember2, label1, label2;

  before(`pre-condiciones: La lista "TO DO" debe estar disponible en el tablero
          La lista "IN PROGRESS" debe estar disponible en el tablero
          La lista "DONE" debe estar disponible en el tablero
          Todas las listas estan vacias
          Hay 2 miempros agregados en el tablero`, () => {
    cy.request({
      url: `${environmentQA.GETBOARD}/${environmentQA.IDBOARD}/${environmentQA.LISTS}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'GET'
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body).to.have.length(3);
      expect(result.body[0].name).to.eql('TO DO');
      expect(result.body[0].closed).to.eql(false);
      expect(result.body[1].name).to.eql('IN PROGRESS');
      expect(result.body[1].closed).to.eql(false);
      expect(result.body[2].name).to.eql('DONE');
      expect(result.body[2].closed).to.eql(false);
      listaA = result.body[0].id;
      listaB = result.body[1].id;
      listaC = result.body[2].id;
    })
    cy.request({
      url: `${environmentQA.GETBOARD}/${environmentQA.IDBOARD}/${environmentQA.CARDS}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'GET'
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body).to.be.empty;
    })
    cy.request({
      url: `${environmentQA.GETBOARD}/${environmentQA.IDBOARD}/${environmentQA.MEMBERSHIPS}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'GET'
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body).to.have.length(3);
      idMember1 = result.body[1].idMember;
      idMember2 = result.body[2].idMember;
    })
    cy.request({
      url: `${environmentQA.GETBOARD}/${environmentQA.IDBOARD}/${environmentQA.LABELS}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'GET'
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      label1 = result.body[0].id;
      label2 = result.body[1].id;
    })
  })

  it('US 23269 | {API} Trello | Cards | Crear cards de un tablero', () => {
    cy.request({
      url: `${environmentQA.POSTCARD}?idList=${listaA}&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'POST',
      body: {
        name: 'ejemplo1',
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cardId1 = result.body.id;
      posCard1 = result.body.pos;
    })
    cy.request({
      url: `${environmentQA.POSTCARD}?idList=${listaA}&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'POST',
      body: {
        name: 'ejemplo2',
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body.pos).to.be.greaterThan(posCard1);
      cardId2 = result.body.id;
      posCard2 = result.body.pos;
    })
    cy.request({
      url: `${environmentQA.POSTCARD}?idList=${listaA}&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'POST',
      body: {
        name: 'ejemplo3',
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body.pos).to.be.greaterThan(posCard2);
      cardId3 = result.body.id;
      posCard3 = result.body.pos;
    })
  })

  it('US 23269 | {API} Trello | Cards | Modificar cards de un tablero', () => {
    cy.request({
      url: `${environmentQA.PUTCARD}/${cardId1}?&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'PUT',
      body: {
        name: 'ejemploModificado1',
        desc: 'texto descripcion de card numero 1',
        idMembers: `${idMember1}`,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
    })
    cy.request({
      url: `${environmentQA.PUTCARD}/${cardId2}?&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method: 'PUT',
      body: {
        name: 'ejemploModificado2',
        desc: 'texto descripcion de card numero 2',
        idMembers: `${idMember1},${idMember2}`,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
    })
  })

})