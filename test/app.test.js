import {
  validateInputDate,
  validateInputLocation,
} from "../src/client/js/validate";

import moment from "moment"; // Import moment at the beginning

describe("Validation Functions", () => {
  describe("validateInputDate", () => {
    it("should return false for empty input", () => {
      expect(validateInputDate("")).toBe(false);
      expect(validateInputDate(null)).toBe(false);
    });

    it("should return false for a past date", () => {
      const pastDate = moment().subtract(1, "day").format("YYYY-MM-DD");
      expect(validateInputDate(pastDate)).toBe(false);
    });

    it("should return true for a valid date within the next 16 days", () => {
      const validDate = moment().add(10, "days").format("YYYY-MM-DD");
      expect(validateInputDate(validDate)).toBe(true);
    });
  });

  describe("validateInputLocation", () => {
    it("should return false for empty input", () => {
      expect(validateInputLocation("")).toBe(false);
      expect(validateInputLocation(null)).toBe(false);
    });

    it("should return true for non-empty input", () => {
      expect(validateInputLocation("New York")).toBe(true);
    });
  });
});
