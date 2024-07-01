<template>
  <div id="app-container" :class="getMenuType">
    <topnav />
    <sidebar />
    <main>
      <div class="container-fluid">
        <slot></slot>
      </div>
    </main>
    <footer-component />
    <a
      class="whatsapp-button"
      href="https://wa.me/081936000388"
      target="_blank"
    >
      <WhatsappIcon class="whatsapp-icon"/>
    </a>
  </div>
</template>

<script>
  import Sidebar from '../containers/navs/Sidebar';
  import Topnav from '../containers/navs/Topnav';
  import Footer from '../containers/navs/Footer';
  import { mapGetters } from 'vuex';
  import { WhatsappIcon } from '../components/Svg'

  export default {
    components: {
      topnav: Topnav,
      sidebar: Sidebar,
      'footer-component': Footer,
      WhatsappIcon
    },
    data() {
      return {
        show: false,
      };
    },
    computed: {
      ...mapGetters(['getMenuType']),
    },
    mounted() {
      setTimeout(() => {
        document.body.classList.add('default-transition');
      }, 100);
    }
  };
</script>

<style scoped>
  .whatsapp-button {
    display: flex;
    position: fixed;
    bottom: 48px;
    right: 48px;
    z-index: 999;
    width: 64px;
    height: 64px;
    background-color: #3ec04f;
    border: 0;
    border-radius: 74px;
  }

  .whatsapp-icon {
    margin: auto;
    width: 42px;
    height: 42px
  }

  @media only screen and (max-width: 600px) {
    .whatsapp-button {
      right: 24px;
      bottom: 24px;
    }
  }
</style>
