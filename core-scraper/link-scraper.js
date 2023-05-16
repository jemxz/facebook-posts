module.exports = async function getLink(divSelector, page) {
  const links = [];
  const elements = await page.$$(divSelector);
  console.log(elements.length);
  for (const element of elements) {
    await element.hover();
    // Wait for a brief moment if needed to observe the hover effect
    await page.waitForTimeout(1000);
  }

  try {
    let div_selector = divSelector;

    let list_length = await page.evaluate((sel) => {
      let elements = Array.from(document.querySelectorAll(sel));
      return elements.length;
    }, div_selector);

    // console.log(list_length);

    for (let i = 0; i < list_length; i++) {
      var href = await page.evaluate(
        (l, sel) => {
          let elements = Array.from(document.querySelectorAll("a" + sel));

          return elements[l] ? elements[l].href : "";
        },
        i,
        div_selector
      );
      links.push(href);
    }
  } catch (error) {
    return console.log(error.message);
  }
  console.log(links);
  return links;
};
