/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,js}",
    "./static/**/*.{js,css}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Basic layout
    'container', 'mx-auto', 'px-4', 'px-6', 'py-3', 'py-8', 'py-12', 'py-16',
    'flex', 'flex-col', 'flex-row', 'items-center', 'justify-center', 'justify-between',
    'space-x-4', 'space-x-8', 'space-y-2', 'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
    'gap-8', 'md:flex', 'md:flex-row', 'md:grid-cols-3', 'md:w-1/2', 'max-w-4xl', 'max-w-full',
    'max-w-2xl', 'h-auto', 'h-screen', 'min-h-screen', 'w-6', 'h-6', 'w-10', 'h-10',
    
    // Backgrounds and colors
    'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-500', 'bg-gray-800',
    'bg-green-50', 'bg-green-600', 'bg-gradient-to-b', 'from-green-50', 'to-green-100',
    'text-white', 'text-gray-400', 'text-gray-600', 'text-gray-700', 'text-gray-800',
    'text-green-50', 'text-green-100', 'text-green-400', 'text-green-600', 'text-green-800',
    'border-green-600', 'border-gray-700', 'border-t',
    
    // Typography
    'font-sans', 'font-bold', 'font-medium', 'font-semibold',
    'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl',
    'leading-tight', 'leading-relaxed',
    
    // Spacing and sizing
    'p-6', 'p-8', 'mb-2', 'mb-4', 'mb-6', 'mb-8', 'mb-10', 'mb-12', 'mt-10', 'pt-8',
    
    // Borders and effects
    'rounded', 'rounded-lg', 'rounded-xl', 'shadow-md', 'shadow-lg', 'shadow-2xl',
    'border', 'border-t',
    
    // Interactive elements
    'hover:bg-green-50', 'hover:bg-green-700', 'hover:text-green-600', 'hover:text-white',
    'hover:shadow-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500',
    'focus:ring-white', 'focus:ring-opacity-50', 'transition', 'duration-300',
    
    // Responsive design
    'hidden', 'md:hidden', 'md:flex', 'md:mb-0', 'md:w-1/2', 'md:grid-cols-3', 'md:flex-row',
    'md:text-5xl'
  ]
}