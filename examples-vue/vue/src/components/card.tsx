import { defineComponent } from 'vue'
import './style.scss'

export const Card = defineComponent({
  name: 'Card',
  setup(_, { slots }) {
    return () => (
      <div class="card">
        <span>card</span>
        <div class="card-body">{slots.default?.()}</div>
      </div>
    )
  },
})
