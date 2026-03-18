import { describe, expect, it } from "vitest";

/**
 * Tests for the project data model used across the portfolio.
 * These are pure data tests (no DOM/React) that validate the project
 * data structure, lookup functions, and data integrity.
 */

// We import from the client data module. Since these are pure TS exports
// with no React/browser dependencies, they work fine in vitest.
// Use a dynamic import path relative to the project root.
import { projects, getProjectById, getAnimatedProjects } from "../client/src/data/projects";
import { frameUrlsByProject, getFrameUrls } from "../client/src/data/frameUrlsIndex";

describe("projects data model", () => {
  it("exports a non-empty array of projects", () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every project has required fields", () => {
    for (const p of projects) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.subtitle).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.longDescription).toBeTruthy();
      expect(Array.isArray(p.tags)).toBe(true);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(Array.isArray(p.stats)).toBe(true);
      expect(p.stats.length).toBe(3);
      expect(Array.isArray(p.labels)).toBe(true);
      expect(p.labels.length).toBeGreaterThan(0);
      expect(typeof p.hasAnimation).toBe("boolean");
      expect(p.accentColor).toBeTruthy();
    }
  });

  it("all project IDs are unique", () => {
    const ids = projects.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("contains the expected 7 engineering projects", () => {
    const ids = projects.map((p) => p.id);
    expect(ids).toContain("emg");
    expect(ids).toContain("bon");
    expect(ids).toContain("cyl");
    expect(ids).toContain("mod");
    expect(ids).toContain("func");
    expect(ids).toContain("abaqus");
    expect(ids).toContain("fpc");
  });

  it("every label has name, desc, threshold, and side", () => {
    for (const p of projects) {
      for (const label of p.labels) {
        expect(label.name).toBeTruthy();
        expect(label.desc).toBeTruthy();
        expect(typeof label.threshold).toBe("number");
        expect(label.threshold).toBeGreaterThan(0);
        expect(label.threshold).toBeLessThanOrEqual(100);
        expect(["left", "right"]).toContain(label.side);
      }
    }
  });

  it("every stat has label and value", () => {
    for (const p of projects) {
      for (const stat of p.stats) {
        expect(stat.label).toBeTruthy();
        expect(stat.value).toBeTruthy();
      }
    }
  });
});

describe("getProjectById", () => {
  it("returns the correct project for a valid ID", () => {
    const emg = getProjectById("emg");
    expect(emg).toBeDefined();
    expect(emg!.title).toBe("EMG Wristband");
    expect(emg!.category).toBe("Wearable Electronics");
  });

  it("returns undefined for an invalid ID", () => {
    const result = getProjectById("nonexistent");
    expect(result).toBeUndefined();
  });

  it("returns the correct project for each known ID", () => {
    const knownIds = ["emg", "bon", "cyl", "mod", "func", "abaqus", "fpc"];
    for (const id of knownIds) {
      const project = getProjectById(id);
      expect(project).toBeDefined();
      expect(project!.id).toBe(id);
    }
  });
});

describe("getAnimatedProjects", () => {
  it("returns only projects with hasAnimation=true", () => {
    const animated = getAnimatedProjects();
    expect(animated.length).toBeGreaterThan(0);
    for (const p of animated) {
      expect(p.hasAnimation).toBe(true);
    }
  });

  it("currently all 9 animated projects have animations", () => {
    const animated = getAnimatedProjects();
    expect(animated.length).toBe(9);
  });
});

describe("EMG project has disclaimer", () => {
  it("EMG wristband includes IP disclaimer text", () => {
    const emg = getProjectById("emg");
    expect(emg).toBeDefined();
    expect(emg!.disclaimer).toBeTruthy();
    expect(emg!.disclaimer).toContain("intellectual property");
  });

  it("work-related projects have IP disclaimers where applicable", () => {
    const projectsWithDisclaimers = ["emg", "fpc", "bon", "cyl", "mod", "func"];
    for (const id of projectsWithDisclaimers) {
      const p = getProjectById(id);
      expect(p).toBeDefined();
      expect(p!.disclaimer).toBeTruthy();
    }
  });
});

describe("frameUrlsIndex", () => {
  it("has frame URLs for all 7 engineering projects plus octolapse and cpress", () => {
    const expectedIds = ["emg", "bon", "cyl", "mod", "func", "abaqus", "fpc", "octolapse", "cpress"];
    for (const id of expectedIds) {
      expect(frameUrlsByProject[id]).toBeDefined();
      expect(frameUrlsByProject[id].length).toBeGreaterThan(0);
    }
  });

  it("each project has exactly 192 frames", () => {
    for (const [id, urls] of Object.entries(frameUrlsByProject)) {
      expect(urls.length).toBe(192);
    }
  });

  it("all frame URLs are valid CDN URLs", () => {
    for (const [id, urls] of Object.entries(frameUrlsByProject)) {
      for (const url of urls) {
        expect(url).toMatch(/^https:\/\//);
        expect(url).toMatch(/cloudfront\.net|manuscdn\.com/);
      }
    }
  });

  it("getFrameUrls returns correct arrays for known IDs", () => {
    expect(getFrameUrls("emg").length).toBe(192);
    expect(getFrameUrls("fpc").length).toBe(192);
    expect(getFrameUrls("octolapse").length).toBe(192);
  });

  it("getFrameUrls returns empty array for unknown ID", () => {
    expect(getFrameUrls("unknown")).toEqual([]);
  });
});
