<template>
    <span>{{ numberWithCommas(value) }}</span>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CommaValue',
  props: {
    value: {
        // can be a number or a string
        type: [Number, String],
      required: true,
      default: 0,
    },
  },
  setup(_props) {
    const numberWithCommas = (x) => {
        if (x === null || x === undefined) return '0';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    return { numberWithCommas };
  },
});

</script>