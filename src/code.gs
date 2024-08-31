function onOpen() {
  SpreadsheetApp.getUi().createMenu("Warhammer").addItem("Load Aeldari", "load_aeldari").addToUi();
}

/**
 * Looks up the named unit in the Database and returns its cost. Works with a range but only of unmodified units
 * @param {string|Array<Array<string>>} input Which unit to fetch
 * @param {bool} modified Whether the unit is using the modified cost or not
 * @return The cost
 * @customfunction
*/
function UNIT_COST(input, modified) {
  var doc_store = PropertiesService.getDocumentProperties()
  if (Array.isArray(input)) {
    return input.map(row => row.map(cell => unit_lookup(doc_store, cell)))
  } else {
    return unit_lookup(doc_store, input, modified)
  }
}

function unit_lookup(doc_store, input, modified) {
  try {
    let search_term = input
    if (modified) {
      search_term = "mod_" + input
    }
    var cost = doc_store.getProperty(search_term)
    return parseInt(cost)
  } catch (err) {
    return "Not Found"
  }
}

function loadbscribe(url) {
  var doc_store = PropertiesService.getDocumentProperties()
  var bscribe = XmlService.getNamespace("http://www.battlescribe.net/schema/catalogueSchema")
  var response = UrlFetchApp.fetch(url)
  var data = response.getContentText()
  var document = XmlService.parse(data)
  var root = document.getRootElement()
  var raw_entries = root.getChild("sharedSelectionEntries", bscribe).getChildren()
  var entries = []
  var storable_keys = {}
  raw_entries.forEach(entry => {
    let name = entry.getAttribute("name").getValue()
    let cost = entry.getChild("costs", bscribe)?.getChild("cost", bscribe).getAttribute("value").getValue()
    if(cost) {
      entries.push([name, cost])
      storable_keys[name] = cost
    }
    let modifiers = entry.getChild("modifiers", bscribe)
    if (modifiers !== null) {
      modifiers.getChildren().forEach(modifier => {
        let mod_cost = modifier.getAttribute("value")?.getValue()
        let mod_field = modifier.getAttribute("field")?.getValue()
        if (mod_cost && mod_field && mod_field === "51b2-306e-1021-d207") {
          let mod_name = "mod_" + name
          entries.push([mod_name, mod_cost])
          storable_keys[mod_name] = mod_cost
        }
      })
    }

  })
  doc_store.setProperties(storable_keys)
}


function load_aeldari(){
  loadbscribe("https://raw.githubusercontent.com/BSData/wh40k-10e/main/Aeldari%20-%20Aeldari%20Library.cat")
}