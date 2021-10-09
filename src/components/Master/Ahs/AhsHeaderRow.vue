<template>
  <tr class="bg-primary">
    <th :colspan="value == null ? 8 : 6">
      {{ title }}
      <i
        v-if="tooltip != null"
        @click.prevent
        class="text-white ml-1 iconsminds simple-icon-question"
        v-b-popover.hover="tooltip"
      />
    </th>
    <td v-if="value != null" colspan="2">{{ value }}</td>
  </tr>
</template>

<script>
  export default {
    props: ['title', 'value', 'tooltip'],
  };
</script>
