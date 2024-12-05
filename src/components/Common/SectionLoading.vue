<template>
    <div class="text-center">
        <Loader class="mt-5" />
        <h2>
            <strong>{{ title }}</strong>
        </h2>
    </div>
</template>

<script>
    import { Loader } from '.';

    export default {
        props: {
            title: { required: true, type: String },
        },
        components: {
            Loader
        }
    };
</script>
