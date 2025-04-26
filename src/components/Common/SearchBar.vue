<template>
    <div 
        class="search-container"
        :class="{ 'focused': isFocused }"
    >
        <input
        type="text"
        class="search-input"
        :placeholder="placeholder"
        :value="value"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
        @keyup.enter="$emit('search')"
        @focus="isFocused = true"
        @blur="isFocused = false"
        />
        <button 
        class="search-button"
        @click="$emit('search')"
        >
            <IconLup :size="iconSize" stroke="#3A3A3A" />
        </button>
    </div>
</template>
    
<script>
    import IconLup from '@/assets/icons/IconLup.vue';
    
    export default {
        name: 'SearchBar',
        components: {
            IconLup
        },
        props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Placeholder...'
        },
        disabled: {
            type: Boolean,
            default: false
        }
        },
        data() {
            return {
                isFocused: false
            }
        },
        computed: {
            iconSize() {
                return window.innerWidth >= 768 ? 20 : 16;
            }
        }
    }
</script>

<style scoped>
    .search-container {
        align-self: stretch;
        padding: 0.5rem 0.75rem;
        border-radius: 0.125rem;
        outline: 1px solid #D7D7D7;
        outline-offset: -1px;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        width: 100%;
        max-width: 100%;
    }

    .search-container.focused {
        outline-color: #4A98C9;
    }

    .search-input {
        width: 100%;
        color: #3A3A3A;
        font-size: 0.75rem;
        font-family: 'Roboto', sans-serif;
        font-weight: normal;
        line-height: 1;
        background-color: transparent;
        border: none;
        outline: none;
    }
    
    /* Add placeholder styling */
    .search-input::placeholder {
        color: #70787F;
        opacity: 1; /* Firefox adds opacity to placeholders */
    }
    
    /* Support for Microsoft Edge */
    .search-input::-ms-input-placeholder {
        color: #70787F;
    }
    
    .search-button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin-left: 0.5rem;
    }
    
    @media (min-width: 768px) {
        .search-input {
            font-size: 0.875rem;
        }
    }
</style>