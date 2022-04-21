<template>
  <span>{{name}}</span>
</template>

<script setup>
  import { inject } from "vue"
  const name = inject("provideName")
</script>
