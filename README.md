# warhammer_sheets
AppScript for Warhammer Sheets

Connects to [BSData](https://github.com/BSData) and downloads unit cost information.

## Installation
Create an AppScript extension in your gsheet, copy and paste the contents of src/code.gs into the project code.gs

## Usage
To load data, use the Warhammer menu in the top. This populates the cost into storage for usage in cells.

To get unit data for a unit, use the formula `UNIT_COST`. It accepts the unit name and whether that unit is "modified" (ie 2 Talos models instead of the default 1). 
Examples:
* `=UNIT_COST("Dark Reapers")` Unmodified cost
* `=UNIT_COST("Dark Reapers", True)` Modified cost
* `=UNIT_COST(A7, B19)` Cost of the model whose name is in cell A7 and modification status is in cell B19. You do not need quotes on names in cells.

Each call of UNIT_COST is a little slow. It also accepts ranges of unmodified units. The cell with the formula gets populated with one result, then each cell below it is overflowed.
* `=UNIT_COST(C1:C30)`
