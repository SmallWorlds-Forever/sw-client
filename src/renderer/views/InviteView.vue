<template>
  <Invite @triggerSnackbar="triggerSnackbar" />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Invite from '@/components/Invite.vue';
import { useMeta } from 'vue-meta';
export default defineComponent({
  name: 'InviteView',
  setup () {
    useMeta({ title: 'Join' })
  },
  components: {
    Invite,
  },
  methods: {
    triggerSnackbar(data) {
      this.$emit('triggerSnackbar', data);
    },
  },
});
</script>
