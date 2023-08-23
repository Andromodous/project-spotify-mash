module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// With Tailwind, you style elements by applying pre-existing classes directly in your HTML.
// You aren’t wasting energy inventing class names
// Your CSS stops growing. Using a traditional approach, your CSS files get bigger every time
// Making changes feels safer. Classes in your HTML are local, so you can change them without worrying about something else breaking
// Tailwind’s state variants make it easy to style those states with utility classes. (Hover or Focus)
// Every utility class in Tailwind can be applied conditionally by adding a modifier to the beginning of the class name that describes the condition you want to target.
// e.g. For example, to apply the bg-sky-700 class on hover, use the hover:bg-sky-700 class:
// if you want to add multiple styles to acondition hover:bg-violet-600 hover:ring
//<div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
