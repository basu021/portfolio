<template>
  <div class="relative right-0 h-content-headless-toolbox overflow-hidden">
    <div class="w-full h-full bg-white overflow-auto font-trebuchet-pixel">
      <div v-if="days.length">
        <div class="flex w-full justify-between">
          <button @click="previousMonth" class="text-heroic-blue underline font-semibold px-2 mr-2"><</button>
          <h2 class="text-center font-trebuchet-pixel py-2 capitalize">{{ currentMonthName }} {{ currentYear }}</h2>
          <button @click="nextMonth" class="text-heroic-blue underline font-semibold px-2 mr-2">></button>
        </div>
        <div class="grid grid-cols-7 text-center text-xs font-semibold mb-1">
          <div v-for="(label, i) in weekdayLabels" :key="label" :class="i === 0 ? 'text-red-600' : ''">
            {{ label }}
          </div>
        </div>
        <div class="grid grid-cols-7">
          <div
            v-for="(day, index) in days"
            :key="index"
            :class="[
              'border px-1 py-2',
              day.date ? '' : 'bg-gray-50 text-gray-400',
              day.date && isCurrentDate(day.date) ? 'bg-light-yellow border-amber-400' : '',
              day.date && isRedDate(day.date) ? 'bg-red-100 text-red-600 font-bold  ring-1 ring-red-200' : ''
            ]"
          >
            <div
              v-if="day.date"
              class="font-bold text-sm"
              :class="day.date && isRedDate(day.date) ? '!text-red-600' : ''"
            >
              {{ day.date.getDate() }}
            </div>
            <div v-else class="font-bold text-sm">&nbsp;</div>
            <ul v-if="day.date">
              <li v-for="event in day.events" :key="event.summary" class="min-h-16">
                <h4
                  class="font-trebuchet-pixel font-semibold text-xs leading-none md:text-sm py-1 md:py-0.5 bg-black rounded-sm text-white md:px-1 px-0.5 md:my-1.5 my-1"
                >
                  {{ event.summary }}
                </h4>
                <div class="flex gap-1">
                  <div class="md:block hidden w-4 h-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
                      <path
                        fill="#000000"
                        d="M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12m0 7.35q3.05-2.8 4.525-5.087T18 10.2q0-2.725-1.737-4.462T12 4T7.738 5.738T6 10.2q0 1.775 1.475 4.063T12 19.35M12 22q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22m0-12"
                      />
                    </svg>
                  </div>
                  <p class="text-xxs font-trebuchet-pixel leading-snug md:truncate">{{ event.location }}</p>
                </div>
              </li>
              <li v-if="day.events.length === 0 && !isWeekend(day.date)" class="min-h-16"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLocaleStore } from '@/stores/localeStore'
import { parseICS } from './icsParser'

const localeStore = useLocaleStore()

const events = ref([])
const days = ref([])
const currentMonthName = ref('')
const currentYear = ref('')
const weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const now = new Date()
const currentMonth = ref(now.getMonth())
const currentYearValue = ref(now.getFullYear())
const currentDay = ref(now.getDate())

const redDatesSet = ref(new Set())

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function formatDateISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function isRedDate(date) {
  if (!date) return false
  return redDatesSet.value.has(formatDateISO(date))
}

async function fetchRedDates() {
  try {
    const resp = await fetch('/calendar/red-dates-2026.json')
    if (!resp.ok) throw new Error('Failed to load red-dates JSON')
    const data = await resp.json()
    redDatesSet.value = new Set(Array.isArray(data) ? data : [])
  } catch (err) {
    console.error('Error fetching red dates JSON:', err)
  } finally {
    // Recalculate to ensure the UI updates with red-date classes
    calculateDaysOfMonth(currentYearValue.value, currentMonth.value)
  }
}

onMounted(() => {
  fetchRedDates()
  fetchEvents()
  calculateDaysOfMonth(currentYearValue.value, currentMonth.value)
})

watch(
  () => localeStore.currentLocale,
  (newLocale) => {
    fetchEvents()
  }
)

async function fetchEvents() {
  const icsFile = '/calendar/calendar-' + localeStore.currentLocale + '.ics'

  try {
    const response = await fetch(icsFile)
    if (!response.ok) {
      throw new Error('An unexpected error occurred while fetching the calendar file')
    }
    const icsData = await response.text()
    events.value = parseICS(icsData)
    calculateDaysOfMonth(currentYearValue.value, currentMonth.value) // Recalculate days after fetching events
  } catch (error) {
    console.error('Error fetching the ICS file:', error)
  }
}

function calculateDaysOfMonth(year, month) {
  currentMonthName.value = new Date(year, month).toLocaleString(localeStore.currentLocale, { month: 'long' })
  currentYear.value = year

  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  days.value = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.value.push({ date: null, events: [] })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayEvents = events.value.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day
    })
    days.value.push({ date, events: dayEvents })
  }

  while (days.value.length % 7 !== 0) {
    days.value.push({ date: null, events: [] })
  }
}

function isWeekend(date) {
  if (!date) return false
  const day = date.getDay()
  return day === 0 || day === 6
}

function isCurrentDate(date) {
  if (!date) return false
  const today = new Date()
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYearValue.value--
  } else {
    currentMonth.value--
  }
  calculateDaysOfMonth(currentYearValue.value, currentMonth.value)
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYearValue.value++
  } else {
    currentMonth.value++
  }
  calculateDaysOfMonth(currentYearValue.value, currentMonth.value)
}
</script>
