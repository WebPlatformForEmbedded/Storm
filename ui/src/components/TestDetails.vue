<template>
  <div>
    <h4 class="text-lg text-dark-blue mb-4">{{ test.title }}</h4>
    <p class="text-dark-grey italic">{{ test.description }}</p>
    <ul class="list-reset mt-8">
      <li v-for="(step, index) in test.steps" class="py-2 border-b text-base">
        <div class="flex w-full pl-2">
          <div class="w-12">
            <span
              class="rounded-full h-6 w-6 flex items-center justify-center bg-white border border-light-grey text-dark-blue text-sm font-bold"
            >
              {{ index + 1 }}
            </span>
          </div>
          <div>
            <div class="text-dark-grey mt-1 mb-2 text-sm font-bold">{{ step.description }}</div>
            <div v-if="step.timeout" class="my-1 text-black text-sm flex leading-normal">
              <label class="w-16">Timeout:</label>
              <span class="font-bold text-dark-grey">{{ step.timeout }}</span>
            </div>

            <div v-if="step.sleep" class="my-1 text-black text-sm flex">
              <label class="w-16">Sleep:</label>
              <span class="font-bold text-dark-grey">{{ step.sleep }}</span>
            </div>

            <div v-if="step.params" class="my-1 text-black text-sm flex">
              <label class="w-16">Params:</label>
              <span
                class="font-bold text-dark-grey"
                v-html="Array.isArray(step.params) ? step.params.join('<br />') : step.params"
              />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TestDetails',
  props: {
    test: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style></style>
