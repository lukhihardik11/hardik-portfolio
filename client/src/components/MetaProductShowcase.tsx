import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Frame sequences extracted from AI-generated rotating product videos (v2 - reference-based)
const GEN3_FRAMES: string[] = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_000_f386d01a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_001_7152f8b6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_002_b811c2cd.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_003_0a7d2f5d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_004_ec984785.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_005_c574fdf3.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_006_a9dad5df.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_007_be54c699.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_008_4487ca3c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_009_ba2e0d8d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_010_ad94b22d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_011_9561cd6b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_012_eaa91200.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_013_0c04b381.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_014_096ddc45.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_015_18c026d2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_016_4a40fd1d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_017_49faebbc.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_018_8b9deace.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_019_66e92525.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_020_7a721f80.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_021_f8c1f71f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_022_ba0f7c61.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_023_e3c67823.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_024_64d2e378.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_025_b934dba2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_026_64a63a6d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_027_dbcc81f0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_028_40b4a47b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_029_b2b85c87.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_030_acb604c2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_031_dc080d05.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_032_01f52ded.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_033_07f59e60.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_034_550af127.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_035_4ba03e95.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_036_1eda036b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_037_eb769eb6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_038_5019a480.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_039_855de552.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_040_fe774111.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_041_88d8cc26.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_042_7bbc112e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_043_2fe20d67.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_044_1819f098.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_045_12cbcd24.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_046_959c0bd7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_047_f2d30a36.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_048_5935cb69.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_049_7432f95e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_050_c5b05abb.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_051_85b16e0b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_052_0a73e196.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_053_c8d0cc5d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_054_a2547346.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_055_db993166.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_056_0cc5509b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_057_6d333bba.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_058_3c7dfb41.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_059_4aa11a7d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_060_1758d055.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_061_a81e54e2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_062_7a71087c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_063_46364c52.jpg",
];

const GEN4_FRAMES: string[] = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_000_c318c7d8.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_001_d527dca6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_002_bf96170a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_003_03564260.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_004_7335fc71.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_005_d7a97829.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_006_e0670241.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_007_2669e613.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_008_efe443ea.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_009_faa71da2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_010_d2142f04.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_011_5039016e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_012_3a76977c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_013_acba4284.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_014_984bd930.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_015_5f45ca42.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_016_7416cb7a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_017_1f686958.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_018_8ad36d59.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_019_ae8b6762.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_020_83aa6730.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_021_6088cdae.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_022_f78db011.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_023_ce0fe430.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_024_030648cd.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_025_38f11d94.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_026_f3dbd631.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_027_23cab658.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_028_72b8bec0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_029_6141eecb.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_030_553c2c80.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_031_791b7922.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_032_dab3ea8c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_033_36e32337.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_034_1b950b3e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_035_139c30e9.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_036_1c5c7ed4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_037_287c7363.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_038_5f97d13f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_039_0bc1663c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_040_fe4b9b05.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_041_412c9915.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_042_dece15bc.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_043_b17328d1.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_044_bb45e372.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_045_582320e8.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_046_d8627dec.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_047_1bbe231b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_048_ae99411b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_049_fef905ac.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_050_39cbeb1c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_051_b6b84caa.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_052_560dffeb.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_053_e83c5565.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_054_74611c0f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_055_755915a0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_056_b1dd41f5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_057_4cc89872.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_058_ad736fd6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_059_23a3d176.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_060_3f40f0ca.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_061_0176a70b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_062_274cb0eb.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_063_a965cab8.jpg",
];

const GEN5_FRAMES: string[] = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_000_ec3280f4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_001_4180d790.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_002_12c388a9.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_003_1d81a843.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_004_728a43a1.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_005_893f7f40.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_006_0fd46341.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_007_82a11e93.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_008_1e591459.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_009_598679d4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_010_893c3f5a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_011_f27428a4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_012_0d8f9db0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_013_a2c6a27f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_014_c92e6c38.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_015_1e1bc5a0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_016_2e88bf8c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_017_7a4d1b1e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_018_e3d1fadc.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_019_f932f654.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_020_86d8acdf.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_021_a522cd18.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_022_656aad34.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_023_6b4a2699.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_024_1014a82a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_025_4058fce5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_026_b4f75ea1.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_027_26b9e935.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_028_0335fb85.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_029_9fb3d661.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_030_719cc72d.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_031_71a853d8.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_032_459f3b86.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_033_8447e9ec.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_034_7ea0ed3b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_035_0d49ac59.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_036_0dc1bf82.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_037_2dc3b02c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_038_570b87e7.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_039_25c4ff82.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_040_3721c018.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_041_4263f0c4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_042_7ee57de2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_043_760e115e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_044_c7d4e8bd.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_045_36b03a1f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_046_324e61c0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_047_24dec724.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_048_249bf6f4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_049_84af49d4.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_050_b7a1d02a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_051_6cccd9dd.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_052_ca9a23e3.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_053_c28a3e47.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_054_815891f0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_055_a18779e2.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_056_d99c8162.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_057_23dcd94a.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_058_21ddc3a6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_059_610ac679.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_060_352acf03.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_061_dd9ed94b.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_062_842a1584.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/frame_063_2d717786.jpg",
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
  refImage: string;
}

const GENERATIONS: Generation[] = [
  {
    id: 3, name: "Internal Platform", year: "2020", era: "FB Connect Demo",
    tagline: "Industrial Precision",
    description: "A robust, industrial-grade wristband showcased at Facebook Connect. Thicker profile with gold-plated sensor arrays and advanced signal processing, designed for extensive internal testing and research validation.",
    specs: ["Industrial design", "Gold sensor arrays", "Robust housing", "Internal testing"],
    sourceUrl: "https://about.fb.com/news/2021/03/inside-facebook-reality-labs-wrist-based-interaction-for-the-next-computing-platform/",
    sourceLabel: "Meta Blog",
    refImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen3_ctrlkit_5803af12.png",
  },
  {
    id: 4, name: "Orion Companion", year: "2024", era: "AR Orion Demo",
    tagline: "Refined for AR",
    description: "A dramatically slimmer wristband with premium fabric exterior and gold sensor contacts. Paired with Orion AR glasses at Meta Connect 2024, demonstrating seamless neural input for augmented reality.",
    specs: ["Fabric exterior", "Slim profile", "AR-optimized", "Gold contacts"],
    sourceUrl: "https://about.fb.com/news/2024/09/introducing-orion-our-first-true-augmented-reality-glasses/",
    sourceLabel: "Meta Blog",
    refImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen4_orion_f3e188b9.jpg",
  },
  {
    id: 5, name: "Neural Band", year: "2025", era: "Consumer Launch",
    tagline: "Invisible Technology",
    description: "The consumer-ready Meta Neural Band \u2014 an ultra-slim woven textile wristband indistinguishable from a fashion accessory. All sEMG sensors hidden beneath the fabric, paired with Meta Ray-Ban Display glasses.",
    specs: ["Woven textile", "All-day comfort", "Hidden sensors", "Consumer-ready"],
    sourceUrl: "https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/",
    sourceLabel: "Meta Blog",
    refImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen5_official_de0408bd.jpg",
  },
];

const EARLIER_GENS = [
  {
    id: 1, name: "Research Prototype", year: "2015", era: "Ctrl-Labs Founded",
    description: "The original research prototype with exposed PCB circuitry and 16 sensor pods arranged in a circular band. Raw engineering \u2014 visible chips, solder points, and gold electrode contacts.",
    sourceUrl: "https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal",
    sourceLabel: "The Verge",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen_lineup_115a7467.png",
  },
  {
    id: 2, name: "Development Kit", year: "2019", era: "Acquired by Meta",
    description: "A refined enclosed wristband with LED indicators, marking the transition from lab prototype to developer-ready hardware. The CTRL-kit shipped to select developers before Meta\u2019s acquisition.",
    sourceUrl: "https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal",
    sourceLabel: "The Verge",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen3_ctrlkit_5803af12.png",
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
  const progressDotsRef = useRef<HTMLDivElement>(null);
  const [showEarlier, setShowEarlier] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeGen, setActiveGen] = useState(0);
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

  // Draw a specific frame on the canvas - COVER mode on ALL viewports for full immersive experience
  const drawFrame = useCallback((genIdx: number, frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[genIdx]?.[frameIdx];
    if (!img || !img.complete || !img.naturalWidth) return;

    // Match canvas to its CSS display size for sharp rendering
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.round(rect.width * dpr);
    const ch = Math.round(rect.height * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    // Cover mode on ALL viewports — product fills the entire screen for immersive feel
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // GSAP ScrollTrigger - scroll drives canvas frames
  useEffect(() => {
    if (!isLoaded || !pinRef.current || !canvasRef.current) return;

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

          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            drawFrame(genIdx, frameIdx);
            setActiveGen(genIdx);
          });

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

          // Update progress dots
          const dots = progressDotsRef.current?.querySelectorAll(".gen-dot");
          if (dots) {
            dots.forEach((dot, i) => {
              const d = dot as HTMLElement;
              if (i === genIdx) {
                d.style.background = "#E8A838";
                d.style.transform = "scale(1.5)";
                d.style.boxShadow = "0 0 12px rgba(232,168,56,0.4)";
              } else if (i < genIdx) {
                d.style.background = "#2E7EBF";
                d.style.transform = "scale(1)";
                d.style.boxShadow = "none";
              } else {
                d.style.background = "rgba(255,255,255,0.15)";
                d.style.transform = "scale(1)";
                d.style.boxShadow = "none";
              }
            });
          }

          // Update progress line
          const line = progressDotsRef.current?.querySelector(".progress-line") as HTMLElement;
          if (line) {
            const pct = ((genIdx + genProgress) / totalGens) * 100;
            line.style.width = `${pct}%`;
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

      {/* Hero Header — aligned with portfolio section pattern */}
      <div className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[400px] h-[400px] -top-20 right-0 opacity-20"
            style={{ background: "radial-gradient(ellipse, oklch(0.55 0.18 230 / 12%) 0%, transparent 70%)", borderRadius: "40% 60% 70% 30% / 50% 40% 60% 50%" }} />
        </div>
        <div className="container relative z-10">
          <div className="mb-8 sm:mb-10 md:mb-14 lg:mb-16">
            <p className="jelly-section-label">Product Evolution</p>
            <h2 className="jelly-section-title max-w-xl">Meta Neural Band</h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4 max-w-lg xl:max-w-xl leading-relaxed">
              A decade of innovation &mdash; from exposed circuit boards to an invisible wristband that reads your intentions. Powered by surface electromyography (sEMG).
            </p>
            <a href="https://www.meta.com/emerging-tech/emg-wearable-technology/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary transition-colors duration-200 hover:text-accent">
              Learn more about EMG technology
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll-Driven Canvas Section */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden" style={{ background: "#0a0a0a" }}>

        {/* Progress indicator with dots and line */}
        <div ref={progressDotsRef} className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0">
          <div className="relative flex items-center" style={{ width: "200px" }}>
            {/* Background line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[1px]" style={{ background: "rgba(255,255,255,0.08)" }} />
            {/* Active progress line */}
            <div className="progress-line absolute top-1/2 -translate-y-1/2 left-0 h-[1px] transition-all duration-300" style={{ width: "0%", background: "linear-gradient(90deg, #2E7EBF, #E8A838)" }} />
            {/* Dots */}
            {GENERATIONS.map((gen, i) => (
              <div key={gen.id} className="absolute flex flex-col items-center" style={{ left: `${(i / (GENERATIONS.length - 1)) * 100}%`, transform: "translateX(-50%)" }}>
                <div className="gen-dot w-2.5 h-2.5 rounded-full transition-all duration-500" style={{ background: i === 0 ? "#E8A838" : "rgba(255,255,255,0.15)", transform: i === 0 ? "scale(1.5)" : "scale(1)", boxShadow: i === 0 ? "0 0 12px rgba(232,168,56,0.4)" : "none" }} />
                <span className="mt-2 text-[9px] font-mono whitespace-nowrap" style={{ color: "rgba(255,255,255,0.3)" }}>{gen.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas - fills viewport for cinematic effect */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            zIndex: 10,
          }}
        />

        {/* Full-screen cinematic vignette — same on all viewports */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 70% at 35% 50%, transparent 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.85) 100%)",
          zIndex: 15,
        }} />
        {/* Bottom gradient for text readability on all devices */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 15%, transparent 50%, rgba(10,10,10,0.5) 70%, rgba(10,10,10,0.92) 90%)",
          zIndex: 15,
        }} />
        {/* Top edge for progress dots readability */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 10%)",
          zIndex: 15,
        }} />

        {/* Ambient glow behind canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(46,126,191,0.06) 0%, transparent 60%)", zIndex: 5 }} />

        {/* Text overlays — bottom-left floating glass card on ALL viewports */}
        <div ref={textOverlaysRef} className="absolute inset-0 z-20 pointer-events-none">
          {GENERATIONS.map((gen, i) => (
            <div key={gen.id}
              className="absolute inset-0 flex items-end justify-start"
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0)" : "translateY(40px)",
                transition: "none",
                pointerEvents: i === 0 ? "auto" : "none",
                visibility: i === 0 ? "visible" : "hidden",
              }}>
              <div className="pointer-events-auto w-full max-w-[90vw] sm:max-w-md md:max-w-lg mx-4 sm:mx-6 md:mx-10 lg:mx-16 mb-16 sm:mb-20 md:mb-24">
                {/* Frosted glass card */}
                <div className="rounded-2xl p-4 sm:p-5 md:p-6" style={{
                  background: "rgba(10,10,10,0.55)",
                  backdropFilter: "blur(20px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}>
                  <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase mb-1.5" style={{ color: "#E8A838" }}>
                    Generation {gen.id}
                  </p>
                  <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1" style={{ color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                    {gen.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium mb-0.5" style={{ color: "#E8A838" }}>{gen.tagline}</p>
                  <p className="text-[10px] font-mono mb-2 sm:mb-3" style={{ color: "#2E7EBF" }}>{gen.era} &mdash; {gen.year}</p>
                  <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed mb-3 line-clamp-3 sm:line-clamp-none" style={{ color: "rgba(255,255,255,0.55)" }}>{gen.description}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                    {gen.specs.map((s) => (
                      <span key={s} className="px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>{s}</span>
                    ))}
                  </div>
                  <a href={gen.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono transition-colors hover:text-[#E8A838]"
                    style={{ color: "rgba(255,255,255,0.35)" }}>
                    Source: {gen.sourceLabel} &#8599;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint — bottom-right to avoid overlap with glass card */}
        <div className="absolute bottom-6 right-6 sm:right-8 md:right-12 z-30 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Scroll</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      {/* Gesture Control — aligned with portfolio card grid pattern */}
      <div ref={gestureRef} className="py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
        <div className="container">
          <div className="mb-8 sm:mb-10 md:mb-14 text-center">
            <p className="jelly-section-label">Interaction</p>
            <h3 className="jelly-section-title">Gesture Control</h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed">
              Navigate AR interfaces with natural hand movements detected by sEMG sensors.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {GESTURES.map((g) => (
              <div key={g.gesture} className="group relative p-3 sm:p-4 rounded-xl border text-center transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">{g.gesture}</p>
                <p className="text-[11px] text-muted-foreground">{g.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earlier Prototypes Toggle — portfolio button style */}
      <div className="container pb-8 text-center">
        <button onClick={handleToggle}
          className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border text-sm font-mono tracking-wide transition-all duration-300 hover:border-accent/50 hover:bg-accent/5 border-border text-muted-foreground">
          {showEarlier ? "Hide Earlier Prototypes" : "Reveal Earlier Prototypes (Gen 1 & 2)"}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-300 ${showEarlier ? "rotate-180" : ""}`}>
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="mt-3 text-xs text-muted-foreground/50">
          2 additional generations not shown above &mdash; all information is publicly available.
        </p>
      </div>

      {showEarlier && (
        <div ref={earlierRef} className="container py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {EARLIER_GENS.map((gen) => (
              <div key={gen.id} className="earlier-card group relative overflow-hidden rounded-xl border transition-all duration-300 hover:border-primary/30 bg-card">
                <div className="aspect-video overflow-hidden bg-muted/30">
                  <img src={gen.image} alt={`Gen ${gen.id} - ${gen.name}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-4 sm:p-6 md:p-8">
                  <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-1 text-accent">Generation {gen.id}</p>
                  <h4 className="text-lg sm:text-xl font-bold mb-1 text-foreground">{gen.name}</h4>
                  <p className="text-xs font-mono mb-3 text-primary">{gen.era} &mdash; {gen.year}</p>
                  <p className="text-xs sm:text-sm leading-relaxed mb-4 text-muted-foreground">{gen.description}</p>
                  <a href={gen.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-mono text-muted-foreground/50 transition-colors hover:text-accent">
                    Source: {gen.sourceLabel} &#8599;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Disclaimer — portfolio card style */}
      <div ref={disclaimerRef} className="container py-8 sm:py-12 md:py-16 text-center max-w-4xl mx-auto">
        <div className="p-4 sm:p-6 rounded-xl border border-border bg-card">          <p className="text-xs leading-relaxed text-muted-foreground/60">
            All product information shown is from publicly available sources including
            {" "}<a href="https://about.fb.com/news/2021/03/inside-facebook-reality-labs-wrist-based-interaction-for-the-next-computing-platform/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Meta Reality Labs Blog</a>,
            {" "}<a href="https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">The Verge</a>,
            {" "}<a href="https://about.fb.com/news/2024/09/introducing-orion-our-first-true-augmented-reality-glasses/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Meta Connect 2024</a>, and
            {" "}<a href="https://www.meta.com/emerging-tech/emg-wearable-technology/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Meta Emerging Tech</a>.
            {" "}No proprietary or confidential information is disclosed. Product evolution timeline based on the
            {" "}<a href="https://colfuse.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Colfuse</a> public presentation deck.
          </p>
        </div>
      </div>

    </section>
  );
}
