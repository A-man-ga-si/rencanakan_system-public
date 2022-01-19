<template>
  <footer class="page-footer">
    <div class="footer-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-sm-6">
            <p class="mb-0 text-muted">
              <span v-html="copyrightSymbol"></span>
              {{ `${year} ${copyrightBy}` }}
            </p>
          </div>
          <div class="col-sm-6 d-none d-sm-block">
            <ul class="breadcrumb pt-0 pr-0 float-right">
              <li class="breadcrumb-item mb-0">
                <a :href="landingPageUrl" target="_blank" class="btn-link"
                  >Rencanakan.id</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
  import { landingPageUrl } from '@/constants/config';

  export default {
    data: () => ({
      copyrightBy: 'rencanakan.id',
      copyrightSymbol: '&copy',
      landingPageUrl: landingPageUrl || '#',
    }),
    computed: {
      year() {
        return new Date().getFullYear();
      },
    },
  };
</script>
