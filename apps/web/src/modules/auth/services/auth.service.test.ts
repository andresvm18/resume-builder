import {
  getAuthToken,
  getAuthUser,
  logoutUser,
  saveAuthSession,
} from "./auth.service";

describe("auth.service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves auth session in localStorage", () => {
    saveAuthSession({
      token: "test-token",
      user: {
        id: "1",
        name: "Juan Pérez",
        email: "correo@test.com",
      },
    });

    expect(getAuthToken()).toBe("test-token");
    expect(getAuthUser()).toEqual({
      id: "1",
      name: "Juan Pérez",
      email: "correo@test.com",
    });
  });

  it("returns null when stored user is invalid JSON", () => {
    localStorage.setItem("auth_user", "{invalid-json");

    expect(getAuthUser()).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });

  it("clears auth session on logout", () => {
    localStorage.setItem("auth_token", "test-token");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: "1",
        name: "Test User",
        email: "test@test.com",
      })
    );

    logoutUser();

    expect(getAuthToken()).toBeNull();
    expect(getAuthUser()).toBeNull();
  });
});