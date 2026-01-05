<script setup lang="ts">
import type { FormItem } from '../../../types'
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import { CalendarDate, CalendarDateTime, type DateValue } from '@internationalized/date'

const props = defineProps({
  formItem: {
    type: Object as PropType<FormItem>,
    default: () => ({}),
  },
})

const model = defineModel<string>({ default: '' })
const inputDate = ref()

// Convert string to CalendarDate/CalendarDateTime for the UInputDate component
const dateValue = computed<DateValue | undefined>({
  get() {
    if (!model.value) return undefined
    try {
      const date = new Date(model.value)
      if (Number.isNaN(date.getTime())) return undefined
      return props.formItem.type === 'date' ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) : new CalendarDateTime(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
    }
    catch {
      return undefined
    }
  },
  set(value: DateValue | undefined) {
    if (!value) {
      model.value = ''
      return
    }
    model.value = value.toString()
  },
})
</script>

<template>
  <UInputDate
    ref="inputDate"
    v-model="dateValue"
    size="xs"
    class="w-full"
    :granularity="$props.formItem?.type === 'date' ? 'day' : 'minute'"
  >
    <template #trailing>
      <UPopover
        v-if="$props.formItem?.type === 'date'"
        :reference="inputDate?.inputsRef?.[3]?.$el"
      >
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          icon="i-lucide-calendar"
          :aria-label="$t('studio.form.date.selectDate')"
          class="px-0"
        />

        <template #content>
          <UCalendar
            v-model="dateValue"
            class="p-2"
          />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
