/**
 * Central index mapping project IDs to their frame URL arrays.
 * Each project has ~192 pre-rendered frames for the scroll animation.
 */

import { FRAME_URLS as EMG_FRAMES } from "@/components/frameUrls";
import { FRAME_URLS as BON_FRAMES } from "@/components/frameUrls-bon-4k";
import CYL_FRAMES from "@/components/frameUrls-cyl-4k";
import { FRAME_URLS as MOD_FRAMES } from "@/components/frameUrls-mod-4k";
import FUNC_FRAMES from "@/components/frameUrls-func-4k";
import { FRAME_URLS as ABAQUS_FRAMES } from "@/components/frameUrls-abaqus-4k";
import { FRAME_URLS as FPC_FRAMES } from "@/data/frameUrls-fpc-4k";
import { OCTOLAPSE_FRAME_URLS } from "@/components/frameUrls-octolapse-4k";
import { CPRESS_FRAME_URLS } from "@/data/frameUrls-cpress";

export const frameUrlsByProject: Record<string, readonly string[]> = {
  emg: EMG_FRAMES,
  bon: BON_FRAMES,
  cyl: CYL_FRAMES,
  mod: MOD_FRAMES,
  func: FUNC_FRAMES,
  abaqus: ABAQUS_FRAMES,
  fpc: FPC_FRAMES,
  octolapse: OCTOLAPSE_FRAME_URLS,
  cpress: CPRESS_FRAME_URLS,
};

export function getFrameUrls(projectId: string): readonly string[] {
  return frameUrlsByProject[projectId] ?? [];
}

/** Thumbnail URL overrides for non-animated projects */
const thumbnailOverrides: Record<string, string> = {};

/** Get the first frame URL as a thumbnail for a project */
export function getProjectThumbnail(projectId: string): string | null {
  // Check for thumbnail override first (for non-animated projects)
  if (thumbnailOverrides[projectId]) return thumbnailOverrides[projectId];
  const frames = frameUrlsByProject[projectId];
  return frames && frames.length > 0 ? frames[0] : null;
}
