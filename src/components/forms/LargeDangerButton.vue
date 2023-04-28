<template>
  <component
    :is="$attrs.href ? 'a' : 'button'"
    class="flex items-center justify-center gap-3 px-8 py-3 h-16 rounded-2xl bg-red-500 border-b-4 active:border-b-0 active:border-t-4 border-red-800 text-black shadow-xl shadow-red-600/40 font-medium text-lg transition-all ease-in-out"
  >
    <slot />
  </component>
</template>
