const request = require("supertest");
const app = require("../src/server/server");
const LocalStorage = require("node-localstorage").LocalStorage;

// Mock localStorage for testing
global.localStorage = new LocalStorage("./scratch");

// Reset localStorage before each test
beforeEach(() => {
  localStorage.setItem("trips", JSON.stringify([]));
});

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /trip", () => {
  it("should return an empty list of trips", async () => {
    const res = await request(app).get("/trip");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return a list of trips", async () => {
    const trip = { geonameId: "12345", dateSubmit: "2023-07-30" };
    localStorage.setItem("trips", JSON.stringify([trip]));

    const res = await request(app).get("/trip");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([trip]);
  });
});
