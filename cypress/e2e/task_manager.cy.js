describe("Task Manager E2E", () => {
  beforeEach(() => {
    cy.request({
      method: "DELETE",
      url: "http://localhost:5001/tasks/clear",
      failOnStatusCode: false,
    });
  });

  it("Показывает пустой список задач", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-testid='task-item']").should("have.length", 0);
  });

  it("Можно добавить новую задачу", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-testid='task-input']").type("Купить хлеб");
    cy.get("[data-testid='task-add-button']").click();
    cy.get("[data-testid='task-item']").should("have.length", 1);
    cy.get("[data-testid='task-item']").contains("Купить хлеб");
  });

  it("Задачу можно отметить выполненной", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-testid='task-input']").type("Купить хлеб");
    cy.get("[data-testid='task-add-button']").click();
    cy.get("[data-testid='task-item']").contains("Купить хлеб").click();
    cy.get("[data-testid='task-item']")
      .contains("Купить хлеб")
      .parent()
      .should("have.class", "completed");
  });
});