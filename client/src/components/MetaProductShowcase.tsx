import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Frame sequences extracted from AI-generated rotating product videos
const GEN3_FRAMES: string[] = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-000_e6d0c782.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-001_d55e7d6c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-002_a49a0a23.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-003_a3131ed0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-004_0d882fe5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-005_756cf9b0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-006_c0190d79.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-007_1d8b4651.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-008_56294905.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-009_4864315f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-010_068bea0e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-011_4f841d82.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-012_6c1e7c1a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-013_43f46406.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-014_724cc1fb.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-015_301d3de2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-016_fe1468ab.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-017_cb6d69d9.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-018_bffa5ed9.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-019_ca72e69a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-020_1e93d776.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-021_20935075.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-022_e353a48b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-023_d4ec2028.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-024_44bf8dde.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-025_29d442b8.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-026_2c6dfcde.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-027_8c819e90.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-028_eb9d11e1.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-029_c83f1665.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-030_5544ecf0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-031_edbe5ebd.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-032_b4ae6bab.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-033_02daf81f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-034_2597f771.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-035_e52200f9.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-036_fff08a79.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-037_fd7f6693.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-038_03a0f8af.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-039_2d6fe64b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-040_9450eb05.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-041_7512f7f4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-042_b3ec3091.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-043_978e9bd7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-044_247dcd6d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-045_7f6eaa9a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-046_d79a689c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-047_defcaf6c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-048_7ab386d4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-049_828bfff7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-050_3bc9795f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-051_148f4e2f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-052_6aecddc0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-053_7f7bf8b0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-054_0d477197.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-055_be8c9cb4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-056_55216003.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-057_3b4c0f60.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-058_bacceced.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-059_2d63d837.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-060_f9d5b2c0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-061_22903b66.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-062_d3c81741.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-063_0d81b9ab.jpg"
];

const GEN4_FRAMES: string[] = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-000_351310c7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-001_4230a343.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-002_4d604e31.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-003_c0502df7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-004_82054348.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-005_9608205e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-006_49ad4d94.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-007_6fa29da0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-008_a61627e7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-009_9f45731a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-010_f89af72c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-011_d5b419e6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-012_00e5306c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-013_4ca30ee7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-014_47b686cb.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-015_0549723c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-016_2335956f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-017_f6e968ea.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-018_44d534a5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-019_e3e8a04e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-020_b53b7658.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-021_fbb59698.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-022_746ef318.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-023_2c033121.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-024_d87c3127.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-025_3c8f4db3.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-026_bf359da4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-027_129f5e90.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-028_fd84995b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-029_7b11d92d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-030_25e7a81e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-031_075c64f1.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-032_37ab4c7e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-033_5d9db7d2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-034_f4c48032.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-035_e70cf6f6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-036_32cadb93.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-037_b5db178d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-038_770649f5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-039_c3c77031.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-040_8b6fa707.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-041_2adb233f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-042_c20e403f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-043_881ac3f9.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-044_66998dca.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-045_443bd5a8.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-046_2d45158d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-047_f25c7e4a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-048_78b604a5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-049_af1fb987.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-050_0fcd0c9d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-051_218f5dc5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-052_335d9d10.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-053_1f71e231.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-054_c906d4cc.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-055_1302b283.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-056_63898582.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-057_92612760.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-058_161931f1.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-059_a09a2373.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-060_ce29c10f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-061_e09fc881.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-062_3b2a15d2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-063_602ae4dc.jpg"
];

const GEN5_FRAMES: string[] = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-000_fc905cc7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-001_0156767f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-002_4b109df1.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-003_fcd17695.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-004_77ab626a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-005_81562895.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-006_57d196ff.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-007_dec9297a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-008_312bbbf5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-009_300d2def.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-010_852d1897.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-011_b0a120e0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-012_2fda6d54.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-013_279b1d2b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-014_34342496.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-015_7bcff8d3.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-016_f6b7f79a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-017_11064553.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-018_9011134c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-019_8397546f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-020_c97a7f9f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-021_7775ad59.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-022_c2325bef.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-023_a30f3efb.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-024_69ceac17.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-025_572b7ef9.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-026_14629247.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-027_cc3ec444.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-028_334a039a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-029_528f8519.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-030_73b0004f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-031_3f58083f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-032_21919c17.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-033_bba267f6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-034_63cef51b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-035_0424934a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-036_aeee7071.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-037_67608c7d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-038_5e72febd.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-039_4d403331.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-040_e064809b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-041_7562a3f4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-042_373c3d78.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-043_738d72da.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-044_265d7340.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-045_4b003ebe.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-046_d8bc0cbc.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-047_4d9ba3dc.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-048_73ff3d91.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-049_a790611b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-050_71c3067c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-051_1f1a8404.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-052_5c947aec.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-053_40caeae2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-054_4b3879f0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-055_64416871.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-056_f46092ce.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-057_8c9e28af.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-058_8038f91e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-059_259f4758.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-060_2c978136.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-061_febd47aa.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-062_1763010a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/f-063_52f607a9.jpg"
];

const ALL_FRAME_SETS = [GEN3_FRAMES, GEN4_FRAMES, GEN5_FRAMES];
const FRAMES_PER_GEN = 64;

interface Generation {
  id: number;
  name: string;
  year: string;
  era: string;
  tagline: string;
  description: string;
  specs: string[];
  sourceUrl: string;
  sourceLabel: string;
}

const GENERATIONS: Generation[] = [
  {
    id: 3, name: "Internal Platform", year: "2020", era: "FB Connect Demo",
    tagline: "Industrial Precision",
    description: "A robust, industrial-grade wristband showcased at Facebook Connect. Thicker profile with gold-plated sensor arrays and advanced signal processing, designed for extensive internal testing and research validation.",
    specs: ["Industrial design", "Gold sensor arrays", "Robust housing", "Internal testing"],
    sourceUrl: "https://about.fb.com/news/2021/03/inside-facebook-reality-labs-wrist-based-interaction-for-the-next-computing-platform/",
    sourceLabel: "Meta Blog",
  },
  {
    id: 4, name: "Orion Companion", year: "2024", era: "AR Orion Demo",
    tagline: "Refined for AR",
    description: "A dramatically slimmer wristband with premium fabric exterior and gold sensor contacts. Paired with Orion AR glasses at Meta Connect 2024, demonstrating seamless neural input for augmented reality.",
    specs: ["Fabric exterior", "Slim profile", "AR-optimized", "Gold contacts"],
    sourceUrl: "https://about.fb.com/news/2024/09/introducing-orion-our-first-true-augmented-reality-glasses/",
    sourceLabel: "Meta Blog",
  },
  {
    id: 5, name: "Neural Band", year: "2025", era: "Consumer Launch",
    tagline: "Invisible Technology",
    description: "The consumer-ready Meta Neural Band \u2014 an ultra-slim woven textile wristband indistinguishable from a fashion accessory. All sEMG sensors hidden beneath the fabric, paired with Meta Ray-Ban Display glasses.",
    specs: ["Woven textile", "All-day comfort", "Hidden sensors", "Consumer-ready"],
    sourceUrl: "https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/",
    sourceLabel: "Meta Blog",
  },
];

const EARLIER_GENS = [
  {
    id: 1, name: "Research Prototype", year: "2015", era: "Ctrl-Labs Founded",
    description: "The original research prototype with exposed PCB circuitry and 16 sensor pods arranged in a circular band. Raw engineering \u2014 visible chips, solder points, and gold electrode contacts.",
    sourceUrl: "https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal",
    sourceLabel: "The Verge",
  },
  {
    id: 2, name: "Development Kit", year: "2019", era: "Acquired by Meta",
    description: "A refined enclosed wristband with LED indicators, marking the transition from lab prototype to developer-ready hardware.",
    sourceUrl: "https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal",
    sourceLabel: "The Verge",
  },
];

const GESTURES = [
  { gesture: "Index Pinch", action: "Select / Go Back" },
  { gesture: "Swipe", action: "Scroll Content" },
  { gesture: "Pinch + Rotate", action: "Zoom / Volume" },
  { gesture: "Double Pinch", action: "Wake / Sleep" },
  { gesture: "Thumb Tap", action: "Activate Meta AI" },
];

export default function MetaProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textOverlaysRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);
  const earlierRef = useRef<HTMLDivElement>(null);
  const [showEarlier, setShowEarlier] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[][]>([[], [], []]);
  const rafRef = useRef<number>(0);

  // Preload all frame images
  useEffect(() => {
    let loaded = 0;
    const total = ALL_FRAME_SETS.flat().length;

    ALL_FRAME_SETS.forEach((genFrames, genIdx) => {
      genFrames.forEach((url, frameIdx) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loaded++;
          setLoadProgress(Math.floor((loaded / total) * 100));
          if (loaded === total) setIsLoaded(true);
        };
        img.onerror = () => {
          loaded++;
          setLoadProgress(Math.floor((loaded / total) * 100));
          if (loaded === total) setIsLoaded(true);
        };
        img.src = url;
        if (!imagesRef.current[genIdx]) imagesRef.current[genIdx] = [];
        imagesRef.current[genIdx][frameIdx] = img;
      });
    });
  }, []);

  // Draw a specific frame on the canvas
  const drawFrame = useCallback((genIdx: number, frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[genIdx]?.[frameIdx];
    if (!img || !img.complete || !img.naturalWidth) return;

    // Set canvas to image dimensions (only if changed)
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  // GSAP ScrollTrigger - scroll drives canvas frames
  useEffect(() => {
    if (!isLoaded || !pinRef.current || !canvasRef.current) return;

    // Draw first frame immediately
    drawFrame(0, 0);

    const ctx = gsap.context(() => {
      const totalGens = 3;
      const scrollPerGen = 1 / totalGens;

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=5000",
        pin: true,
        scrub: 0.3,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const genIdx = Math.min(Math.floor(p / scrollPerGen), totalGens - 1);
          const genProgress = (p - genIdx * scrollPerGen) / scrollPerGen;
          const frameIdx = Math.min(Math.floor(genProgress * FRAMES_PER_GEN), FRAMES_PER_GEN - 1);

          // Use requestAnimationFrame for smooth canvas updates
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => drawFrame(genIdx, frameIdx));

          // Update text overlays
          const overlays = textOverlaysRef.current?.children;
          if (overlays) {
            for (let i = 0; i < overlays.length; i++) {
              const el = overlays[i] as HTMLElement;
              if (i === genIdx) {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
                el.style.pointerEvents = "auto";
                el.style.visibility = "visible";
              } else {
                el.style.opacity = "0";
                el.style.transform = i < genIdx ? "translateY(-60px)" : "translateY(60px)";
                el.style.pointerEvents = "none";
                el.style.visibility = "hidden";
              }
            }
          }
        },
      });

      // Gesture section entrance
      if (gestureRef.current) {
        gsap.fromTo(gestureRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: gestureRef.current, start: "top 85%", once: true } }
        );
      }
      if (disclaimerRef.current) {
        gsap.fromTo(disclaimerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: disclaimerRef.current, start: "top 90%", once: true } }
        );
      }
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [isLoaded, drawFrame]);

  // Earlier prototypes animation
  useEffect(() => {
    if (!showEarlier || !earlierRef.current) return;
    const cards = earlierRef.current.querySelectorAll(".earlier-card");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true } }
        );
      });
    }, earlierRef);
    return () => ctx.revert();
  }, [showEarlier]);

  const handleToggle = useCallback(() => setShowEarlier((p) => !p), []);

  return (
    <section id="neural-band" ref={sectionRef} className="relative" style={{ background: "#0a0a0a", isolation: "isolate" }}>

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: "#0a0a0a" }}>
          <div className="relative mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(46,126,191,0.3)", borderTopColor: "transparent" }} />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(232,168,56,0.3)", borderTopColor: "transparent", animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
          <p className="text-xs font-mono tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(232,168,56,0.7)" }}>Loading Experience</p>
          <div className="w-64 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${loadProgress}%`, background: "linear-gradient(90deg, #2E7EBF, #E8A838)" }} />
          </div>
          <p className="mt-3 text-xs font-mono tabular-nums" style={{ color: "rgba(255,255,255,0.25)" }}>{loadProgress}%</p>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative px-6 pt-24 pb-8 md:px-12 md:pt-32 md:pb-12 max-w-7xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(46,126,191,0.06) 0%, transparent 70%)" }} />
        <p className="text-xs font-mono tracking-[0.35em] uppercase mb-4" style={{ color: "rgba(232,168,56,0.7)" }}>Product Evolution</p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Meta Neural Band
        </h2>
        <p className="mt-4 md:mt-6 text-base md:text-xl max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          A decade of innovation &mdash; from exposed circuit boards to an invisible wristband that reads your intentions. Powered by surface electromyography (sEMG).
        </p>
        <a href="https://www.meta.com/emerging-tech/emg-wearable-technology/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-sm font-medium transition-colors duration-200 hover:text-[#E8A838]" style={{ color: "#2E7EBF" }}>
          Learn more about EMG technology
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>

      {/* Scroll-Driven Canvas Section */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden" style={{ background: "#0a0a0a" }}>

        {/* Generation indicator dots */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {GENERATIONS.map((gen, i) => (
            <div key={gen.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full transition-all duration-500" style={{ background: "rgba(232,168,56,0.4)" }} />
                <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{gen.year}</span>
              </div>
              {i < GENERATIONS.length - 1 && (
                <div className="w-8 h-[1px]" style={{ background: "rgba(255,255,255,0.08)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Canvas - centered, product rotates here */}
        <canvas
          ref={canvasRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            maxWidth: "55vw",
            maxHeight: "65vh",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            zIndex: 10,
          }}
        />

        {/* Ambient glow behind canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(46,126,191,0.06) 0%, transparent 60%)", zIndex: 5 }} />

        {/* Text overlays - right side */}
        <div ref={textOverlaysRef} className="absolute inset-0 z-20 pointer-events-none">
          {GENERATIONS.map((gen, i) => (
            <div key={gen.id}
              className="absolute inset-0 flex items-center"
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0)" : "translateY(60px)",
                transition: "none",
                pointerEvents: i === 0 ? "auto" : "none",
              }}>
              <div className="ml-auto mr-6 md:mr-12 lg:mr-20 max-w-sm pointer-events-auto">
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2" style={{ color: "#E8A838" }}>
                  Generation {gen.id}
                </p>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-1" style={{ color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  {gen.name}
                </h3>
                <p className="text-sm font-medium mb-1" style={{ color: "#E8A838" }}>{gen.tagline}</p>
                <p className="text-[10px] font-mono mb-4" style={{ color: "#2E7EBF" }}>{gen.era} &mdash; {gen.year}</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{gen.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {gen.specs.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 text-[10px] font-mono rounded-full border"
                      style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>{s}</span>
                  ))}
                </div>
                <a href={gen.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-mono transition-colors hover:text-[#E8A838]"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  Source: {gen.sourceLabel} &#8599;
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>Scroll to explore</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      {/* Gesture Control */}
      <div ref={gestureRef} className="px-6 py-24 md:px-12 md:py-32 max-w-5xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-center"
          style={{ color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>Gesture Control</h3>
        <p className="text-sm text-center mb-12 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
          Navigate AR interfaces with natural hand movements detected by sEMG sensors.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {GESTURES.map((g) => (
            <div key={g.gesture} className="group relative p-4 rounded-xl border text-center transition-all duration-300 hover:border-[#2E7EBF]/40 hover:bg-[#2E7EBF]/5"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>{g.gesture}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{g.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Earlier Prototypes Toggle */}
      <div className="px-6 pb-8 md:px-12 max-w-5xl mx-auto text-center">
        <button onClick={handleToggle}
          className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border text-sm font-mono tracking-wide transition-all duration-300 hover:border-[#E8A838]/50 hover:bg-[#E8A838]/5"
          style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}>
          {showEarlier ? "Hide Earlier Prototypes" : "Reveal Earlier Prototypes (Gen 1 & 2)"}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-300 ${showEarlier ? "rotate-180" : ""}`}>
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          2 additional generations not shown above &mdash; all information is publicly available.
        </p>
      </div>

      {showEarlier && (
        <div ref={earlierRef} className="px-6 py-16 md:px-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EARLIER_GENS.map((gen) => (
              <div key={gen.id} className="earlier-card group relative p-8 rounded-2xl border transition-all duration-300 hover:border-[#2E7EBF]/30"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-1" style={{ color: "#E8A838" }}>Generation {gen.id}</p>
                <h4 className="text-xl font-bold mb-1" style={{ color: "#f0f0f0" }}>{gen.name}</h4>
                <p className="text-xs font-mono mb-3" style={{ color: "#2E7EBF" }}>{gen.era} &mdash; {gen.year}</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{gen.description}</p>
                <a href={gen.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-mono transition-colors hover:text-[#E8A838]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Source: {gen.sourceLabel} &#8599;
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div ref={disclaimerRef} className="px-6 py-16 md:px-12 max-w-4xl mx-auto text-center">
        <div className="p-6 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            All product information shown is from publicly available sources including
            {" "}<a href="https://about.fb.com/news/2021/03/inside-facebook-reality-labs-wrist-based-interaction-for-the-next-computing-platform/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Meta Reality Labs Blog</a>,
            {" "}<a href="https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">The Verge</a>,
            {" "}<a href="https://about.fb.com/news/2024/09/introducing-orion-our-first-true-augmented-reality-glasses/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Meta Connect 2024</a>, and
            {" "}<a href="https://www.meta.com/emerging-tech/emg-wearable-technology/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Meta Emerging Tech</a>.
            {" "}No proprietary or confidential information is disclosed. Product evolution timeline based on the
            {" "}<a href="https://colfuse.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Colfuse</a> public presentation deck.
          </p>
        </div>
      </div>

    </section>
  );
}
