import { openaiClient } from "./openaiClient";

export async function generateReview(content: string) {
  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o", // Specify the GPT-4 model
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that reviews code.",
      },
      {
        role: "user",
        content: `Review the following code:\n\n${content}`,
      },
    ],
    max_tokens: 500, // Control the length of the generated text
  });

  const { choices } = response;

  return choices.length > 0
    ? choices[0]?.message?.content?.trim()
    : "no content found";
}

/**
 * Example response (choices[0]?.message?.content?.trim()):

The code change you've made updates the class list of the `<main>` element. Here is an analysis of the change:

### Original Code
```jsx
<main className="flex min-h-screen flex-col items-center justify-between p-24">
```

### Updated Code
```jsx
<main className="min-h-screen flex-col items-center justify-between p-24">
```

### Detailed Analysis

1. **Removed `flex` Class:**
   - The original code had a `flex` class, which is typically used to define a flex container in Tailwind CSS. This enables flexbox layout properties on the container.
   - The updated code removes this `flex` class. As a result, the `main` element will no longer be a flex container, and its direct children won't be affected by `flex` properties.

2. **Remaining Classes:**
   - The other classes `min-h-screen`, `flex-col`, `items-center`, `justify-between`, and `p-24` are still present.
   - `min-h-screen`: Sets the minimum height to 100vh.
   - `flex-col`: Requires the `flex` container which is now removed.
   - `items-center`: Aligns items centrally along the cross-axis, provided the class `flex` is applied.
   - `justify-between`: Space between items along the main axis, provided the class `flex` is applied.
   - `p-24`: Applies padding of 24 units.

### Potential Issues:
- With the `flex` class removed, the `flex-col`, `items-center`, and `justify-between` classes won't have any effect because they require a flex container. This might break the intended layout.
- If the intention was to keep the flexbox properties, it's essential to retain the `flex` class.

### Recommendation:
If the removal of the `flex` class was unintentional, I recommend restoring it to ensure the flex properties are applied as intended:
```jsx
<main className="flex min-h-screen flex-col items-center justify-between p-24">
```

If the removal was intentional, you might need to adjust the layout logic correspondingly.

### Conclusion:
Ensure that removing the `flex` class aligns with the updated layout requirements. If not, it's better to retain it to preserve the intended flexbox layout properties.
**/
