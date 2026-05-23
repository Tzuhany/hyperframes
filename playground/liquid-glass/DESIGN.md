## Style Prompt

Apple Liquid Glass — iOS 26 / macOS Sequoia design language. Vibrant, deeply saturated wavy aurora background with frosted glass UI components floating over it. The glass has heavy backdrop blur, subtle edge highlights simulating light refraction, and a faint tint from the background bleeding through. Ultra-premium, clean, with precise typography and generous spacing.

## Colors

- Background shader: Deep purples (#1a0533), ocean blues (#0a2540), hot pinks (#ec4899), amber (#f59e0b), cyan (#06b6d4) — blended via fragment shader
- Glass tint: rgba(255, 255, 255, 0.08) base, rgba(255, 255, 255, 0.25) border highlight
- Text primary: rgba(255, 255, 255, 0.95)
- Text secondary: rgba(255, 255, 255, 0.55)
- Glass shadow: rgba(0, 0, 0, 0.15)

## Typography

- SF Pro Display / Inter — weights 400, 500, 600, 700
- System UI fallback: -apple-system, BlinkMacSystemFont

## What NOT to Do

- No flat colors — everything must feel like it's refracting light
- No hard borders — all edges are soft, luminous, gradient-edged
- No opacity below 0.03 on glass panels — must be visible
- No square corners — everything uses large radius (28-44px) with iOS squircle feel
- No heavy drop shadows — glass uses subtle, diffuse shadows only
