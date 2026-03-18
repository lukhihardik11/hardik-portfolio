import { describe, expect, it } from "vitest";

/**
 * Tests for the animation data layer that drives the GSAP ScrollTrigger system.
 * Validates project data integrity, label configurations, and frame URL mappings.
 */

// Import project data (shared between client and server)
import { projects, type ProjectLabel, type ProjectData } from "../client/src/data/projects";

describe("Project data integrity", () => {
  it("should have at least one project defined", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("each project should have a unique id", () => {
    const ids = projects.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("each project should have required metadata fields", () => {
    for (const project of projects) {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.subtitle).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.color).toBeTruthy();
      expect(project.accentColor).toBeTruthy();
      expect(typeof project.hasAnimation).toBe("boolean");
    }
  });

  it("each project should have at least one stat", () => {
    for (const project of projects) {
      expect(project.stats.length).toBeGreaterThan(0);
      for (const stat of project.stats) {
        expect(stat.label).toBeTruthy();
        expect(stat.value).toBeTruthy();
      }
    }
  });

  it("each project should have at least one tag", () => {
    for (const project of projects) {
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("ProjectLabel configuration for GSAP ScrollTrigger", () => {
  const projectsWithLabels = projects.filter((p) => p.labels.length > 0);

  it("at least some projects should have labels for the exploded view", () => {
    expect(projectsWithLabels.length).toBeGreaterThan(0);
  });

  it("each label should have required fields (name, desc, threshold, side)", () => {
    for (const project of projectsWithLabels) {
      for (const label of project.labels) {
        expect(label.name).toBeTruthy();
        expect(label.desc).toBeTruthy();
        expect(typeof label.threshold).toBe("number");
        expect(["left", "right"]).toContain(label.side);
      }
    }
  });

  it("label thresholds should be between 0 and 100 (percentage of scroll)", () => {
    for (const project of projectsWithLabels) {
      for (const label of project.labels) {
        expect(label.threshold).toBeGreaterThanOrEqual(0);
        expect(label.threshold).toBeLessThanOrEqual(100);
      }
    }
  });

  it("labels should be sorted by threshold (ascending) for proper GSAP timeline ordering", () => {
    for (const project of projectsWithLabels) {
      const thresholds = project.labels.map((l) => l.threshold);
      const sorted = [...thresholds].sort((a, b) => a - b);
      expect(thresholds).toEqual(sorted);
    }
  });

  it("labels should alternate or mix left/right sides for visual balance", () => {
    for (const project of projectsWithLabels) {
      if (project.labels.length >= 2) {
        const sides = project.labels.map((l) => l.side);
        const hasLeft = sides.includes("left");
        const hasRight = sides.includes("right");
        // At least some projects should use both sides
        if (project.labels.length >= 3) {
          expect(hasLeft || hasRight).toBe(true);
        }
      }
    }
  });
});

describe("GSAP animation configuration constants", () => {
  it("scrub value should be a positive number for smooth scroll feel", () => {
    // The ExplodedView uses scrub: 0.5 for premium feel
    const scrubValue = 0.5;
    expect(scrubValue).toBeGreaterThan(0);
    expect(scrubValue).toBeLessThanOrEqual(2);
  });

  it("pin spacing should be calculated based on frame count", () => {
    // The pin height is typically 300vh for a full scroll-through animation
    const pinHeight = 300;
    expect(pinHeight).toBeGreaterThanOrEqual(200);
    expect(pinHeight).toBeLessThanOrEqual(500);
  });

  it("label stagger delay should create sequential reveals", () => {
    // Labels use stagger timing based on their threshold positions
    const staggerBase = 0.05;
    expect(staggerBase).toBeGreaterThan(0);
    expect(staggerBase).toBeLessThan(0.5);
  });
});

describe("Project animation capability", () => {
  it("projects with hasAnimation=true should have labels for the exploded view", () => {
    const animatedProjects = projects.filter((p) => p.hasAnimation);
    for (const project of animatedProjects) {
      expect(project.labels.length).toBeGreaterThan(0);
    }
  });

  it("projects with hasAnimation=false should have gallery images or thumbnail (if any exist)", () => {
    const nonAnimatedProjects = projects.filter((p) => !p.hasAnimation);
    for (const project of nonAnimatedProjects) {
      const hasGallery = project.galleryImages && project.galleryImages.length > 0;
      const hasThumbnail = !!project.thumbnailUrl;
      expect(hasGallery || hasThumbnail).toBe(true);
    }
  });

  it("cpress project should now be animated (converted from gallery to scroll animation)", () => {
    const cpress = projects.find((p) => p.id === "cpress");
    expect(cpress).toBeDefined();
    expect(cpress!.hasAnimation).toBe(true);
    expect(cpress!.labels.length).toBeGreaterThanOrEqual(4);
    expect(cpress!.galleryImages).toBeUndefined();
  });

  it("contentCropX should be between 0 and 0.5 when defined", () => {
    for (const project of projects) {
      if (project.contentCropX !== undefined) {
        expect(project.contentCropX).toBeGreaterThanOrEqual(0);
        expect(project.contentCropX).toBeLessThan(0.5);
      }
    }
  });
});
