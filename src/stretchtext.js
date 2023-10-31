/**
 * Toggle the summary element to expand or collapse its associated details.
 * @param {Event} evt - The event object triggered by the user's interaction.
 */
function toggleSummary(evt) {
  // Prevent the text from being selected if rapidly clicked.
  evt.preventDefault();

  const summary = evt.target;
  const detail = findDetailFor(summary);
  if (!detail) {
    return;
  }

  // CSS Transitions don't work as expected on things set to 'display: none'. Make the
  // stretch details visible if needed, then use a timeout for the transition to take
  // effect.
  if (summary.classList.contains('stretchtext-open')) {
    // If it is already open, there is no longer need for any fancy displays
    detail.style.display = 'none';
  } else {
    detail.style.display = isBlockLevelDetail(summary) ? 'block' : 'inline';
  }

  requestAnimationFrame(function () {
    summary.classList.toggle('stretchtext-open');
    detail.classList.toggle('stretchtext-open');

    if (summary.classList.contains('stretchtext-open')) {
      setTitle(summary, TITLE_WHEN_OPEN);
    } else {
      setTitle(summary, TITLE_WHEN_CLOSED);
    }
  });
}

/**
 * Check if the given summary element represents a block-level detail.
 * @param {Element} summary - The summary element to check.
 * @returns {boolean} - `true` if the summary is a block-level detail, `false` otherwise.
 */
function isBlockLevelDetail(summary) {
  return summary.nodeName.toLowerCase() === 'a';
}

/**
 * Set the title attribute of a summary element.
 * @param {Element} summary - The summary element to set the title for.
 * @param {string} title - The title to set.
 */
function setTitle(summary, title) {
  // If the user placed a manual title on the summary leave it alone.
  // REMOVED REDUNDANT IF/ELSE
  if (!summary.hasAttribute('title')) {
    summary.setAttribute('title', title);
  }
}

/**
 * Find the associated details element for a given summary element.
 * @param {Element} summary - The summary element to find the associated details for.
 * @returns {Element|null} - The associated details element, or `null` if not found.
 */
function findDetailFor(summary) {
  // STREAMLINED TO ONE RETURN STATEMENT
  let detail;
  if (isBlockLevelDetail(summary)) {
    // hrefs always start with #, need to remove them
    const id = summary.getAttribute('href').replace(/^#/, '');
    detail = document.getElementById(id);
    if (!detail && window.console) {
      console.error('No StretchText details element with ID: ' + id);
    }
  } else {
    detail = summary.nextElementSibling;
    if (!detail && window.console) {
      console.error('No StretchText details element found for: ', summary);
    }
  }
  return detail;
}

/**
 * Get all summary elements with a specific data attribute.
 * @returns {Array<Element>} - An array of summary elements with the specified data attribute.
 */
function getSummaries() {
  // Summaries are the thing that you click to expand
  const results = [];
  let summaries; // Initialize variable

  summaries = document.querySelectorAll('[data-epub-type="stretchsummary"]');
  Array.prototype.forEach.call(summaries, function (result) {
    results.push(result);
  });

  return results;
}

/**
 * Initialize the functionality when the DOM content is loaded.
 */
function loaded() {
  if (loadedCalled) {
    return;
  }
  loadedCalled = true;
  // FIXME(slightlyoff): Add global handlers instead of one per item.
  getSummaries().forEach(function (summary) {
    summary.setAttribute('title', TITLE_WHEN_CLOSED);

    // Listen on mousedown instead of click so that we can prevent text
    // selection if the mouse is clicked rapidly.
    summary.addEventListener('mousedown', toggleSummary);

    summary.addEventListener('touchstart', toggleSummary);

    // Link resolving can't be canceled in mousedown event, only in the click
    // event.
    summary.addEventListener('click', function (e) { e.preventDefault(); });
  });
}

/**
 * Event handler for when the DOM content is fully loaded.
 */
function onDOMContentLoaded() {
  loaded();
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);

if (document.readyState === 'complete') {
  loaded();
}

if (typeof module === 'object') {
  module.exports = { getSummaries, setTitle, isBlockLevelDetail, findDetailFor };
}