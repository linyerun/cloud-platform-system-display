<template>
  <Header :userType="'普通用户'"/>
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
