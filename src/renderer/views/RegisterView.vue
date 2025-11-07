<template>
  <RegisterC />
</template>
<script>
import { defineComponent } from 'vue';
import RegisterC from '../components/RegisterC.vue';
export default defineComponent({
  name: 'RegisterView',
  components: {
    RegisterC,
  }, 
});
</script>