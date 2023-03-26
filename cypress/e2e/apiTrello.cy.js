/// const { defineConfig } = require("cypress");
const environmentQA = require('../support/environmentQA');

describe('Crear, modificar, mover y eliminar tarjetas de un tablero', () => {
  let cardId1, cardId2, cardId3, posCard1, posCard2, posCard3,
    listaA, listaB, listaC, idMember1, idMember2, label1, label2,dataCard;

  before(`pre-condiciones: La lista "TO DO" debe estar disponible en el tablero
          La lista "IN PROGRESS" debe estar disponible en el tablero
          La lista "DONE" debe estar disponible en el tablero
          Todas las listas estan vacias
          Hay 2 miempros agregados en el tablero`, () => {

    cy.fixture('data').then(data=>{
      dataCard=data;
    })
    cy.request({
      url: `${environmentQA.PBOARD}/${environmentQA.IDBOARD}/${environmentQA.LISTS}`,
      method: 'GET',
      qs: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body).to.have.length(3);
      expect(result.body[0]).to.have.property('name', 'TO DO');
      expect(result.body[0]).to.have.property('closed', false);
      expect(result.body[1]).to.have.property('name', 'IN PROGRESS');
      expect(result.body[1]).to.have.property('closed', false);
      expect(result.body[2]).to.have.property('name', 'DONE');
      expect(result.body[2]).to.have.property('closed', false);
      listaA = result.body[0].id;
      listaB = result.body[1].id;
      listaC = result.body[2].id;
    })
    cy.request({
      url: `${environmentQA.PBOARD}/${environmentQA.IDBOARD}/${environmentQA.CARDS}`,
      method: 'GET',
      qs: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body).to.be.empty;
    })
    cy.request({
      url: `${environmentQA.PBOARD}/${environmentQA.IDBOARD}/${environmentQA.MEMBERSHIPS}`,
      method: 'GET',
      qs: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.body).to.have.length(3);
      idMember1 = result.body[1].idMember;
      idMember2 = result.body[2].idMember;
    })
    cy.request({
      url: `${environmentQA.PBOARD}/${environmentQA.IDBOARD}/${environmentQA.LABELS}`,
      method: 'GET',
      qs: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      label1 = result.body[0].id;
      label2 = result.body[1].id;
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar crear primera card en la lista "TO DO" (name: corto)', () => {
    cy.request({
      url: `${environmentQA.PCARDS}`,
      method: 'POST',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaA}`,
        name: dataCard.name.corto,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cardId1 = result.body.id;
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId1}`);
        expect(result1.body).to.have.property('name', dataCard.name.corto);
        expect(result1.body).to.have.property('idBoard', `${environmentQA.IDBOARD}`);
        expect(result1.body).to.have.property('idList', `${listaA}`);
        posCard1 = result1.body.pos;
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar crear segunda card en la lista "TO DO" (name: null)', () => {
    cy.request({
      url: `${environmentQA.PCARDS}`,
      method: 'POST',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaA}`,
        name: dataCard.name.vacio,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cardId2 = result.body.id;
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId2}`);
        expect(result1.body).to.have.property('name', dataCard.name.vacio);
        expect(result1.body.pos).to.be.greaterThan(posCard1);
        expect(result1.body).to.have.property('idBoard', `${environmentQA.IDBOARD}`);
        expect(result1.body).to.have.property('idList', `${listaA}`);
        posCard2 = result1.body.pos;
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar crear tercera card en la lista "TO DO" (name: largo)', () => {
    cy.request({
      url: `${environmentQA.PCARDS}?idList=${listaA}`,
      method: 'POST',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaA}`,
        name: dataCard.name.largo,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cardId3 = result.body.id;
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId3}`);
        expect(result1.body).to.have.property('name', dataCard.name.largo);
        expect(result1.body.pos).to.be.greaterThan(posCard2);
        expect(result1.body).to.have.property('idBoard', `${environmentQA.IDBOARD}`);
        expect(result1.body).to.have.property('idList', `${listaA}`);
        posCard3 = result1.body.pos;
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | validar modificar nombre, descripcion, miembro(1) y labels(1) de la primer card en la lista "TO DO"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId1}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        name: dataCard.name.largoMod,
        desc: dataCard.desc.corto,
        idMembers: `${idMember1}`,
        idLabels: `${label1}`,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId1}`);
        expect(result1.body).to.have.property('name', dataCard.name.largoMod);
        expect(result1.body).to.have.property('desc', dataCard.desc.corto);
        expect(result1.body.idMembers[0]).to.eq(idMember1);
        expect(result1.body.idLabels[0]).to.eq(label1);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | validar modificar nombre, descripcion, miembro(2) y labels(2) de la segunda card en la lista "TO DO"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId2}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        name: dataCard.name.cortoMod,
        desc: dataCard.desc.largo,
        idMembers: `${idMember1},${idMember2}`,
        idLabels: `${label1},${label2}`,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId2}`);
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
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId3}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        pos: `${posCard3 = (posCard3 - posCard2) - 1}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId3}`);
        expect(result1.body).to.have.property('idList', `${listaA}`);
        expect(result1.body.pos).to.be.lessThan(posCard1).and.to.be.lessThan(posCard2);
      })

    })
  })

  it('US 23269 | {API} Trello | Cards | Validar mover card1 a la posicion 3 de la lista "TO DO"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId1}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        pos: `${posCard1 = (posCard1 + posCard2) + 1}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId1}`);
        expect(result1.body).to.have.property('idList', `${listaA}`);
        expect(result1.body.pos).to.be.greaterThan(posCard2).and.to.be.greaterThan(posCard3);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar mover card2 a la lista "IN PROGRESS"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId2}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaB}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);[]
        expect(result1.body).to.have.property('id', `${cardId2}`);
        expect(result1.body).to.have.property('idList', `${listaB}`);
        posCard2 = result1.body.pos;
        cy.request({
          method: 'GET',
          url: `${environmentQA.PLISTS}/${result1.body.idList}/${environmentQA.CARDS}`,
          qs: {
            key: `${environmentQA.KEY}`,
            token: `${environmentQA.TOKEN}`,
          },
        }).then(result2 => {
          cy.log(result2);
          expect(result2.status).to.eql(200);
          expect(result2.body).to.length(1);
          expect(result1.body).to.have.property('id', `${cardId2}`);
        })
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar mover card1 a la posicion 1 de la lista "IN PROGRESS"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId1}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaB}`,
        pos: `${posCard1 = posCard2 / 2}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId1}`);
        expect(result1.body).to.have.property('idList', `${listaB}`);
        expect(result1.body.pos).to.be.lessThan(posCard2);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar mover card3 a la ultima posicion de la lista "IN PROGRESS"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId3}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaB}`,
        pos: `${posCard3 = (posCard3 + posCard2) + 1}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId3}`);
        expect(result1.body).to.have.property('idList', `${listaB}`);
        expect(result1.body.pos).to.be.greaterThan(posCard2).and.to.be.greaterThan(posCard1);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar mover card1 a la lista "DONE"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId1}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaC}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);[]
        expect(result1.body).to.have.property('id', `${cardId1}`);
        expect(result1.body).to.have.property('idList', `${listaC}`);
        posCard1 = result1.body.pos;
        cy.request({
          method: 'GET',
          url: `${environmentQA.PLISTS}/${result1.body.idList}/${environmentQA.CARDS}`,
          qs: {
            key: `${environmentQA.KEY}`,
            token: `${environmentQA.TOKEN}`,
          },
        }).then(result2 => {
          cy.log(result2);
          expect(result2.status).to.eql(200);
          expect(result2.body).to.length(1);
          expect(result1.body).to.have.property('id', `${cardId1}`);
        })
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar mover card3 en la ultima posicion de la lista "DONE"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId3}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaC}`,
        pos: `${posCard3 = posCard1 * 2}`,
      }
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId3}`);
        expect(result1.body).to.have.property('idList', `${listaC}`);
        expect(result1.body.pos).to.be.greaterThan(posCard1);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar mover card2 en la posicion 2 de la lista "DONE"', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId2}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        idList: `${listaC}`,
        pos: `${(posCard2 = posCard3 - posCard1) + 1}`,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId2}`);
        expect(result1.body).to.have.property('idList', `${listaC}`);
        expect(result1.body.pos).to.be.greaterThan(posCard1).and.to.be.lessThan(posCard3);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar archivar card1', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId1}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        closed: true,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId1}`);
        expect(result1.body).to.have.property('closed', true);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar desarchivar card1', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId1}`,
      method: 'PUT',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
        closed: false,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        method: 'GET',
        url: `${environmentQA.PCARDS}/${result.body.id}`,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        },
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(200);
        expect(result1.body).to.have.property('id', `${cardId1}`);
        expect(result1.body).to.have.property('closed', false);
      })
    })
  })

  it('US 23269 | {API} Trello | Cards | Validar eliminar card1', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId1}?`,
      method: 'DELETE',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        url: `${environmentQA.PCARDS}/${environmentQA.CARDS}/${result.body.id}`,
        method: 'GET',
        failOnStatusCode: false,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        }
      }).then(result2 => {
        cy.log(result2);
        expect(result2.status).to.eql(404);
      })
    })
  })

  after('Eliminar cards', () => {
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId2}`,
      method: 'DELETE',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
      },
    }).then(result => {
      cy.log(result);
      expect(result.status).to.eql(200);
      cy.request({
        url: `${environmentQA.PCARDS}/${environmentQA.CARDS}/${result.body.id}`,
        method: 'GET',
        failOnStatusCode: false,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        }
      }).then(result1 => {
        cy.log(result1);
        expect(result1.status).to.eql(404);
      })
    })
    cy.request({
      url: `${environmentQA.PCARDS}/${cardId3}`,
      method: 'DELETE',
      body: {
        key: `${environmentQA.KEY}`,
        token: `${environmentQA.TOKEN}`,
      },
    }).then(result2 => {
      cy.log(result2);
      expect(result2.status).to.eql(200);
      cy.request({
        url: `${environmentQA.PCARDS}/${environmentQA.CARDS}/${result2.body.id}`,
        method: 'GET',
        failOnStatusCode: false,
        qs: {
          key: `${environmentQA.KEY}`,
          token: `${environmentQA.TOKEN}`,
        }
      }).then(result3 => {
        cy.log(result3);
        expect(result3.status).to.eql(404);
      })
    })
  })
})
