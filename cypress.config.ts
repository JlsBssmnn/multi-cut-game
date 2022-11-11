import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        countClusters() {
          let count = 0;
          
          Cypress.$('#drag-area').parent().children().each((el) => {
            console.log(el);
            // const id = el[0].id
            // if (id.startsWith('cluster')) count++
          });
          return count;
        },
        log(message) {
          console.log(message)
      
          return null
        },
      })
    },
  },

  "component": {
    "devServer": {
      "framework": "next",
      "bundler": "webpack"
    },
  },
});