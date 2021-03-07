describe('micoocypress sandbox', () => {
    it('micoocypressing', () => {
        cy.viewport(1920, 1080);
        cy.visit("http://localhost:3000/users");
        cy.screenshot("users-page");

        cy.contains("Account").click();
        cy.screenshot("account-page");
    })
})