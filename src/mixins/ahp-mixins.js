import { formatCurrency } from '@/utils';

// prettier-ignore
const numericTypeColumns = ['H', 'I', 'J', 'K', 'L', 'M', 'P', 'S', 'C', 'D', 'E', 'F', 'G'];

export default {
  methods: {
    formatAhpNumerics(ahpItem) {
      // Make copy of ahpItem to remap as fixed floating point
      // prettier-ignore
      for (const d in ahpItem) {
        /**
         * Because ahpItem is also content String value (e.g name, code created_at, updated_at)
         * So it need to check if d is number
         */
        if (typeof ahpItem[d] == 'number') {
          // Convert to float and make it fixed by 2 numbers after decimal
          ahpItem[d] = Number.parseFloat(ahpItem[d]).toFixed(2);

          if (numericTypeColumns.includes(d)) {
            ahpItem[d] = formatCurrency(ahpItem[d]);
          }
        }
      }
      return ahpItem;
    },
    tooltipReplacer(ahpItem, tooltip = '') {
      tooltip = tooltip.replace(/<%p%>/g, ahpItem.p);
      tooltip = tooltip.replace(/<%pbb%>/g, ahpItem.pbb);
      tooltip = tooltip.replace(/<%ppl%>/g, ahpItem.ppl);
      tooltip = tooltip.replace(/<%pbk%>/g, ahpItem.pbk);
      tooltip = tooltip.replace(/<%ppp%>/g, ahpItem.ppp);
      return tooltip;
    },
  },
};
