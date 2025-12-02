<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
// Available locales and their display names
const availableLocales = ['en', 'fr', 'hi', 'or']
const localeNames = {
  en: 'English',
  fr: 'Français',
  hi: 'हिन्दी',
  or: 'ଓଡ଼ିଆ'
}

const props = defineProps({
  currentLocale: {
    type: String,
    default: 'en'
  }
})

// Function to get the flag source based on the locale
const getFlagSrc = (loc) => {
  return `/img/icons/langs/flag-${loc}.webp`
}

const otherLocales = computed(() => availableLocales.filter(l => l !== props.currentLocale))

const handleLanguageSwitch = (newLocale) => {
  localStorage.setItem('currentLocale', newLocale)
  locale.value = newLocale
  location.reload()
}
</script>

<template>
  <section class="absolute bottom-10 right-5 md:right-12 w-36 rounded-t-md overflow-hidden bg-window-blue-deactivated p-0.5">
    <div class="absolute top-0 left-0 h-7 w-full z-10 flex items-center px-1.5 bg-header-window-active">
      <img :src="getFlagSrc(props.currentLocale)" :alt="$t('common.icon') + ' flag'" class="w-4 h-3 mr-1" />
      <h4 class="text-header-window text-header-shadow truncate">{{ $t('common.language') }}</h4>
    </div>
    <div class="bg-light-yellow h-auto mt-3 pr-1">
      <div class="h-full w-full flex flex-col items-start px-2 pt-3 space-y-2">
        <div
          v-for="loc in otherLocales"
          :key="loc"
          @click="handleLanguageSwitch(loc)"
          class="flex items-center cursor-pointer w-full"
        >
          <img :src="getFlagSrc(loc)" :alt="localeNames[loc] + ' flag'" class="w-5 h-4 mr-2" />
          <label class="text-black text-xs font-trebuchet-pixel pr-4 cursor-pointer">{{ localeNames[loc] }}</label>
        </div>
      </div>
    </div>
  </section>
</template>
