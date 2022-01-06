<script setup lang="ts">
import { ref, onMounted } from 'vue';
import broswer from 'webextension-polyfill';
import InputSwitch from './components/InputSwitch.vue';

const copy = ref(false);
const saveOptions = () => broswer.storage.sync
  .set({
    copy: copy.value,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Options saved');
  });

const restoreOptions = () => broswer.storage.sync
  .get({
    copy: false,
  })
  .then(({ copy: v }) => {
    copy.value = v;
  });

onMounted(() => {
  restoreOptions();
});
</script>

<template>
  <InputSwitch
    v-model="copy"
    label="Copy to clipboard instead of download (Need restart)"
    @change="saveOptions"
  />
</template>
