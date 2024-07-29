<template>
  <div style="position: relative; width: 100%;">
    <button
      class="btn ahs-select"
      @click="showDropdown()"
      :class="{'active': isShowing}"
      :disabled="isDisabled"
    >
      <div style="white-space: nowrap; overflow: hidden;">{{ this.selectedAhsLabel }}</div>
      <div style="width: 16px; height: 16px; margin-left: auto; padding-left: 8px; padding-right: 8px;">
        <chevron-down style="fill: #d7d7d7; width: 9px; height: 9px; margin-top: 4px;"/>
      </div>
      
    </button>
    <div
      class="ahs-dropdown"
      :class="{'d-none': !isShowing, 'd-flex': isShowing}"
    >
      <div style="border-right: 1px solid #d7d7d7; width: 150px;">
        <div
          v-for="ahsGroupItem in ahsGroupItems"
          class="ahs-group-item"
          :key="ahsGroupItem.key"
          :class="{ 'selected': ahsGroupItem.key == selectedGroupKey }"
          @click="onSelectAhsGroup(ahsGroupItem.key)"
        >
          <span>{{ ahsGroupItem.title }}</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; overflow-y: hidden; overflow-x: hidden; width: 400px;">
        <div style="display: flex; margin: 16px; padding-left: 8px; padding-right: 8px; margin-bottom: 8px; border: 1px solid #d7d7d7 !important; width: 300px;">
            <input
              type="text"
              style="height: 35px; width: 100%; border: none;"
              placeholder="Cari Kode/ Nama AHS"
              v-model="form.searchQuery"
              @input="handleSearchInputChange"
            >
            <i
              class="simple-icon-magnifier"
              style="margin-top: auto; margin-bottom: auto; width: 12px; height: 10px; margin-left: 8px;"
            />
        </div>

        <div
          v-if="isShowCustomAhsEmptyState"
          style="display: flex; flex-direction: column; width: 100%;; text-align: center; margin-top: 24px;"
        >
          <span style="margin-bottom: 8px;">Belum Ada AHS Project</span>
          <b-button
            id="addAhsGroupButton"
            variant="primary"
            style="display: block; margin-left: auto; margin-right: auto;" @click="onClickAddNewAhsProject()"
          >
            Tambah dari Grup AHS
          </b-button>
        </div>
        
        <div class="ahs-list-container">
          <div class="ahs-scroll-container">
            <div v-if="ahsItems != null">
              <div
                v-for="ahsItem in ahsItems"
                class="ahs-item"
                :key="ahsItem.key"
                @click="onSelectAhsItem(ahsItem)"
              >
                {{ ahsItem.label }}
              </div>
            </div>

            <div v-else>
              <div style="padding-left: 16px; padding-right: 16px;">
                <RcnShimmerView
                  v-for="index in 10" :key="index"
                  style="height: 35px; margin-top: 16px; margin-bottom: 16px;"
                />
              </div>
            </div>
          </div>

          <div class="reset-button-container">
            <button
              class="btn reset-button"
              @click="onClickResetButton"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ChevronDown } from '@/components/Svg';
  import RcnShimmerView from './ShimmerView.vue';
  import { AHSGroupReference } from '@/constants/enums.js';

  export default {
    props: {
      isDisabled: {
        type: Boolean,
        default: false
      },
      selectedGroupKey: {
        type: String,
        default: null
      },
      searchQuery: {
        type: String,
        default: ''
      },
      selectedAhs: {
        type: Object,
        default: null
      },
      ahsGroupItems: {
        type: Array,
        default: null
      },
      ahsItems: {
        type: Array,
        default: null
      },
      onChangeAhsGroup: {
        type: Function
      },
      onSelect: {
        type: Function
      }
    },
    data() {
      return {
        isShowing: false,
        timeout: null,
        form: {
          searchQuery: ''
        },
        ahsGroups: [
          {
            key: null,
            title: 'AHS Project'
          },
          {
            key: 'reference',
            title: 'Permen PUPR 2016'
          },
          {
            key: 'reference-2023',
            title: 'Permen PUPR 2023'
          }
        ],
        onClickOutside: () => { return }
      };
    },
    computed: {
      selectedAhsLabel() {
        if (this.selectedAhs == null) {
          return '-';
        }
        return this.selectedAhs.label;
      },
      isShowCustomAhsEmptyState() {
        if (this.ahsItems == null) {
          return false;
        }
        return this.ahsItems.length == 0
          && this.selectedGroupKey == AHSGroupReference.ahsProject
      }
    },
    methods: {
      showDropdown() {
        this.isShowing = !this.isShowing;
        this.onClickOutside = (e) => {
          if (!this.$el.contains(e.target) && e.target.id != 'addAhsGroupButton'){
            document.removeEventListener('click', this.onClickOutside);
            this.dismiss();
          }
        }
        document.addEventListener('click', this.onClickOutside);
        this.$emit('on-show-popup');
      },
      dismiss() {
        this.isShowing = false;
        this.$emit('on-dismiss');
      },
      onSelectAhsGroup(key) {
        this.$emit('on-change-ahs-group', key);
      },
      handleSearchInputChange() {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.$emit('on-change-search-input', this.form.searchQuery);
        }, 500);
      },
      onSelectAhsItem(ahsItem) {
        this.onSelect(this.selectedGroupKey, ahsItem);
        this.dismiss();
      },
      onClickResetButton() {
        this.$emit('on-click-reset-button');
        this.dismiss();
      },
      onClickAddNewAhsProject() {
        this.$emit('on-change-ahs-group', 'reference');
      },
    },
    watch: {
      searchQuery(newValue, _) {
        this.form.searchQuery = newValue;
      }
    },
    components: {
      ChevronDown,
      RcnShimmerView
    },
  };
</script>

<style scoped>
  .ahs-select {
    display:flex;
    padding: 8px;
    border: 1px solid #d7d7d7;
    width: 100%;
    border-radius: 0px;
    text-align: left;
  }

  .ahs-select:disabled {
    background-color: #E9EAEE;
  }

  .ahs-select.active svg{
    transform:  translateX(-50%) translateY(-50%) rotate(-180deg); transform-origin: center;
  }

  .ahs-dropdown {
    background-color: white;
    border: 1px solid #d7d7d7;
    height: 250px;
    position: absolute;
    top: 42px;
    white-space: nowrap;
    z-index: 1;
  }

  .ahs-dropdown .ahs-item {
    cursor: pointer;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 16px;
    padding-right: 16px;
    white-space: normal;
  }

  .ahs-dropdown .ahs-item:hover {
    background-color: rgba(0, 54, 90, 0.6) !important;
    color: white !important;
  }

  .ahs-dropdown .ahs-group-item {
    display: flex;
    cursor: pointer;
    height: 45px;
    border-bottom: 1px solid #d7d7d7;
  }

  .ahs-dropdown .ahs-group-item span {
    padding-left: 16px;
    padding-right: 16px;
    margin-top: auto;
    margin-bottom: auto;
  }

  .ahs-dropdown .ahs-group-item:hover {
    background-color: rgba(0, 54, 90, 0.6) !important;
    color: white !important;
  }

  .ahs-dropdown .ahs-group-item.selected {
    background-color: rgba(0, 54, 90, 0.6) !important;
    color: white !important;
  }

  .ahs-dropdown .ahs-list-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 400px;
    height: 100%;
  }

  .ahs-dropdown .ahs-list-container .ahs-scroll-container {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }

  .ahs-dropdown .search-bar {
    background-color: rgba(0, 54, 90, 0.6) !important;
    color: white !important;
  }

  .ahs-dropdown .reset-button-container {
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    border-top: 1px #d7d7d7 solid;
  }

  .ahs-dropdown .reset-button {
    margin-left: auto;
    margin-right: 16px;
    padding: 0;
    color: #00365a !important;
    text-decoration: underline;
  }
</style>
