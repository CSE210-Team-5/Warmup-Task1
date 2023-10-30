
const modules = require('../src/stretchtext')
const getSummaries = modules.getSummaries
const setTitle = modules.setTitle
const isBlockLevelDetail = modules.isBlockLevelDetail
const findDetailFor = modules.findDetailFor

describe('getSummaries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should extract summaries and append it to an array', () => {
    const parser = new DOMParser();
    const dom = parser.parseFromString('<!DOCTYPE html> <html lang="en"> <head> <title>Stretch Test</title> </head> <body> <p>This is a <span data-epub-type="stretchsummary">recursion</span><span data-epub-type="stretchdetail"> This is a recursion <span data-epub-type="stretchsummary">recursion</span></span> <p>This is a <span class="stretchsummary">recursion</span><span class="stretchdetail"> This is a recursion <span class="stretchsummary">recursion</span></span></body></html>', 'text/html');
    jest.spyOn(document, 'querySelectorAll').mockImplementation(selector => dom.querySelectorAll(selector));
    jest.spyOn(document, 'getElementsByClassName').mockImplementation(selector => dom.getElementsByClassName(selector));
    mockResults = getSummaries();
    console.log(mockResults);
    expect(mockResults).toHaveLength(2);
  });
});


describe('setTitle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
    it('should set title attribute to summary if not present', () => {
    const title = 'mockTitle'
    const parser = new DOMParser();
    const dom = parser.parseFromString('<span class="stretchsummary">recursion</span>', 'text/html');
    const summary = dom.getElementsByClassName("stretchsummary")[0]
    setTitle(summary, title)
    expect(summary.getAttribute('title')).toEqual('mockTitle');
  });
});


describe('isBlockLevelDetail', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
    it('checks if a html tag is <a> tag', () => {
    const parser = new DOMParser();
    const dom = parser.parseFromString('<a href="#">recursion</a>', 'text/html');
    const htmlTag = dom.getElementsByTagName("a")[0]
    returnValue = isBlockLevelDetail(htmlTag)
    expect(returnValue).toEqual(true);
  });
});


describe('findDetailFor', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
    it('checks if a html tag is <a> tag', () => {
    const parser = new DOMParser();
    const dom = parser.parseFromString('<!DOCTYPE html> <html lang="en"> <head> <title>Stretch Test</title> </head> <body><span><a href="#link">recursion</a><span id="link">nothing</span></span></body></html>', 'text/html');
    jest.spyOn(document, 'getElementById').mockImplementation(selector => dom.getElementById(selector));
    const summary = dom.getElementsByTagName("a")[0]
    returnValue = findDetailFor(summary)
    expect(returnValue.innerHTML).toEqual("nothing");
  });
});
