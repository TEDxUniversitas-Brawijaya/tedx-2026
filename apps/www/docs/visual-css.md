# Visual CSS Best Practices

This document describes best practices for building visually rich, responsive,
editorial-style image layouts using **Astro** and **vanilla CSS**.
The focus is on composition, layering, and transform-based layout rather than
traditional grid-only approaches.

---

## 1. Core Layout Principle

All visual compositions are built on a **relative parent + absolute children**
pattern.

```css
.section {
  position: relative;
  overflow: hidden;
}

.image {
  position: absolute;
}
```

* `position: relative` establishes a local coordinate system.
* `position: absolute` allows images to escape normal document flow.
* `overflow: hidden` is used intentionally to crop compositions.

This pattern enables overlapping elements and editorial-style layouts.

---

## 2. Prefer Transform Over Positional Properties

Visual movement and positioning **must use `transform`**, not margin or
top/left offsets.

```css
.image {
  transform: translate(-10%, 5%) scale(1.1) rotate(-2deg);
}
```

### Why

* GPU accelerated
* No layout reflow
* Animation-ready by default
* Produces smoother, more organic compositions

Avoid using margin for visual positioning.

---

## 3. Absolute Positioning That Stays Responsive

Avoid pixel-based positioning.

❌ Bad:

```css
top: 200px;
left: 300px;
```

✅ Good:

```css
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
```

Use percentages and transforms to anchor elements relative to the viewport
or parent container.

---

## 4. Responsive Sizing With `clamp()`

Use `clamp()` for image sizes instead of fixed breakpoints.

```css
.image {
  width: clamp(240px, 30vw, 520px);
}
```

This ensures:

* Minimum readable size
* Maximum visual restraint
* Smooth scaling across all screen sizes

---

## 5. Maintain Aspect Ratio

Images must define an aspect ratio to avoid layout shift.

```css
.image {
  aspect-ratio: 3 / 4;
}
```

Combine with object-fit for safe cropping.

```css
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 6. Art-Directed Cropping

Do not rely on center-cropped images by default.

```css
img {
  object-position: 70% 30%;
}
```

Change crop focus per breakpoint when necessary to preserve composition.

---

## 7. Layering & Depth

Depth is created through **scale, opacity, and subtle blur**, not just z-index.

```css
.image--background {
  transform: scale(0.95);
  opacity: 0.6;
}

.image--foreground {
  transform: scale(1.05);
}
```

Optional:

```css
.image--background {
  filter: blur(2px);
}
```

---

## 8. Overflow as a Design Tool

Overflow is intentionally controlled.

```css
.section {
  overflow: visible;
}

.mask {
  overflow: hidden;
  border-radius: 24px;
}
```

This allows elements to escape boundaries while maintaining clean crops
where required.

---

## 9. Mobile Is a Different Composition

Mobile layouts should **recompose**, not shrink.

❌ Avoid:

```css
@media (max-width: 768px) {
  .image {
    width: 100%;
  }
}
```

✅ Prefer:

```css
@media (max-width: 768px) {
  .image {
    position: relative;
    transform: none;
    width: 90vw;
    margin-inline: auto;
  }
}
```

Reduce overlap, simplify layering, and preserve hierarchy.

---

## 10. Performance Considerations

* Prefer `transform` and `opacity` for animation
* Avoid large image reflows
* Use `aspect-ratio` to prevent CLS
* Defer motion effects on low-powered devices

---

## 11. Design Quality Checklist

Before shipping:

* Images overlap intentionally
* Composition changes across breakpoints
* No pixel-based positioning
* `transform` used for all visual movement
* Aspect ratio defined for all images
* Overflow is intentional

---

This document prioritizes **design-driven CSS** over rigid layout systems.
The goal is expressive, responsive, and editorial-quality web visuals.
