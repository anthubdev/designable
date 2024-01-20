<template>
  <span
    :style="{
      background: '#eee',
      display: 'inline-block',
      padding: '10px 20px',
      border: '1px solid #ddd',
    }"
  >
    <span data-content-editable="title">{{ node.props.title }}</span>
    <slot></slot>
  </span>
</template>

<script lang="ts" setup>
import { useTreeNode } from '@antdev/designable-vue'

const node = useTreeNode()
</script>

<style lang="scss"></style>
