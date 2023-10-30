// Removed IIFE
const TITLE_WHEN_CLOSED = 'Expand'
const TITLE_WHEN_OPEN = 'Collapse'

// requestAnimationFrame shimming.
// Shimming is necessary when you want to use modern JavaScript features or APIs that are not supported in older browsers
const requestAnimationFrame =
      window.requestAnimationFrame || // Standard
      window.webkitRequestAnimationFrame || // Safari, Chrome
      window.mozRequestAnimationFrame || // Firefox
      window.oRequestAnimationFrame || // Opera
      window.msRequestAnimationFrame || // Internet Explorer
      function (callback) {
        // This is the fallback method if none of the above are available
        const sixtyFPS = 1000 / 60
        window.setTimeout(callback, sixtyFPS)
      }

function toggleSummary (evt) {
  // Prevent the text from being selected if rapidly clicked.
  evt.preventDefault()

  const summary = evt.target
  const detail = findDetailFor(summary)
  if (!detail) { return }

  // CSS Transitions don't work as expected on things set to 'display: none'. Make the
  // stretch details visible if needed, then use a timeout for the transition to take
  // effect.
  if (summary.classList.contains('stretchtext-open')) {
    // If it is already open, there is no longer need for any fancy displays
    detail.style.display = 'none'
  } else {
    detail.style.display = isBlockLevelDetail(summary) ? 'block' : 'inline'
  }

  requestAnimationFrame(function () {
    summary.classList.toggle('stretchtext-open')
    detail.classList.toggle('stretchtext-open')

    if (summary.classList.contains('stretchtext-open')) {
      setTitle(summary, TITLE_WHEN_OPEN)
    } else {
      setTitle(summary, TITLE_WHEN_CLOSED)
    }
  })
}

function isBlockLevelDetail (summary) {
  return summary.nodeName.toLowerCase() === 'a'
}

function setTitle (summary, title) {
  // If the user placed a manual title on the summary leave it alone.
  // REMOVED REDUNDANT IF/ELSE
  if (!summary.hasAttribute('title')) {
    summary.setAttribute('title', title)
  }
}

function findDetailFor (summary) {
  // STREAMLINED TO ONE RETURN STATEMENT
  let detail
  if (isBlockLevelDetail(summary)) {
    // hrefs always start with #, need to remove them
    const id = summary.getAttribute('href').replace(/^#/, '')
    detail = document.getElementById(id)
    if (!detail && window.console) {
      console.error('No StretchText details element with ID: ' + id)
    }
  } else {
    detail = summary.nextElementSibling
    if (!detail && window.console) {
      console.error('No StretchText details element found for: ', summary)
    }
  }
  return detail
}

function getSummaries () {
  // Summaries are the thing that you click to expand
  const results = []
  let summaries // Initialize variable

  summaries = document.querySelectorAll('[data-epub-type="stretchsummary"]')
  Array.prototype.forEach.call(summaries, function (result) {
    results.push(result)
  })

  // // CSS class.
  // summaries = document.getElementsByClassName('stretchsummary')
  // Array.prototype.forEach.call(summaries, function (result) {
  //   results.push(result)
  // })

  return results
}

let loadedCalled = false
function loaded () {
  if (loadedCalled) { return }
  loadedCalled = true
  // FIXME(slightlyoff): Add global handlers instead of one per item.
  getSummaries().forEach(function (summary) {
    summary.setAttribute('title', TITLE_WHEN_CLOSED)

    // Listen on mousedown instead of click so that we can prevent text
    // selection if mouse is clicked rapidly.
    summary.addEventListener('mousedown', toggleSummary)

    summary.addEventListener('touchstart', toggleSummary)

    // Link resolving can't be canceled in mousedown event, only in click
    // event.
    summary.addEventListener('click', function (e) { e.preventDefault() })
  })
}

window.addEventListener('DOMContentLoaded', loaded)
if (document.readyState === 'complete') {
  loaded()
}

module.exports = {getSummaries, setTitle, isBlockLevelDetail, findDetailFor}
