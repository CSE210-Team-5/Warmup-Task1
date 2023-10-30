function getSummaries () {
  // Summaries are the thing that you click to expand
  const results = []
  let summaries // Initialize variable

  summaries = document.querySelectorAll('[data-epub-type="stretchsummary"]')
  Array.prototype.forEach.call(summaries, function (result) {
    results.push(result)
  })

  // CSS class.
  summaries = document.getElementsByClassName('stretchsummary')
  Array.prototype.forEach.call(summaries, function (result) {
    results.push(result)
  })

  return results
}

module.exports = getSummaries