# Batch 1 — Research Notes

## TypeGPU Reference Access
- WebGPU is not enabled in the sandbox Chromium browser
- Cannot view live demos directly
- Must research via: source code, screenshots, videos, articles about TypeGPU jelly examples

## Device Detection Research (Smashing Magazine)

Key findings for iPad/touch behavior:

- `hover: hover` detects devices where primary input CAN hover (desktop, laptop)
- `hover: none` detects devices that CANNOT hover (phones, tablets in touch mode)
- `pointer: fine` detects accurate pointer (mouse, trackpad, stylus)
- `pointer: coarse` detects imprecise pointer (touch, TV remote)
- `any-hover: hover` detects if ANY input mechanism can hover (iPad with trackpad)
- `any-pointer: fine` detects if ANY input has fine precision

**Critical iPad pitfall**: iPad with trackpad reports `pointer: coarse` and `hover: none` as PRIMARY, but `any-pointer: fine` and `any-hover: hover` as secondary. This means media queries based on primary pointer will treat iPad as touch-only even when a trackpad is connected.

**Implication for cursor follower**: 
- Show cursor follower only when `@media (hover: hover) and (pointer: fine)` matches
- Use `any-hover: hover` as a secondary check for hybrid devices
- On touch-only devices, hide cursor follower entirely
- On iPad with trackpad, can show a subtle cursor effect using `any-hover`
