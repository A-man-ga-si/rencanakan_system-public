<template>
  <nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
      <a
        href="#"
        class="menu-button d-none d-md-block"
        @click.prevent.stop="
          changeSideMenuStatus({
            step: menuClickCount + 1,
            classNames: menuType,
            selectedMenuHasSubItems,
          })
        "
      >
        <menu-icon />
      </a>
      <a
        href="#"
        class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        @click.prevent.stop="changeSideMenuForMobile(menuType)"
      >
        <mobile-menu-icon />
      </a>
      <!-- <div class="d-inline-block">
        <b-dropdown
          id="langddm"
          class="ml-2"
          variant="light"
          size="sm"
          toggle-class="language-button"
        >
          <template slot="button-content">
            <span class="name">{{ $i18n.locale.toUpperCase() }}</span>
          </template>
          <b-dropdown-item
            v-for="(l, index) in localeOptions"
            :key="index"
            @click="changeLocale(l.id, l.direction)"
          >
            {{ l.name }}
          </b-dropdown-item>
        </b-dropdown>
      </div> -->
    </div>
    <router-link class="navbar-logo" :to="adminRoot">
      <b-img src="/assets/logos/rencanakan-logo-min.png" fluid></b-img>
    </router-link>

    <div class="navbar-right">
      <div class="user d-inline-block">
        <b-dropdown
          class="dropdown-menu-right"
          right
          variant="empty"
          toggle-class="p-0"
          menu-class="mt-3"
          no-caret
        >
          <template slot="button-content">
            <h5 class="name mr-1 d-inline-block">
              {{ currentUser ? currentUser.title : '' }}
            </h5>
            <span>
              <img
                :alt="currentUser ? currentUser.title : ''"
                :src="profileImage"
              />
            </span>
          </template>
          <b-dropdown-item :to="{ name: 'Account' }"> Account </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="userLogout">Log out</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
  import Switches from 'vue-switches';

  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { MenuIcon, MobileMenuIcon } from '@/components/Svg';
  import {
    searchPath,
    menuHiddenBreakpoint,
    localeOptions,
    buyUrl,
    adminRoot,
  } from '@/constants/config';
  import {
    getDirection,
    setDirection,
    getThemeColor,
    setThemeColor,
  } from '@/utils';
  import { apiDomain } from '@/constants/config';

  export default {
    components: {
      'menu-icon': MenuIcon,
      'mobile-menu-icon': MobileMenuIcon,
      switches: Switches,
    },
    data() {
      return {
        searchKeyword: '',
        isMobileSearch: false,
        isSearchOver: false,
        fullScreen: false,
        menuHiddenBreakpoint,
        searchPath,
        localeOptions,
        buyUrl,
        isDarkActive: false,
        adminRoot,
        apiDomain,
      };
    },
    methods: {
      ...mapMutations([
        'changeSideMenuStatus',
        'changeSideMenuForMobile',
        'clearRabs',
      ]),
      ...mapActions(['setLang', 'logout']),
      changeLocale(locale, direction) {
        const currentDirection = getDirection().direction;
        if (direction !== currentDirection) {
          setDirection(direction);
        }

        this.setLang(locale);
      },
      userLogout() {
        this.clearRabs();
        this.logout().then(() => {
          this.$router.push({
            name: 'Login',
          });
        });
      },

      toggleFullScreen() {
        const isInFullScreen = this.isInFullScreen();

        var docElm = document.documentElement;
        if (!isInFullScreen) {
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
          } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
        this.fullScreen = !isInFullScreen;
      },
      isInFullScreen() {
        return (
          (document.fullscreenElement && document.fullscreenElement !== null) ||
          (document.webkitFullscreenElement &&
            document.webkitFullscreenElement !== null) ||
          (document.mozFullScreenElement &&
            document.mozFullScreenElement !== null) ||
          (document.msFullscreenElement &&
            document.msFullscreenElement !== null)
        );
      },
    },
    computed: {
      ...mapGetters({
        currentUser: 'currentUser',
        menuType: 'getMenuType',
        menuClickCount: 'getMenuClickCount',
        selectedMenuHasSubItems: 'getSelectedMenuHasSubItems',
      }),
      profileImage() {
        return this.currentUser?.img
          ? `${apiDomain}/storage/uploads/users/profile-photo/${this.currentUser.img}`
          : `${apiDomain}/assets/images/default-profile-picture.svg`;
      },
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleDocumentforMobileSearch);
    },
    created() {
      const color = getThemeColor();
      this.isDarkActive = color.indexOf('dark') > -1;
    },
    watch: {
      '$i18n.locale'(to, from) {
        if (from !== to) {
          this.$router.go(this.$route.path);
        }
      },
      isDarkActive(val) {
        let color = getThemeColor();
        let isChange = false;
        if (val && color.indexOf('light') > -1) {
          isChange = true;
          color = color.replace('light', 'dark');
        } else if (!val && color.indexOf('dark') > -1) {
          isChange = true;
          color = color.replace('dark', 'light');
        }
        if (isChange) {
          setThemeColor(color);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      },
    },
  };
</script>
