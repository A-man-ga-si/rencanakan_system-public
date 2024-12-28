<template>
  <div style="display: flex; gap: 8px">
    <!-- Prev Actions -->
    <button class="page-nav" @click="onClickPrevButton">
      <IconLeftChevron />
    </button>

    <div v-if="totalPage < 5" class="page-num-container">
      <button
        v-for="index in [...Array(this.totalPage)].map((_, index) => index + 1)"
        :key="index"
        :style="pageNumStyle(index == currentPage)"
        class="page-nav"
        @click="() => onClickPageNumButton(index)"
      >
        {{ index }}
      </button>
    </div>

    <div v-else-if="currentPage < 5" class="page-num-container">
      <button
        v-for="index in [1, 2, 3, 4, 5]"
        :key="index"
        :style="pageNumStyle(index == currentPage)"
        class="page-nav"
        @click="() => onClickPageNumButton(index)"
      >
        {{ index }}
      </button>
      <button class="page-nav">...</button>
      <button class="page-nav" @click="() => onClickPageNumButton(totalPage)">
        {{ totalPage }}
      </button>
    </div>

    <!-- Page Numbers -->
    <div
      v-else-if="currentPage >= 5 && currentPage <= totalPage - 4"
      class="page-num-container"
    >
      <button class="page-nav" @click="() => onClickPageNumButton(1)">1</button>
      <button class="page-nav">...</button>
      <button
        v-for="index in [-1, 0, 1]"
        :key="index"
        :style="pageNumStyle(currentPage + index == currentPage)"
        class="page-nav"
        @click="() => onClickPageNumButton(currentPage + index)"
      >
        {{ currentPage + index }}
      </button>
      <button class="page-nav">...</button>
      <button class="page-nav" @click="() => onClickPageNumButton(totalPage)">
        {{ totalPage }}
      </button>
    </div>

    <div v-else-if="currentPage > totalPage - 4" class="page-num-container">
      <button class="page-nav" @click="() => onClickPageNumButton(1)">1</button>
      <button class="page-nav">...</button>
      <button
        v-for="index in [4, 3, 2, 1, 0]"
        :key="index"
        :style="pageNumStyle(totalPage - index == currentPage)"
        class="page-nav"
        @click="() => onClickPageNumButton(totalPage - index)"
      >
        {{ totalPage - index }}
      </button>
    </div>

    <!-- Next Actions -->
    <button class="page-nav" @click="onClickNextButton">
      <IconRightChevron />
    </button>
  </div>
</template>

<style scoped>
  button {
    background-color: white;
    border: none;
    min-width: 34px;
    height: 34px;
    padding: 0px;
  }

  .page-nav {
    padding: 4px;
    border-radius: 6px;
    color: #00365a;
  }

  .page-nav svg {
    fill: #00365a;
    height: 16px;
    width: 16px;
  }

  .page-num-container {
    display: flex;
    gap: 8px;
  }
</style>

<script>
  import { IconLeftChevron, IconRightChevron } from '@/assets/icons';

  export default {
    props: {
      currentPage: Number,
      totalPage: Number,
      onChangePage: Function,
    },
    methods: {
      pageNumStyle(isActive) {
        return {
          border: '1px solid',
          borderColor: isActive ? '#00365a' : 'white',
          background: isActive ? '#00365a' : 'white',
          color: isActive ? 'white' : '#00365a',
        };
      },
      onClickPageNumButton(index) {
        this.onChangePage(index);
      },
      onClickFirstPageButton() {
        this.onChangePage(1);
      },
      onClickPrevButton() {
        if (this.currentPage == 1) {
          return;
        }
        this.onChangePage(this.currentPage - 1);
      },
      onClickNextButton() {
        if (this.currentPage === this.totalPage) {
          return;
        }
        this.onChangePage(this.currentPage + 1);
      },
      onClickLastPageButton() {
        this.onChangePage(this.totalPage);
      },
    },
    components: {
      IconLeftChevron,
      IconRightChevron,
    },
  };
</script>
