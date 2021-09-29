<template>
  <tr class="font-weight-bold">
    <td colspan="6" class="text-right">{{ title }}</td>
    <td colspan="2">{{ value }}</td>
  </tr>
</template>

<script>
  export default {
    props: ['title', 'value'],
  };
</script>
