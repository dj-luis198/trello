/// const { defineConfig } = require("cypress");
const environmentQA= require('../support/environmentQA');

describe('', () => {
  let cardId1, cardId2,cardId3,posCard1,posCard2,posCard3;

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
    cy.request({
      url: `${environmentQA.POSTCARD}?idList=${environmentQA.LISTA}&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'POST',
      body:{
        name:'ejemplo1',
      }, 
    }).then(result1=>{
      cy.log(result1);
      expect(result1.status).to.eql(200);
      cardId1= result1.body.id;
      posCard1=result1.body.pos; 
    })
    cy.request({
      url: `${environmentQA.POSTCARD}?idList=${environmentQA.LISTA}&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'POST',
      body:{
        name:'ejemplo2',
      }, 
    }).then(result2=>{
      cy.log(result2);
      expect(result2.status).to.eql(200);
      expect(result2.body.pos).to.be.greaterThan(posCard1);
      cardId2= result2.body.id;
      posCard2=result2.body.pos; 
    })
    cy.request({
      url: `${environmentQA.POSTCARD}?idList=${environmentQA.LISTA}&key=${environmentQA.KEY}&token=${environmentQA.TOKEN}`,
      method:'POST',
      body:{
        name:'ejemplo3',
      }, 
    }).then(result3=>{
      cy.log(result3);
      expect(result3.status).to.eql(200);
      expect(result3.body.pos).to.be.greaterThan(posCard2);
      cardId3= result3.body.id;
      posCard3= result3.body.pos; 
    })
  })

  it('',()=>{

  })
  
})