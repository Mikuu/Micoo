describe('micoocypress sandbox', () => {
    it('micoocypressing', () => {
        cy.viewport(1920, 1080);
        cy.visit("http://localhost:3000/dashboard");
        cy.screenshot("home-page");

        cy.contains("Products").click();
        cy.screenshot("products-page");
    })
})