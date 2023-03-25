/// const { defineConfig } = require("cypress");
const environmentQA= require('../support/environmentQA');

describe('', () => {

  before(`pre-condiciones: La lista "TO DO" debe estar disponible en el tablero
          La lista "IN PROGRESS" debe estar disponible en el tablero
          La lista "DONE" debe estar disponible en el tablero
          Todas las listas estan vacias
          Hay 2 miempros agregados en el tablero`,()=>{

    cy.request({
      url: `${environmentQA.GET}/${environmentQA.LISTA}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'GET'
    }).then(result=>{
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body.name).to.eql('TO DO');
      expect(result.body.idBoard).to.eql(`${environmentQA.BOARD}`);
      expect(result.body.closed).to.eql(false);
    })
    cy.request({
      url: `${environmentQA.GET}/${environmentQA.LISTB}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'GET'
    }).then(result2=>{
      cy.log(result2);
      expect(result2.status).to.eql(200);
      expect(result2.body.name).to.eql('IN PROGRESS');
      expect(result2.body.idBoard).to.eql(`${environmentQA.BOARD}`);
      expect(result2.body.closed).to.eql(false);
    })

    cy.request({
      url: `${environmentQA.GET}/${environmentQA.LISTC}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'GET'
    }).then(result3=>{
      cy.log(result3);
      expect(result3.status).to.eql(200);
      expect(result3.body.name).to.eql('DONE');
      expect(result3.body.idBoard).to.eql(`${environmentQA.BOARD}`);
      expect(result3.body.closed).to.eql(false);
    })

    cy.request({
      url: `${environmentQA.GETBOARD}/${environmentQA.BOARD}/${environmentQA.CARDS}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'GET'
    }).then(result4=>{
      cy.log(result4);
      expect(result4.status).to.eql(200);
      expect(result4.body).to.be.empty;
    })

    cy.request({
      url: `${environmentQA.GETBOARD}/${environmentQA.BOARD}/${environmentQA.MEMBERSHIPS}?key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'GET'
    }).then(result5=>{
      cy.log(result5);
      expect(result5.status).to.eql(200);
      expect(result5.body).to.have.length(3);
    })
  })

  it('US 23269 | {API} Trello | Cards | Crear cards de un tablero', () => {
   
  })
})