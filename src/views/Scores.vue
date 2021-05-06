<template>
    <div class="scores">
        <h4 v-if="loading" variant="info">Loading...</h4>
        <h4 v-if="scores.length == 0">No scores have been submitted yet. Be the first to do it!</h4>
        <ScoreTable v-else :scores="scores" />
    </div>
</template>

<script>
import ScoreTable from '@/components/ScoreTable.vue'
import api from '@/api'
export default {
  name: 'scoretable',
  components: { ScoreTable },
  data () {
    return {
      loading: false,
      scores: []
    }
  },
  async created () {
    this.refreshScores()
  },
  methods: {
    async refreshScores () {
      this.loading = true
      this.scores = await api.getHighscores()
      this.scores.sort((a, b) => b.score - a.score)
      this.loading = false
    }
  }
}
</script>
