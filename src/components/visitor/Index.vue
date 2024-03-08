<template>
  <Header :userType="'游客'"/>
  <div style="display: flex">
    <Aside/>
    <router-view style="flex: 1"/>
  </div>
</template>

<script setup lang="ts">
import Header from '../common/Header.vue'
import Aside from './Aside.vue'
</script>

<style scoped>

</style>
