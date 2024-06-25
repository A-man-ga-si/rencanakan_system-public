import { midtransClientKey, midtransModuleUrl } from "../constants/config";

export default {
  mounted() {
    const midtransScriptEl = document.createElement('script');
    midtransScriptEl.setAttribute('src', midtransModuleUrl)
    midtransScriptEl.setAttribute('data-client-key', midtransClientKey)
    document.head.appendChild(midtransScriptEl)
  }
}