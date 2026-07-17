<script setup>
import { ref, computed } from 'vue'
import { useLocaleStore } from '@/stores/localeStore'
import ProfileHeader from './ProfileHeader.vue'
import EducationItem from './EducationItem.vue'
import cvData from '@/data/cv-data.json'
import WorkExperienceItem from './WorkExperienceItem.vue'

const localeStore = useLocaleStore()
const birthdate = new Date(2001, 3, 17) // April 17, 2001 3 is the month index starting at 0
const today = new Date()
let age = ref(today.getFullYear() - birthdate.getFullYear())

// Adjust age if the current date has not passed the birthdate in the current year
if (today.getMonth() < birthdate.getMonth() || (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate())) {
  age.value--
}

const currentLocale = computed(() => localeStore.currentLocale)

// Computed property to get the localized education data
const educationData = computed(() => {
  return cvData[currentLocale.value]?.education || []
})

// Computed property to get the localized work experience data
const experienceData = computed(() => {
  return cvData[currentLocale.value]?.workExperience || []
})

// Computed property to get skills data
const skillsData = computed(() => {
  return cvData[currentLocale.value]?.skills || {}
})

// Computed property to get certifications data
const certificationsData = computed(() => {
  return cvData[currentLocale.value]?.certifications || []
})

// Computed property to get summary
const summary = computed(() => {
  return cvData[currentLocale.value]?.summary || ''
})

// Computed property to get tech stack
const techStack = computed(() => {
  return cvData[currentLocale.value]?.techStack || []
})

// Download CV function
const downloadCV = () => {
  const link = document.createElement('a')
  link.href = `/pdf/CV_basudev_rout_${localeStore.currentLocale}.pdf`
  link.download = `CV_basudev_rout_${localeStore.currentLocale}.pdf`
  link.click()
}
</script>

<template>
  <div class="relative right-0 h-content-window overflow-hidden">
    <div class="w-full h-full bg-white overflow-auto p-3">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Left Column: Education & Experience (2/3 width) -->
        <div class="lg:col-span-2">
          <ProfileHeader :age="age" />

          <!-- Professional Summary -->
          <section v-if="summary" class="mt-5 p-2 bg-gray-50 border-2 border-gray-300">
            <h2 class="font-trebuchet-pixel underline text-sm font-bold mb-2">Professional Summary</h2>
            <p class="font-trebuchet-pixel text-xs leading-relaxed">{{ summary }}</p>
          </section>

          <!-- Education Section -->
          <section class="mt-5">
            <h2 class="font-trebuchet-pixel underline text-sm font-bold">{{ $t('windows.cv.education') }}</h2>
            <EducationItem v-for="(education, index) in educationData" :key="index" :education="education" />
          </section>

          <!-- Work Experience Section -->
          <div class="mt-3">
            <h2 class="font-trebuchet-pixel mt-5 underline text-sm font-bold">{{ $t('windows.cv.proExperience') }}</h2>
            <WorkExperienceItem v-for="(workExperience, index) in experienceData" :key="index" :workExperience="workExperience" />
          </div>

          <!-- Skills Section -->
          <section v-if="skillsData && Object.keys(skillsData).length > 0" class="mt-5">
            <h2 class="font-trebuchet-pixel underline text-sm font-bold">Technical Skills</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div v-if="skillsData.databases" class="p-2 bg-blue-50 border border-blue-200">
                <h4 class="font-trebuchet-pixel text-xs font-bold underline">Databases</h4>
                <p class="font-trebuchet-pixel text-xs">{{ skillsData.databases.join(' • ') }}</p>
              </div>
              <div v-if="skillsData.systemAdmin" class="p-2 bg-blue-50 border border-blue-200">
                <h4 class="font-trebuchet-pixel text-xs font-bold underline">System Admin</h4>
                <p class="font-trebuchet-pixel text-xs">{{ skillsData.systemAdmin.join(' • ') }}</p>
              </div>
              <div v-if="skillsData.webDevelopment" class="p-2 bg-blue-50 border border-blue-200">
                <h4 class="font-trebuchet-pixel text-xs font-bold underline">Web Development</h4>
                <p class="font-trebuchet-pixel text-xs">{{ skillsData.webDevelopment.join(' • ') }}</p>
              </div>
              <div v-if="skillsData.tools" class="p-2 bg-blue-50 border border-blue-200">
                <h4 class="font-trebuchet-pixel text-xs font-bold underline">Tools & Platforms</h4>
                <p class="font-trebuchet-pixel text-xs">{{ skillsData.tools.join(' • ') }}</p>
              </div>
              <div v-if="skillsData.soft" class="p-2 bg-blue-50 border border-blue-200 md:col-span-2">
                <h4 class="font-trebuchet-pixel text-xs font-bold underline">Soft Skills</h4>
                <p class="font-trebuchet-pixel text-xs">{{ skillsData.soft.join(' • ') }}</p>
              </div>
            </div>
          </section>

          <!-- Certifications Section -->
          <section v-if="certificationsData && certificationsData.length > 0" class="mt-5 p-3 bg-yellow-50 border-2 border-yellow-400">
            <h2 class="font-trebuchet-pixel underline text-sm font-bold mb-2">🏆 Certifications</h2>
            <div v-for="(cert, index) in certificationsData" :key="index" class="mt-2 mb-2">
              <h4 class="font-trebuchet-pixel text-xs font-bold text-yellow-900">{{ cert.title }}</h4>
              <p class="font-trebuchet-pixel text-xs text-yellow-800">{{ cert.credential }}</p>
              <p class="font-trebuchet-pixel text-xs text-yellow-700">{{ cert.issuer }} | {{ cert.year }}</p>
            </div>
          </section>
        </div>

        <!-- Right Column: Tech Stack (1/3 width) -->
        <div v-if="techStack && techStack.length > 0" class="lg:col-span-1">
          <div class="sticky top-0 p-3 bg-gradient-to-b from-blue-100 to-blue-50 border-2 border-blue-300 rounded">
            <h2 class="font-trebuchet-pixel underline text-sm font-bold text-center mb-3 text-blue-900">Tech Stack</h2>

            <!-- Tech Stack Icons Grid -->
            <div class="grid grid-cols-2 gap-2">
              <div v-for="(tech, index) in techStack" :key="index"
                   class="flex flex-col items-center justify-center p-2 bg-white border-2 border-blue-200 rounded hover:bg-blue-50 transition-colors cursor-pointer group">
                <div class="text-3xl mb-1 group-hover:scale-110 transition-transform">{{ tech.icon }}</div>
                <p class="font-trebuchet-pixel text-xs text-center font-bold text-blue-900">{{ tech.name }}</p>
                <p class="font-trebuchet-pixel text-xxs text-blue-600 text-center">{{ tech.category }}</p>
              </div>
            </div>

            <!-- DBA Skills Highlight -->
            <div class="mt-4 p-2 bg-red-50 border-2 border-red-300 rounded">
              <h3 class="font-trebuchet-pixel text-xs font-bold text-red-900 mb-2 underline">DBA Expertise</h3>
              <ul class="font-trebuchet-pixel text-xs text-red-800 space-y-1">
                <li>✓ Database Design & Architecture</li>
                <li>✓ Performance Tuning</li>
                <li>✓ Backup & Recovery</li>
                <li>✓ Security & Auditing</li>
                <li>✓ High Availability</li>
                <li>✓ Automation & Scripting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Button - Windows XP Style -->
    <button
      @click="downloadCV"
      class="absolute bottom-2 right-1 md:right-4 h-7 px-4 text-xxs font-trebuchet-pixel bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-blue-800 rounded cursor-pointer hover:from-blue-500 hover:to-blue-700 active:from-blue-600 active:to-blue-800 text-white font-bold shadow-md hover:shadow-lg transition-all"
    >
      📥 {{ $t('buttons.downloadCV') }}
    </button>
  </div>
</template>
