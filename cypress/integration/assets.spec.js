/// <reference types="cypress"  />

const username = 'marisil.tere@gmail.com'
const password = 'Yellow15@'

context('Test Cases - Assets', () => {

    beforeEach(() => {
        cy.visit('')
        cy.get('#user_email2').type(username)
        cy.get('#user_password2').type(password)
        cy.get('.uk-button').click()

        cy.intercept('POST', '/v1/users/login')
            .as('postLogin');
    });

    it('Create public asset', () => {
        cy.get('[href="#!/me/spaces/159770/dashboard"]').click()
        cy.get('[href="#!/me/spaces/159770/assets"]').click()
        cy.get('input[class="upload-select"]').attachFile('public-image.jpg')

        cy.intercept('POST', '**/assets/')
            .as("addFile")
        cy.intercept('GET', '**/finish_upload')
            .as("finishUpload")

        cy.get('.modal__footer > .uk-button-primary').click()
        cy.wait('@addFile').then((interception) => {
            cy.wrap(interception.response.statusCode).should('eq', 200);
        })
        cy.wait('@finishUpload').then((interception) => {
            cy.wrap(interception.response.statusCode).should('eq', 200);
        })
    });

    it.only('Create private asset', () => {
        cy.get('[href="#!/me/spaces/159770/dashboard"]').click()
        cy.get('[href="#!/me/spaces/159770/assets"]').click()
        cy.get('input[class="upload-select"]').attachFile('priv.jpg')
        cy.get('.modal__body > .link').click()
        cy.get('.modal__body > :nth-child(4) > :nth-child(1) > .uk-width-1-1').type('Private File')
        cy.get(':nth-child(5) > :nth-child(3) > input').click()

        cy.intercept('POST', '**/assets/')
        .as("addFile")
        cy.intercept('GET', '**/finish_upload')
        .as("finishUpload")

        cy.get('.modal__footer > .uk-button-primary').click()
        cy.wait('@addFile').then((interception) => {
            cy.wrap(interception.response.statusCode).should('eq', 200);
        })
        cy.wait('@finishUpload').then((interception) => {
            cy.wrap(interception.response.statusCode).should('eq', 200);
        })
        cy.get('input[class="uk-margin-small-right"]').click()
        cy.wait(1000)
        cy.screenshot('private-file')

    });
});